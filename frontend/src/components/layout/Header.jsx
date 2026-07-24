import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCategories } from '../../api/categories';
import { useAuth } from '../../context/AuthContext';
import { resendVerification } from '../../api/auth';
import SearchBar from './SearchBar';
import { getWishlist } from "../../api/wishlist"; 
import { getCart } from "../../api/cart";

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [openCat, setOpenCat] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resendStatus, setResendStatus] = useState('');
  const { user, isAdmin, logout } = useAuth();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const handleResend = async () => {
    setResendStatus('sending');
    try {
      await resendVerification();
      setResendStatus('sent');
    } catch {
      setResendStatus('error');
    }
  };

useEffect(() => {
  getCategories()
    .then(setCategories)
    .catch(() => setCategories([]));

  if (user) {
    getWishlist()
      .then((items) => setWishlistCount(items.length))
      .catch(() => setWishlistCount(0));

    getCart()
      .then((items) => setCartCount(items.length))
      .catch(() => setCartCount(0));
  } else {
    setWishlistCount(0);
    setCartCount(0);
  }
}, [user]);

  const goToListing = (categorySlug, subCategorySlug) => {
    setOpenCat(null);
    setMobileOpen(false);
    const params = new URLSearchParams();
    if (categorySlug) params.set('category', categorySlug);
    if (subCategorySlug) params.set('subCategory', subCategorySlug);
    navigate(`/products?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-line">
      {/* Top strip */}
      <div className="bg-ink text-paper text-center text-[11px] font-mono tracking-widest2 uppercase py-1.5">
        Free shipping on orders over ₹999 · COD available
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="shrink-0 font-display text-2xl tracking-tightest text-ink">
            SHOP<span className="text-denim">SPHERE</span>
          </Link>

          {/* Category nav (desktop) */}
          <nav className="hidden lg:flex items-center gap-6 relative">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="relative"
                onMouseEnter={() => setOpenCat(cat.id)}
                onMouseLeave={() => setOpenCat(null)}
              >
                <button
                  onClick={() => goToListing(cat.slug)}
                  className="text-sm font-semibold uppercase tracking-wide text-ink hover:text-denim py-6"
                >
                  {cat.name}
                </button>
                {openCat === cat.id && cat.subCategories?.length > 0 && (
                  <div className="absolute left-0 top-full bg-paper border border-line shadow-lg min-w-[200px] py-2 animate-[fadeIn_0.1s_ease-in]">
                    {cat.subCategories.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => goToListing(cat.slug, sub.slug)}
                        className="block w-full text-left px-4 py-2 text-sm text-ink hover:bg-denim hover:text-paper transition-colors"
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link to="/products?newArrivals=true" className="text-sm font-semibold uppercase tracking-wide text-rust py-6">
              New Arrivals
            </Link>
          </nav>

          {/* Search (desktop) */}
          <div className="hidden md:block flex-1 max-w-xs">
            <SearchBar />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4 shrink-0">
            <Link
  to="/wishlist"
  aria-label="Wishlist"
  className="relative text-ink hover:text-denim"
>
  <HeartIcon />

  {wishlistCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-rust text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
      {wishlistCount}
    </span>
  )}
</Link>
            <Link
  to="/cart"
  aria-label="Cart"
  className="relative text-ink hover:text-denim"
>
  <BagIcon />

  {cartCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-denim text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
      {cartCount}
    </span>
  )}
</Link>
            {user ? (
              <div className="relative group hidden sm:block">
                <button className="text-sm font-semibold text-ink hover:text-denim">
                  Hi, {user.name.split(' ')[0]}
                </button>
                <div className="absolute right-0 top-full hidden group-hover:block bg-paper border border-line shadow-lg min-w-[160px] py-2 z-50">
                  <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-denim hover:text-paper">My Orders</Link>
                  {isAdmin && (
                    <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-denim hover:text-paper">Admin Panel</Link>
                  )}
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm hover:bg-denim hover:text-paper">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:block text-sm font-semibold text-ink hover:text-denim">
                Login
              </Link>
            )}
            <button className="lg:hidden text-ink" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>

      <div className="stitch-rule" />

      {user && !user.isEmailVerified && (
        <div className="bg-mustard/20 border-b border-line text-center text-xs py-1.5 px-4">
          Please verify your email to unlock all features.{' '}
          {resendStatus === 'sent' ? (
            <span className="font-semibold text-denim">Verification email sent — check your inbox.</span>
          ) : (
            <button onClick={handleResend} disabled={resendStatus === 'sending'} className="font-semibold text-denim hover:underline">
              {resendStatus === 'sending' ? 'Sending…' : 'Resend email'}
            </button>
          )}
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-line bg-paper px-4 py-4 space-y-3">
          <SearchBar />
          {categories.map((cat) => (
            <div key={cat.id}>
              <button onClick={() => goToListing(cat.slug)} className="font-semibold uppercase text-sm">
                {cat.name}
              </button>
              <div className="pl-3 mt-1 space-y-1">
                {cat.subCategories?.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => goToListing(cat.slug, sub.slug)}
                    className="block text-sm text-ink/70"
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <Link to="/products?newArrivals=true" className="block font-semibold text-sm text-rust">New Arrivals</Link>
          {!user && <Link to="/login" className="block font-semibold text-sm">Login</Link>}
        </div>
      )}
    </header>
  );
}

function HeartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s-7.5-4.7-10-9.3C.5 8 2 4.5 5.5 4c2-.3 3.7.7 4.5 2 .8-1.3 2.5-2.3 4.5-2 3.5.5 5 4 3.5 7.7C19.5 16.3 12 21 12 21z" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V6a3 3 0 016 0v2" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
