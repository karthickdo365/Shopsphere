import { useEffect, useState } from 'react';
import { getBanners } from '../api/banners';
import { getCategories } from '../api/categories';
import { getProducts } from '../api/products';
import { getWishlist } from '../api/wishlist';
import { useAuth } from '../context/AuthContext';
import BannerCarousel from '../components/home/BannerCarousel';
import CategoryGrid from '../components/home/CategoryGrid';
import ProductGrid from '../components/product/ProductGrid';
import ProductSkeleton from "../components/common/ProductSkeleton";

export default function Home() {
  const { user } = useAuth();
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [likedIds, setLikedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [b, c, p] = await Promise.all([
        getBanners().catch(() => []),
        getCategories().catch(() => []),
        getProducts({ newArrivals: true, limit: 8 }).catch(() => ({ data: [] })),
      ]);
      setBanners(b);
      setCategories(c);
      setNewArrivals(p.data);
      setLoading(false);
    })();
  }, []);

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

  return (
    <div>
      <BannerCarousel banners={banners} />
      <CategoryGrid categories={categories} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-2xl sm:text-3xl tracking-tightest text-rust">NEW ARRIVALS</h2>
          <div className="flex-1 mx-4 stitch-rule hidden sm:block" />
          <a href="/products?newArrivals=true" className="text-sm font-semibold text-denim hover:underline">
            View all
          </a>
        </div>
        {loading ? (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, index) => (
      <ProductSkeleton key={index} />
    ))}
  </div>
) : (
  <ProductGrid
    products={newArrivals}
    likedIds={likedIds}
    onLikeToggle={handleLikeToggle}
  />
)}
      </section>
    </div>
  );
}
