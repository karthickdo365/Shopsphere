import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeCartItem } from '../api/cart';

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = () => getCart().then(setItems).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const total = items.reduce((sum, i) => {
    const price = i.product.discountPrice ?? i.product.price;
    return sum + Number(price) * i.quantity;
  }, 0);

  const changeQty = async (id, qty) => {
    if (qty < 1) return;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
    await updateCartItem(id, qty);
  };

  const remove = async (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await removeCartItem(id);
  };

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-ink/50">Loading cart…</div>;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="font-display text-3xl tracking-tightest text-ink/30">YOUR CART IS EMPTY</p>
        <Link to="/products" className="inline-block mt-4 text-sm font-semibold text-denim hover:underline">
          Continue shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl tracking-tightest mb-6">YOUR CART</h1>
      <div className="divide-y divide-line border-t border-b border-line">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 py-4">
            <img
              src={item.product.images?.[0] || 'https://placehold.co/200x260'}
              alt={item.product.name}
              className="w-20 h-26 object-cover border border-line"
            />
            <div className="flex-1">
              <p className="font-semibold text-sm">{item.product.name}</p>
              {item.size && <p className="text-xs text-ink/50">Size: {item.size}</p>}
              <p className="font-mono text-sm mt-1">
                ₹{Number(item.product.discountPrice ?? item.product.price).toFixed(0)}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <button onClick={() => changeQty(item.id, item.quantity - 1)} className="w-7 h-7 border border-line">−</button>
                <span className="w-8 text-center font-mono text-sm">{item.quantity}</span>
                <button onClick={() => changeQty(item.id, item.quantity + 1)} className="w-7 h-7 border border-line">+</button>
              </div>
            </div>
            <button onClick={() => remove(item.id)} className="text-xs text-rust self-start hover:underline">
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <span className="font-semibold uppercase text-sm tracking-wide">Total</span>
        <span className="font-mono text-xl font-bold">₹{total.toFixed(0)}</span>
      </div>

      <button
        onClick={() => navigate('/checkout')}
        className="w-full mt-6 bg-ink text-paper font-semibold uppercase tracking-wide py-3 hover:bg-denim"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
