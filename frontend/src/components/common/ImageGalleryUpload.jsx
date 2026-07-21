import { useRef, useState } from 'react';
import { uploadImages } from '../../api/upload';

// Controlled component: `value` is an array of image URLs, `onChange` receives the updated array.
export default function ImageGalleryUpload({ label, value = [], onChange }) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setError('');
    setUploading(true);
    try {
      const urls = await uploadImages(files);
      onChange([...value, ...urls]);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (index) => onChange(value.filter((_, i) => i !== index));

  return (
    <div>
      {label && <span className="text-xs font-semibold uppercase tracking-wide text-ink/70 block mb-1">{label}</span>}

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((url, i) => (
            <div key={i} className="relative w-16 h-16 border border-line">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label="Remove image"
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rust text-paper text-xs rounded-full flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`flex items-center justify-center gap-2 border border-dashed cursor-pointer p-4 text-sm ${
          dragOver ? 'border-denim bg-denim/5 text-denim' : 'border-line text-ink/60'
        }`}
      >
        {uploading ? 'Uploading…' : 'Drag & drop images, or click to browse (up to 6)'}
        <input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp, image/gif"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && <p className="text-xs text-rust mt-1">{error}</p>}
    </div>
  );
}
