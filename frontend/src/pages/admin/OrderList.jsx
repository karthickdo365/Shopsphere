import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../../api/orders';

const STATUSES = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'FAILED'];

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const load = () => getAllOrders().then(setOrders);
  useEffect(() => { load(); }, []);

  const changeStatus = async (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await updateOrderStatus(id, status);
  };

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tightest mb-6">ORDER LIST</h1>
      <div className="border border-line bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-paper border-b border-line">
            <tr className="text-left">
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-widest2 text-ink/50">Order</th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-widest2 text-ink/50">Customer</th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-widest2 text-ink/50">Items</th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-widest2 text-ink/50">Total</th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-widest2 text-ink/50">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3 font-mono text-xs">#{o.id.slice(0, 8)}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold">{o.user?.name}</p>
                  <p className="text-xs text-ink/50">{o.user?.email}</p>
                </td>
                <td className="px-4 py-3 text-xs text-ink/60">{o.items.length} item(s)</td>
                <td className="px-4 py-3 font-mono">₹{Number(o.totalAmount).toFixed(0)}</td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => changeStatus(o.id, e.target.value)}
                    className="border border-line text-xs font-mono uppercase px-2 py-1 bg-white focus-visible:outline-denim"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
