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
    } catch (err) {
      console.error(err);
      setResults([]);
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
        if (value.trim()) navigate(`/products?search=${encodeURIComponent(value.trim())}`);
      }}
      className="relative"
    >
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products…"
        aria-label="Search products"
        className="w-full bg-white border border-line rounded-none px-3 py-2 text-sm focus-visible:outline-denim placeholder:text-ink/40"
      />
    </form>
  );
}
