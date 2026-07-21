import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWishlist } from '../api/wishlist';
import ProductGrid from '../components/product/ProductGrid';

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    getWishlist().then(setItems).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const products = items.map((i) => i.product);
  const likedIds = new Set(items.map((i) => i.productId));

  const handleLikeToggle = (productId, liked) => {
    if (!liked) setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl tracking-tightest mb-6">YOUR WISHLIST</h1>
      {loading ? (
        <p className="text-sm text-ink/50">Loading…</p>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-ink/50 text-sm">Nothing saved yet.</p>
          <Link to="/products" className="inline-block mt-3 text-sm font-semibold text-denim hover:underline">
            Browse products →
          </Link>
        </div>
      ) : (
        <ProductGrid products={products} likedIds={likedIds} onLikeToggle={handleLikeToggle} />
      )}
    </div>
  );
}
