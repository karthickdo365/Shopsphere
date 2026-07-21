import ProductCard from './ProductCard';

export default function ProductGrid({ products, likedIds = new Set(), onLikeToggle }) {
  if (!products?.length) {
    return (
      <div className="py-16 text-center">
        <p className="font-display text-2xl text-ink/30 tracking-tightest">NOTHING HERE YET</p>
        <p className="text-sm text-ink/50 mt-2">Try a different search or check back soon.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} liked={likedIds.has(p.id)} onLikeToggle={onLikeToggle} />
      ))}
    </div>
  );
}
