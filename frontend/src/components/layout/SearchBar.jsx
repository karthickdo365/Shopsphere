import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function SearchBar() {
  const [params] = useSearchParams();
  const [value, setValue] = useState(params.get('search') || '');
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        navigate(`/products?search=${encodeURIComponent(value.trim())}`);
      }
    }, 450);
    return () => clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
