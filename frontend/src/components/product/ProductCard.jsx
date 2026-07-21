import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { addToWishlist, removeFromWishlist } from '../../api/wishlist';

export default function ProductCard({ product, liked, onLikeToggle }) {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const hasDiscount = product.discountPrice && Number(product.discountPrice) < Number(product.price);

  const toggleLike = async (e) => {
    e.preventDefault();
    if (!user || busy) return;
    setBusy(true);
    try {
      if (liked) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product.id);
      }
      onLikeToggle?.(product.id, !liked);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Link to={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] bg-white overflow-hidden border border-line">
        <img
          src={product.images?.[0] || 'https://placehold.co/600x800?text=ShopSphere'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
        />
        {product.isNewArrival && (
          <span className="absolute top-2 left-2 bg-mustard text-ink text-[10px] font-mono font-bold uppercase tracking-widest2 px-2 py-1">
            New
          </span>
        )}
        {hasDiscount && (
          <span className="absolute top-2 right-2 bg-rust text-paper text-[10px] font-mono font-bold uppercase tracking-widest2 px-2 py-1">
            Sale
          </span>
        )}
        <button
          onClick={toggleLike}
          aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-paper/90 flex items-center justify-center border border-line"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? '#B23A2E' : 'none'} stroke={liked ? '#B23A2E' : '#17181C'} strokeWidth="1.8">
            <path d="M12 21s-7.5-4.7-10-9.3C.5 8 2 4.5 5.5 4c2-.3 3.7.7 4.5 2 .8-1.3 2.5-2.3 4.5-2 3.5.5 5 4 3.5 7.7C19.5 16.3 12 21 12 21z" />
          </svg>
        </button>
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-ink leading-snug">{product.name}</p>
          <p className="text-xs text-ink/50">{product.brand}</p>
        </div>
        <div className="swing-tag font-mono text-xs font-bold py-1 shrink-0">
          {hasDiscount ? (
            <span>
              ₹{Number(product.discountPrice).toFixed(0)}{' '}
              <span className="line-through text-ink/40 font-normal">₹{Number(product.price).toFixed(0)}</span>
            </span>
          ) : (
            <span>₹{Number(product.price).toFixed(0)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
