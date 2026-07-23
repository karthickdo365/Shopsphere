import { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/products';
import { getCategories } from '../../api/categories';
import ImageGalleryUpload from '../../components/common/ImageGalleryUpload';
import Spinner from '../../components/common/Spinner';

const emptyForm = {
  name: '', description: '', price: '', discountPrice: '', stock: '', brand: '',
  images: [], categoryId: '', subCategoryId: '', isNewArrival: false, isFeatured: false,
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

 const load = async () => {
  setLoading(true);

  try {
    const res = await getProducts({ limit: 100 });
    setProducts(res.data);
  } catch (error) {
    console.error("Failed to load products:", error);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => { load(); getCategories().then(setCategories); }, []);

  const subCats = categories.find((c) => c.id === form.categoryId)?.subCategories || [];

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };
  const openEdit = (p) => {
    setForm({
      name: p.name, description: p.description, price: p.price, discountPrice: p.discountPrice || '',
      stock: p.stock, brand: p.brand || '', images: p.images || [],
      categoryId: p.categoryId, subCategoryId: p.subCategoryId || '',
      isNewArrival: p.isNewArrival, isFeatured: p.isFeatured,
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
      stock: Number(form.stock),
      images: form.images,
      subCategoryId: form.subCategoryId || null,
    };
    if (editingId) await updateProduct(editingId, payload);
    else await createProduct(payload);
    setShowForm(false);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    await deleteProduct(id);
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl tracking-tightest">PRODUCTS</h1>
        <button onClick={openCreate} className="bg-denim text-paper text-sm font-semibold uppercase px-4 py-2 hover:bg-denim-deep">
          + Add Product
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="border border-line bg-white p-5 mb-8 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <Input label="Brand" value={form.brand} onChange={(v) => setForm({ ...form, brand: v })} />
          </div>
          <TextArea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} required />
          <div className="grid sm:grid-cols-3 gap-3">
            <Input label="Price" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} required />
            <Input label="Discount Price" type="number" value={form.discountPrice} onChange={(v) => setForm({ ...form, discountPrice: v })} />
            <Input label="Stock" type="number" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} required />
          </div>
          <ImageGalleryUpload label="Product Images" value={form.images} onChange={(images) => setForm({ ...form, images })} />
          <div className="grid sm:grid-cols-2 gap-3">
            <Select
              label="Category"
              value={form.categoryId}
              onChange={(v) => setForm({ ...form, categoryId: v, subCategoryId: '' })}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              required
            />
            <Select
              label="Sub Category"
              value={form.subCategoryId}
              onChange={(v) => setForm({ ...form, subCategoryId: v })}
              options={subCats.map((s) => ({ value: s.id, label: s.name }))}
            />
          </div>
          <div className="flex gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isNewArrival} onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })} />
              New Arrival
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
              Featured
            </label>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-ink text-paper text-sm font-semibold uppercase px-5 py-2 hover:bg-denim">
              {editingId ? 'Save Changes' : 'Create Product'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm font-semibold text-ink/60 px-5 py-2">
              Cancel
            </button>
          </div>
        </form>
      )}

     <div className="border border-line bg-white divide-y divide-line">
  {loading ? (
    <Spinner text="Loading products..." />
  ) : (
    products.map((p) => (
      <div key={p.id} className="flex items-center gap-4 px-4 py-3">
        <img
          src={p.images?.[0] || "https://placehold.co/80x100"}
          alt={p.name}
          className="w-10 h-14 object-cover border border-line"
        />

        <div className="flex-1 text-sm">
          <p className="font-semibold">{p.name}</p>

          <p className="text-xs text-ink/50">
            {p.category?.name}
            {p.subCategory ? ` / ${p.subCategory.name}` : ""} · Stock {p.stock}
          </p>
        </div>

        <span className="font-mono text-sm">
          ₹{Number(p.price).toFixed(0)}
        </span>

        <button
          onClick={() => openEdit(p)}
          className="text-xs font-semibold text-denim hover:underline"
        >
          Edit
        </button>

        <button
          onClick={() => remove(p.id)}
          className="text-xs font-semibold text-rust hover:underline"
        >
          Delete
        </button>
      </div>
    ))
  )}
</div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <label className="block text-sm">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink/70">{label}</span>
      <input {...props} value={props.value} onChange={(e) => props.onChange(e.target.value)} className="mt-1 w-full border border-line px-3 py-2 focus-visible:outline-denim" />
    </label>
  );
}
function TextArea({ label, ...props }) {
  return (
    <label className="block text-sm">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink/70">{label}</span>
      <textarea {...props} value={props.value} onChange={(e) => props.onChange(e.target.value)} rows={3} className="mt-1 w-full border border-line px-3 py-2 focus-visible:outline-denim" />
    </label>
  );
}
function Select({ label, options, ...props }) {
  return (
    <label className="block text-sm">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink/70">{label}</span>
      <select {...props} value={props.value} onChange={(e) => props.onChange(e.target.value)} className="mt-1 w-full border border-line px-3 py-2 bg-white focus-visible:outline-denim">
        <option value="">Select…</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
