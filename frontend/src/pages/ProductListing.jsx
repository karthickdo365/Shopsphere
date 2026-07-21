import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../api/products';
import { getWishlist } from '../api/wishlist';
import { useAuth } from '../context/AuthContext';
import ProductGrid from '../components/product/ProductGrid';

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [likedIds, setLikedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const category = searchParams.get('category') || '';
  const subCategory = searchParams.get('subCategory') || '';
  const search = searchParams.get('search') || '';
  const newArrivals = searchParams.get('newArrivals') || '';
  const page = Number(searchParams.get('page') || 1);

  useEffect(() => {
    setLoading(true);
    getProducts({ category, subCategory, search, newArrivals, page, limit: 12 })
      .then((res) => {
        setProducts(res.data);
        setPagination(res.pagination);
      })
      .finally(() => setLoading(false));
  }, [category, subCategory, search, newArrivals, page]);

  useEffect(() => {
    if (!user) return;
    getWishlist().then((items) => setLikedIds(new Set(items.map((i) => i.productId)))).catch(() => {});
  }, [user]);

  const handleLikeToggle = (productId, liked) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      liked ? next.add(productId) : next.delete(productId);
      return next;
    });
  };

  const goToPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', p);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const heading = subCategory || category || (search && `“${search}”`) || (newArrivals && 'New Arrivals') || 'All Products';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <p className="eyebrow mb-1">{pagination.total} result{pagination.total === 1 ? '' : 's'}</p>
      <h1 className="font-display text-3xl sm:text-4xl tracking-tightest capitalize mb-6">{heading}</h1>

      {loading ? (
        <p className="text-sm text-ink/50 py-16 text-center">Loading products…</p>
      ) : (
        <>
          <ProductGrid products={products} likedIds={likedIds} onLikeToggle={handleLikeToggle} />
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`w-9 h-9 text-sm font-mono border ${
                    p === pagination.page ? 'bg-ink text-paper border-ink' : 'border-line text-ink hover:border-ink'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
