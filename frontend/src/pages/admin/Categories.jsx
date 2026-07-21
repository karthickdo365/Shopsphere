import { useEffect, useState } from 'react';
import {
  getCategories, createCategory, deleteCategory, createSubCategory, deleteSubCategory,
} from '../../api/categories';
import ImageUpload from '../../components/common/ImageUpload';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [subFormFor, setSubFormFor] = useState(null);
  const [subName, setSubName] = useState('');
  const [subImage, setSubImage] = useState('');

  const load = () => getCategories().then(setCategories);
  useEffect(() => { load(); }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createCategory({ name, image });
    setName(''); setImage('');
    load();
  };

  const removeCategory = async (id) => {
    if (!confirm('Delete this category and all its subcategories/products links?')) return;
    await deleteCategory(id);
    load();
  };

  const addSubCategory = async (categoryId) => {
    if (!subName.trim()) return;
    await createSubCategory(categoryId, { name: subName, image: subImage });
    setSubName(''); setSubImage(''); setSubFormFor(null);
    load();
  };

  const removeSubCategory = async (id) => {
    if (!confirm('Delete this subcategory?')) return;
    await deleteSubCategory(id);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tightest mb-6">CATEGORIES</h1>

      <form onSubmit={addCategory} className="flex flex-wrap gap-3 mb-8 border border-line bg-white p-4">
        <input
          value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name"
          className="border border-line px-3 py-2 text-sm flex-1 min-w-[160px]"
        />
        <div className="flex-1 min-w-[220px]">
          <ImageUpload value={image} onChange={setImage} />
        </div>
        <button className="bg-denim text-paper text-sm font-semibold uppercase px-4 py-2 hover:bg-denim-deep self-start">
          Add Category
        </button>
      </form>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.id} className="border border-line bg-white p-4">
            <div className="flex justify-between items-center">
              <p className="font-semibold">{cat.name}</p>
              <div className="flex gap-3">
                <button onClick={() => setSubFormFor(subFormFor === cat.id ? null : cat.id)} className="text-xs font-semibold text-denim hover:underline">
                  + Subcategory
                </button>
                <button onClick={() => removeCategory(cat.id)} className="text-xs font-semibold text-rust hover:underline">
                  Delete
                </button>
              </div>
            </div>

            {subFormFor === cat.id && (
              <div className="mt-3 space-y-2">
                <input
                  value={subName} onChange={(e) => setSubName(e.target.value)} placeholder="Subcategory name"
                  className="border border-line px-3 py-1.5 text-sm w-full"
                />
                <ImageUpload value={subImage} onChange={setSubImage} />
                <button onClick={() => addSubCategory(cat.id)} className="bg-ink text-paper text-xs font-semibold uppercase px-3 py-1.5">
                  Save
                </button>
              </div>
            )}

            {cat.subCategories?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {cat.subCategories.map((sub) => (
                  <span key={sub.id} className="flex items-center gap-2 bg-paper border border-line px-2 py-1 text-xs">
                    {sub.name}
                    <button onClick={() => removeSubCategory(sub.id)} className="text-rust font-bold">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
