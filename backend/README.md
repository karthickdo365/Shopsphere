# ShopSphere — Ecommerce Platform

Full-stack ecommerce project: **React (frontend) + Express + Prisma + PostgreSQL (backend)**, JWT auth, Razorpay payments, Swagger API docs.

---

## 1. Backend Setup (this folder)

```bash
cd shopsphere-backend
cp .env.example .env      # fill in DATABASE_URL, JWT secrets, Razorpay keys
npm install

# Create the database tables from schema.prisma
npx prisma migrate dev --name init
npx prisma generate

# Seed an admin user + sample categories/products
npm run prisma:seed

# Run the API
npm run dev
```

- API base URL: `http://localhost:5000/api/v1`
- Swagger docs (test every endpoint from the browser): `http://localhost:5000/api-docs`
- Seeded admin login: `admin@shopsphere.com` / `Admin@123`

Generate real random secrets for `.env` before going to production:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 2. Database (PostgreSQL)

Easiest local option: `docker run --name shopsphere-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=shopsphere -p 5432:5432 -d postgres:16`. For production, use a managed Postgres (Neon, Supabase, Railway, RDS).

## 3. JWT Auth Flow (already implemented)

- **Register/Login** → server returns a short-lived **access token** (15 min, sent in response body, store in memory/React state — not localStorage, to reduce XSS risk) and a long-lived **refresh token** (7 days, set as an `httpOnly` cookie, so JS can't read it).
- Every protected request sends `Authorization: Bearer <accessToken>`.
- When the access token expires, frontend calls `POST /auth/refresh` (cookie sent automatically) to get a new one silently.
- `POST /auth/logout` clears the refresh token both in DB and cookie.
- Roles: `USER` and `ADMIN` — `adminOnly` middleware guards all admin routes (products, categories, banners, order status updates).

### Email verification
- On `POST /auth/register`, a random token is generated, its SHA-256 hash is stored on the user (never the raw token), and a verification email is sent with a link to `<CLIENT_URL>/verify-email/<rawToken>`.
- The user is still logged in immediately after registering — verification isn't required to browse or buy, only flagged in the UI (`isEmailVerified: false`) with a "resend" prompt. If you want to *require* verification before checkout, add an `isEmailVerified` check in `order.controller.js`'s `checkout` function.
- `POST /auth/verify-email { token }` looks up the token by its hash and checks it hasn't expired (24h), then flips `isEmailVerified` to `true`.
- `POST /auth/resend-verification` (logged in) issues a fresh token/email if the old one expired or was lost.

### Forgot / reset password
- `POST /auth/forgot-password { email }` — always returns the same generic success message whether or not the email exists (prevents attackers from using this endpoint to discover registered emails). If it does exist, a reset token (1h expiry, hashed the same way as email verification) is emailed with a link to `<CLIENT_URL>/reset-password/<rawToken>`.
- `POST /auth/reset-password { token, password }` — validates the token, hashes the new password, and **invalidates the user's refresh token**, forcing any existing session to log in again with the new password.

### Email delivery
Uses Nodemailer (`src/utils/email.js`), configured via `EMAIL_HOST`/`EMAIL_PORT`/`EMAIL_USER`/`EMAIL_PASS` in `.env`. **If `EMAIL_HOST` is left blank, emails aren't actually sent — the content is printed to the backend console instead**, so you can copy the verification/reset link straight out of the terminal during local development without setting up SMTP. For real sending, any SMTP provider works: a Gmail account with an [App Password](https://support.google.com/accounts/answer/185833), or a dedicated service like Mailtrap (great for testing), SendGrid, Resend, or Amazon SES.

**After pulling this update, run a migration** to add the new columns:
```bash
npx prisma migrate dev --name add-auth-verification-reset
```

## 4. Razorpay Payment Flow (already implemented)

1. User checks out → `POST /orders/checkout` creates a `PENDING` order in your DB **and** a Razorpay order, returns `razorpayOrderId` + `keyId`.
2. Frontend opens Razorpay Checkout (see snippet below) using those values.
3. On success, Razorpay returns `razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature` to the frontend.
4. Frontend sends those to `POST /orders/verify-payment`. **Server re-computes the HMAC signature and compares it** — this is the step that actually proves the payment is genuine, never trust the frontend alone.
5. On match: order → `PAID`, stock decremented, cart cleared.

Frontend Razorpay checkout snippet (after checkout API call):
```js
const res = await fetch('/api/v1/orders/checkout', { method: 'POST', ... });
const { razorpayOrderId, amount, currency, keyId, orderId } = (await res.json()).data;

const options = {
  key: keyId,
  amount,
  currency,
  order_id: razorpayOrderId,
  handler: async (response) => {
    await fetch('/api/v1/orders/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ ...response, orderId }),
    });
  },
  theme: { color: '#111827' },
};
new window.Razorpay(options).open();
```
Load the Razorpay script in `index.html`: `<script src="https://checkout.razorpay.com/v1/checkout.js"></script>`

## 5. API Reference (also live in Swagger)

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | /auth/register | - | Create account |
| POST | /auth/login | - | Login |
| POST | /auth/refresh | cookie | New access token |
| POST | /auth/logout | - | Logout |
| GET | /auth/me | User | Current profile |
| POST | /auth/verify-email | - | Verify email using token from email link |
| POST | /auth/resend-verification | User | Resend verification email |
| POST | /auth/forgot-password | - | Request password reset email |
| POST | /auth/reset-password | - | Set new password using token from email link |
| GET | /products | - | List/filter/search products |
| GET | /products/:slug | - | Product detail |
| POST/PUT/DELETE | /products | Admin | Manage products |
| GET | /categories | - | Nav menu (category > subcategory tree) |
| POST/PUT/DELETE | /categories | Admin | Manage categories/subcategories |
| GET | /banners | - | Homepage banners |
| POST/PUT/DELETE | /banners | Admin | Manage banners |
| GET/POST/PUT/DELETE | /cart | User | Cart CRUD |
| GET/POST/DELETE | /wishlist | User | Liked products |
| POST | /orders/checkout | User | Start Razorpay order |
| POST | /orders/verify-payment | User | Confirm payment |
| GET | /orders | User | My orders |
| GET | /orders/admin/all | Admin | Order List page |
| PUT | /orders/:id/status | Admin | Update order status |
| POST | /upload | Admin | Upload one image (form field `image`), returns `{ url }` |
| POST | /upload/multiple | Admin | Upload up to 6 images (form field `images`), returns `{ urls }` |

## 6. Frontend Plan (React)

Suggested structure:
```
shopsphere-frontend/
  src/
    api/              # axios instance + one file per resource (auth.js, products.js, orders.js...)
    context/          # AuthContext (user, accessToken, login/logout, silent refresh)
    components/
      layout/          Header, Footer, SearchBar
      home/            BannerCarousel, NewArrivals, CategoryGrid
      product/         ProductCard, ProductGrid, ProductDetail
      cart/            CartDrawer, CartItem
    pages/
      user/            Home, ProductListing (by category/subcategory), ProductDetail, Cart, Wishlist, Checkout, Orders, Profile
      admin/            Dashboard, Products, Categories, Banners, OrderList, Customers
    routes/            AppRouter.jsx, ProtectedRoute.jsx, AdminRoute.jsx
```

Key wiring notes:
- **Axios instance**: attach `Authorization` header from context; add a response interceptor that calls `/auth/refresh` on a 401 and retries once.
- **Header → category click → pants page**: Header renders categories from `GET /categories` (each has nested `subCategories`). Clicking "Pants" navigates to `/products?category=men&subCategory=pants`, and `ProductListing` reads those query params and calls `GET /products?category=men&subCategory=pants`.
- **Search bar**: debounce input, call `GET /products?search=...`.
- **New Arrivals row on Home**: `GET /products?newArrivals=true`.
- **Wishlist heart icon** on `ProductCard`: `POST/DELETE /wishlist`.
- **Admin Dashboard**: simple stat cards (total orders, revenue, products, customers) computed from `/orders/admin/all` and `/products`.
- **Customer List (Admin)**: add a `GET /users` (Admin-only) endpoint later — not yet built, flagged below.

### Image uploads (now built)
`POST /upload` and `POST /upload/multiple` (both Admin-only) accept real image files via `multipart/form-data`, save them to the `uploads/` folder, and return public URLs like `http://localhost:5000/uploads/<filename>.jpg`. Files are served statically from `/uploads`. Max 5MB per file, JPG/PNG/WEBP/GIF only.

**Production note:** local disk storage works for a single server but won't survive a redeploy on most PaaS hosts (Render, Railway, etc. wipe the filesystem on each deploy) and won't work at all if you run multiple server instances. Before going live, swap `src/config/upload.js`'s `diskStorage` for an S3-compatible bucket (e.g. `multer-s3`, or Cloudinary's SDK) — the controller/route interface stays the same, only the storage engine changes.

### Not yet built (tell me which to do next)
- Admin "Customers/Customer List" endpoint (`GET /users`, Admin) + a "make admin"/disable toggle.
- Product reviews endpoints (schema already supports it).

## 7. Suggested delivery order for your client

1. Backend (done) → deploy to Render/Railway with managed Postgres.
2. React admin panel: Products, Categories, Banners, Orders — this is what your client will use daily.
3. React storefront: Home, listing, product detail, cart, checkout + Razorpay.
4. Polish: order status emails, search relevance, image optimization, SEO meta tags.
