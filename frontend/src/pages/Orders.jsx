import { useEffect, useState } from 'react';
import { getMyOrders } from '../api/orders';

const STATUS_COLORS = {
  PENDING: 'bg-line text-ink',
  PAID: 'bg-denim text-paper',
  PROCESSING: 'bg-mustard text-ink',
  SHIPPED: 'bg-denim-light text-paper',
  DELIVERED: 'bg-green-700 text-paper',
  CANCELLED: 'bg-rust text-paper',
  FAILED: 'bg-rust text-paper',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders().then(setOrders).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-ink/50">Loading orders…</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl tracking-tightest mb-6">MY ORDERS</h1>
      {orders.length === 0 ? (
        <p className="text-sm text-ink/50">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-line p-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="font-mono text-xs text-ink/50">#{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-ink/50">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-[11px] font-mono font-bold uppercase tracking-widest2 px-2 py-1 ${STATUS_COLORS[order.status] || 'bg-line'}`}>
                  {order.status}
                </span>
              </div>
              <div className="divide-y divide-line">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-3 py-2">
                    <img
                      src={item.product?.images?.[0] || 'https://placehold.co/100x130'}
                      alt={item.product?.name}
                      className="w-12 h-16 object-cover border border-line"
                    />
                    <div className="flex-1 text-sm">
                      <p className="font-semibold">{item.product?.name}</p>
                      <p className="text-ink/50 text-xs">Qty {item.quantity} {item.size && `· Size ${item.size}`}</p>
                    </div>
                    <p className="font-mono text-sm">₹{Number(item.price).toFixed(0)}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-3 pt-3 border-t border-line">
                <span className="text-sm font-semibold uppercase">Total</span>
                <span className="font-mono font-bold">₹{Number(order.totalAmount).toFixed(0)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
