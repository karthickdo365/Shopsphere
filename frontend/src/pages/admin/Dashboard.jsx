import { useEffect, useState } from 'react';
import { getAllOrders } from '../../api/orders';
import { getProducts } from '../../api/products';
import { getCategories } from '../../api/categories';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      const [orders, productsRes, categories] = await Promise.all([
        getAllOrders(),
        getProducts({ limit: 1 }),
        getCategories(),
      ]);
      const revenue = orders
        .filter((o) => o.status === 'PAID' || o.status === 'DELIVERED' || o.status === 'SHIPPED')
        .reduce((sum, o) => sum + Number(o.totalAmount), 0);
      const uniqueCustomers = new Set(orders.map((o) => o.userId)).size;

      setStats({
        orders: orders.length,
        revenue,
        products: productsRes.pagination.total,
        categories: categories.length,
        customers: uniqueCustomers,
        recentOrders: orders.slice(0, 5),
      });
    })();
  }, []);

  if (!stats) return <p className="text-sm text-ink/50">Loading dashboard…</p>;

  const cards = [
    { label: 'Total Revenue', value: `₹${stats.revenue.toFixed(0)}` },
    { label: 'Orders', value: stats.orders },
    { label: 'Products', value: stats.products },
    { label: 'Categories', value: stats.categories },
    { label: 'Customers', value: stats.customers },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tightest mb-6">DASHBOARD</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="border border-line p-4 bg-white">
            <p className="text-[11px] font-mono uppercase tracking-widest2 text-ink/50">{c.label}</p>
            <p className="font-display text-2xl mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      <h2 className="font-semibold uppercase text-sm tracking-wide mb-3">Recent Orders</h2>
      <div className="border border-line divide-y divide-line bg-white">
        {stats.recentOrders.map((o) => (
          <div key={o.id} className="flex justify-between px-4 py-3 text-sm">
            <span className="font-mono text-ink/60">#{o.id.slice(0, 8)}</span>
            <span>{o.user?.name}</span>
            <span className="font-mono">₹{Number(o.totalAmount).toFixed(0)}</span>
            <span className="text-xs font-mono uppercase text-denim">{o.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
