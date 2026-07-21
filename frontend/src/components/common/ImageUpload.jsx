import { useRef, useState } from 'react';
import { uploadImage } from '../../api/upload';

// Controlled component: `value` is the current image URL (or ''), `onChange` receives the new URL.
export default function ImageUpload({ label, value, onChange }) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div>
      {label && <span className="text-xs font-semibold uppercase tracking-wide text-ink/70 block mb-1">{label}</span>}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex items-center gap-3 border cursor-pointer p-2 ${
          dragOver ? 'border-denim bg-denim/5' : 'border-line'
        }`}
      >
        <div className="w-16 h-16 shrink-0 bg-paper border border-line flex items-center justify-center overflow-hidden">
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink/30">
              <path d="M3 16l5-5 4 4 5-6 4 5" />
              <rect x="3" y="4" width="18" height="16" rx="1" />
            </svg>
          )}
        </div>

        <div className="flex-1 text-sm">
          {uploading ? (
            <p className="text-denim">Uploading…</p>
          ) : value ? (
            <>
              <p className="text-ink/70">Image selected</p>
              <p className="text-xs text-denim underline">Click or drop to replace</p>
            </>
          ) : (
            <>
              <p className="text-ink/70">Drag & drop an image here</p>
              <p className="text-xs text-denim underline">or click to browse</p>
            </>
          )}
        </div>

        {value && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(''); }}
            aria-label="Remove image"
            className="text-rust text-xs font-semibold"
          >
            Remove
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp, image/gif"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {error && <p className="text-xs text-rust mt-1">{error}</p>}
    </div>
  );
}
