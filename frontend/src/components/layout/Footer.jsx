import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-20 bg-ink text-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="font-display text-xl tracking-tightest">SHOPSPHERE</div>
          <p className="mt-3 text-sm text-paper/60 max-w-xs">
            Considered basics, cut for everyday wear. Designed to last a season past the trend.
          </p>
        </div>
        <div>
          <div className="eyebrow text-paper/50 mb-3">Shop</div>
          <ul className="space-y-2 text-sm text-paper/80">
            <li><Link to="/products?newArrivals=true" className="hover:text-paper">New Arrivals</Link></li>
            <li><Link to="/products" className="hover:text-paper">All Products</Link></li>
            <li><Link to="/wishlist" className="hover:text-paper">Wishlist</Link></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow text-paper/50 mb-3">Account</div>
          <ul className="space-y-2 text-sm text-paper/80">
            <li><Link to="/orders" className="hover:text-paper">My Orders</Link></li>
            <li><Link to="/cart" className="hover:text-paper">Cart</Link></li>
            <li><Link to="/login" className="hover:text-paper">Login</Link></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow text-paper/50 mb-3">Support</div>
          <ul className="space-y-2 text-sm text-paper/80">
            <li>help@shopsphere.com</li>
            <li>Mon–Sat, 10am–6pm</li>
          </ul>
        </div>
      </div>
      <div className="stitch-rule text-paper/20" />
      <div className="text-center text-xs text-paper/40 py-4 font-mono">
        © {new Date().getFullYear()} ShopSphere. All rights reserved.
      </div>
    </footer>
  );
}
