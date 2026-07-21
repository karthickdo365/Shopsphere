# ShopSphere — Frontend (React + Vite + Tailwind)

Storefront + Admin panel, wired to the `shopsphere-backend` API.

## Setup

```bash
cd shopsphere-frontend
npm install
npm run dev       # http://localhost:5173
```

The dev server proxies `/api/*` to `http://localhost:5000` (see `vite.config.js`), so **make sure the backend is running first**. In production, either serve both from the same domain behind a reverse proxy, or point `baseURL` in `src/api/axios.js` at your deployed API URL and set `CLIENT_URL` in the backend `.env` to match this app's deployed URL (for CORS + cookies).

## Design direction

Fashion/apparel storefront — denim-blue as the primary accent (ties to the product line: pants, jeans), with a signature "swing-tag" price badge (the die-cut clothing-tag shape with a punched hole) on every product card, and a dashed "stitch" rule used as a section divider throughout. Display type is a bold condensed caps face (Anton) for headings, paired with Inter for body copy and a monospace face for prices/SKUs — like a price tag.

## What's wired up

- **Auth**: login/register/logout, silent refresh on page load (calls `/auth/refresh` using the httpOnly cookie so a session survives a browser refresh), automatic retry-after-refresh on any request that gets a 401. Also wired: email verification (`/verify-email/:token` page + a dismissible "resend" banner in the header for unverified users) and forgot/reset password (`/forgot-password` and `/reset-password/:token` pages, linked from the login form).
- **Header**: category dropdown built from `GET /categories` (nested subcategories) — clicking "Pants" under "Men" routes to `/products?category=men&subCategory=pants`, exactly matching the backend filter.
- **Search bar**: debounced, routes to `/products?search=...`.
- **Home**: banner carousel, category grid, new arrivals row.
- **Product listing/detail**: filters via URL params, size selection, add-to-cart, wishlist heart, reviews (read-only for now).
- **Cart / Wishlist**: full CRUD against the backend.
- **Checkout**: creates a Razorpay order via `/orders/checkout`, opens Razorpay Checkout, verifies the payment via `/orders/verify-payment` on success.
- **Orders**: order history with status badges.
- **Admin panel** (`/admin`, requires an ADMIN-role login): Dashboard (stat cards + recent orders), Products (CRUD with drag-and-drop multi-image gallery upload), Categories/Subcategories (CRUD with image upload), Banners (CRUD + drag-and-drop image upload + active toggle), Order List (status updates), Customers (derived from order history — see note below).
- **Image uploads**: `ImageUpload` (single image) and `ImageGalleryUpload` (multi-image, for product galleries) components handle drag-and-drop or click-to-browse, upload to `POST /upload` / `POST /upload/multiple` on the backend, show a live preview, and store the returned URL(s) in form state. No more manually pasting image URLs.

## Known gaps / next steps

- **Admin Customers page** currently derives its list from order history since there's no `GET /users` (Admin) endpoint yet in the backend — customers with zero orders won't show up. Add that endpoint to get a full user directory with role management (promote to admin, disable account).
- **Product reviews** are read-only in the UI; there's no "write a review" form yet, though the backend `Review` model already supports it.
- Sizes on the product page are a fixed list (S–XL) rather than per-product stock-by-size; if you need per-size inventory, that's a schema change (a `ProductVariant` model) worth doing before launch.
- No test suite yet — for a client project, at minimum add checkout/payment-verification integration tests before going live with real money.

## Testing the Razorpay flow locally

Use Razorpay's test mode keys (`rzp_test_...`) in both `.env` files. Test card: `4111 1111 1111 1111`, any future expiry, any CVV. Test UPI: `success@razorpay`.
