import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductBySlug } from '../api/products';
import { addToCart } from '../api/cart';
import { addToWishlist, removeFromWishlist, getWishlist } from '../api/wishlist';
import { useAuth } from '../context/AuthContext';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function ProductDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(null);
  const [liked, setLiked] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setProduct(null);
    getProductBySlug(slug).then(setProduct);
  }, [slug]);

  useEffect(() => {
    if (!user || !product) return;
    getWishlist().then((items) => setLiked(items.some((i) => i.productId === product.id))).catch(() => {});
  }, [user, product]);

  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-ink/50">Loading…</div>;
  }

  const hasDiscount = product.discountPrice && Number(product.discountPrice) < Number(product.price);

  const handleAddToCart = async () => {
    if (!user) return setStatus('Please log in to add items to your cart.');
    if (!size) return setStatus('Please select a size.');
    await addToCart(product.id, 1, size);
    setStatus('Added to cart.');
  };

  const toggleWishlist = async () => {
    if (!user) return setStatus('Please log in to save items.');
    if (liked) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
    setLiked(!liked);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid md:grid-cols-2 gap-10">
      {/* Gallery */}
      <div>
        <div className="aspect-[3/4] bg-white border border-line overflow-hidden">
          <img
            src={product.images?.[activeImage] || 'https://placehold.co/600x800'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        {product.images?.length > 1 && (
          <div className="flex gap-2 mt-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-16 h-20 border ${i === activeImage ? 'border-ink' : 'border-line'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div>
        <p className="eyebrow mb-2">{product.category?.name}{product.subCategory ? ` / ${product.subCategory.name}` : ''}</p>
        <h1 className="font-display text-3xl tracking-tightest mb-1">{product.name}</h1>
        <p className="text-sm text-ink/50 mb-4">{product.brand}</p>

        <div className="swing-tag inline-flex items-center font-mono text-lg font-bold py-1.5 mb-6">
          {hasDiscount ? (
            <span>
              ₹{Number(product.discountPrice).toFixed(0)}{' '}
              <span className="line-through text-ink/40 font-normal text-sm">₹{Number(product.price).toFixed(0)}</span>
            </span>
          ) : (
            <span>₹{Number(product.price).toFixed(0)}</span>
          )}
        </div>

        <p className="text-sm text-ink/80 leading-relaxed mb-6">{product.description}</p>

        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide mb-2">Select Size</p>
          <div className="flex gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`w-11 h-11 border text-sm font-mono ${
                  size === s ? 'bg-ink text-paper border-ink' : 'border-line hover:border-ink'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 bg-denim text-paper font-semibold uppercase tracking-wide py-3 hover:bg-denim-deep disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <button
            onClick={toggleWishlist}
            aria-label="Toggle wishlist"
            className="w-12 border border-ink flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? '#B23A2E' : 'none'} stroke={liked ? '#B23A2E' : '#17181C'} strokeWidth="1.8">
              <path d="M12 21s-7.5-4.7-10-9.3C.5 8 2 4.5 5.5 4c2-.3 3.7.7 4.5 2 .8-1.3 2.5-2.3 4.5-2 3.5.5 5 4 3.5 7.7C19.5 16.3 12 21 12 21z" />
            </svg>
          </button>
        </div>

        {status && <p className="text-sm text-denim mb-4">{status}</p>}

        <div className="stitch-rule mb-4" />
        <p className="text-xs text-ink/50">{product.stock} in stock · Free returns within 15 days</p>

        {product.reviews?.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-xl tracking-tightest mb-4">REVIEWS</h2>
            <div className="space-y-4">
              {product.reviews.map((r) => (
                <div key={r.id} className="border-b border-line pb-3">
                  <p className="text-sm font-semibold">{r.user?.name} · {'★'.repeat(r.rating)}</p>
                  {r.comment && <p className="text-sm text-ink/70 mt-1">{r.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
