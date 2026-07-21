import { Link } from 'react-router-dom';

export default function CategoryGrid({ categories }) {
  if (!categories?.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-display text-2xl sm:text-3xl tracking-tightest">SHOP BY CATEGORY</h2>
        <div className="flex-1 mx-4 stitch-rule hidden sm:block" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/products?category=${cat.slug}`}
            className="group relative aspect-square bg-white border border-line overflow-hidden"
          >
            <img
              src={cat.image || 'https://placehold.co/400x400?text=' + cat.name}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-ink/20 group-hover:bg-ink/40 transition-colors" />
            <span className="absolute bottom-3 left-3 text-paper font-semibold uppercase tracking-wide text-sm">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
