import { useEffect, useState } from 'react';
import { getAllBanners, createBanner, updateBanner, deleteBanner } from '../../api/banners';
import ImageUpload from '../../components/common/ImageUpload';

const emptyForm = { title: '', image: '', link: '', position: 0, isActive: true };

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const load = () => getAllBanners().then(setBanners);
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.image) return alert('Please upload a banner image first.');
    await createBanner({ ...form, position: Number(form.position) });
    setForm(emptyForm);
    load();
  };

  const toggleActive = async (b) => {
    await updateBanner(b.id, { isActive: !b.isActive });
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this banner?')) return;
    await deleteBanner(id);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tightest mb-6">BANNERS</h1>

      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3 border border-line bg-white p-4 mb-8">
        <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="border border-line px-3 py-2 text-sm" />
        <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="Link (e.g. /products?category=men)" className="border border-line px-3 py-2 text-sm" />
        <div className="sm:col-span-2">
          <ImageUpload label="Banner Image" value={form.image} onChange={(image) => setForm({ ...form, image })} />
        </div>
        <input type="number" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="Position" className="border border-line px-3 py-2 text-sm" />
        <button className="sm:col-span-2 bg-denim text-paper text-sm font-semibold uppercase px-4 py-2 hover:bg-denim-deep">
          Add Banner
        </button>
      </form>

      <div className="space-y-3">
        {banners.map((b) => (
          <div key={b.id} className="flex items-center gap-4 border border-line bg-white p-3">
            <img src={b.image} alt={b.title} className="w-24 h-14 object-cover border border-line" />
            <div className="flex-1">
              <p className="font-semibold text-sm">{b.title}</p>
              <p className="text-xs text-ink/50">Position {b.position} · {b.link}</p>
            </div>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={b.isActive} onChange={() => toggleActive(b)} />
              Active
            </label>
            <button onClick={() => remove(b.id)} className="text-xs font-semibold text-rust hover:underline">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
