import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/banners', label: 'Banners' },
  { to: '/admin/orders', label: 'Order List' },
  { to: '/admin/customers', label: 'Customers' },
];

export default function AdminLayout() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid md:grid-cols-[200px_1fr] gap-8">
      <aside>
        <p className="eyebrow mb-3">Admin Panel</p>
        <nav className="flex md:flex-col gap-1 overflow-x-auto">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `whitespace-nowrap px-3 py-2 text-sm font-semibold uppercase tracking-wide border-l-2 ${
                  isActive ? 'border-denim text-denim bg-denim/5' : 'border-transparent text-ink/70 hover:text-ink'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
