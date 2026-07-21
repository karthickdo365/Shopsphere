import { useEffect, useState } from 'react';
import { getAllOrders } from '../../api/orders';

// NOTE: there's no dedicated /users (Admin) endpoint in the backend yet,
// so this view is derived from order history. Add a GET /api/v1/users
// (Admin-only) route to list every registered user directly, including
// those with zero orders — flagged in the backend README's "not yet built" list.
export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllOrders().then((orders) => {
      const map = new Map();
      for (const o of orders) {
        const key = o.userId;
        if (!map.has(key)) {
          map.set(key, { name: o.user?.name, email: o.user?.email, orders: 0, spent: 0 });
        }
        const entry = map.get(key);
        entry.orders += 1;
        if (['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(o.status)) {
          entry.spent += Number(o.totalAmount);
        }
      }
      setCustomers(Array.from(map.values()).sort((a, b) => b.spent - a.spent));
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tightest mb-2">CUSTOMERS</h1>
      <p className="text-xs text-ink/50 mb-6">
        Derived from order history. Customers with no orders yet won't appear here.
      </p>
      {loading ? (
        <p className="text-sm text-ink/50">Loading…</p>
      ) : (
        <div className="border border-line bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-paper border-b border-line">
              <tr className="text-left">
                <th className="px-4 py-3 font-mono text-xs uppercase tracking-widest2 text-ink/50">Name</th>
                <th className="px-4 py-3 font-mono text-xs uppercase tracking-widest2 text-ink/50">Email</th>
                <th className="px-4 py-3 font-mono text-xs uppercase tracking-widest2 text-ink/50">Orders</th>
                <th className="px-4 py-3 font-mono text-xs uppercase tracking-widest2 text-ink/50">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {customers.map((c, i) => (
                <tr key={i}>
                  <td className="px-4 py-3 font-semibold">{c.name}</td>
                  <td className="px-4 py-3 text-ink/60">{c.email}</td>
                  <td className="px-4 py-3 font-mono">{c.orders}</td>
                  <td className="px-4 py-3 font-mono">₹{c.spent.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
