import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function BannerCarousel({ banners }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, [banners.length]);

  if (!banners?.length) return null;
  const banner = banners[index];

  return (
    <div className="relative w-full aspect-[16/6] min-h-[220px] bg-ink overflow-hidden">
      <img
        key={banner.id}
        src={banner.image}
        alt={banner.title}
        className="w-full h-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
      <div className="absolute bottom-6 left-4 sm:left-8">
        <p className="eyebrow text-mustard mb-2">Season Drop</p>
        <h2 className="font-display text-3xl sm:text-5xl text-paper tracking-tightest max-w-xl">
          {banner.title}
        </h2>
        {banner.link && (
          <Link
            to={banner.link}
            className="inline-block mt-4 bg-paper text-ink text-sm font-semibold uppercase tracking-wide px-5 py-2 hover:bg-denim hover:text-paper transition-colors"
          >
            Shop Now
          </Link>
        )}
      </div>
      {banners.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-1.5">
          {banners.map((b, i) => (
            <button
              key={b.id}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-6 h-1 ${i === index ? 'bg-paper' : 'bg-paper/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
