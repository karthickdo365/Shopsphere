import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getProducts } from "../../api/products";

export default function SearchBar() {
  const [params] = useSearchParams();
  const [value, setValue] = useState(params.get('search') || '');
  const [results, setResults] = useState([]);
const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

 useEffect(() => {
  if (timeoutRef.current) clearTimeout(timeoutRef.current);

  if (!value.trim()) {
    setResults([]);
    return;
  }

  timeoutRef.current = setTimeout(async () => {
    setLoading(true);

    try {
      const res = await getProducts({
        search: value,
        limit: 5,
      });

      setResults(res.data);
    } finally {
      setLoading(false);
    }
  }, 300);

  return () => clearTimeout(timeoutRef.current);
}, [value]);

return (
  <form
    onSubmit={(e) => {
      e.preventDefault();

      if (!value.trim()) return;

      setResults([]);
      navigate(`/products?search=${encodeURIComponent(value.trim())}`);
    }}
    className="relative"
  >
    <input
      type="search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search products..."
      aria-label="Search products"
      className="w-full bg-white border border-line rounded-none px-3 py-2 text-sm focus-visible:outline-denim placeholder:text-ink/40"
    />

    {value.trim() && (
      <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="p-3 text-center text-sm">
            Searching...
          </div>
        ) : results.length > 0 ? (
          results.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setValue("");
                setResults([]);
                navigate(`/products/${product.slug}`);
              }}
            >
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="w-12 h-12 object-cover rounded"
              />

              <div className="flex-1">
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-xs text-gray-500">
                  ₹{product.discountPrice || product.price}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-3 text-center text-sm">
            No products found
          </div>
        )}
      </div>
    )}
  </form>
);

  ;
}
