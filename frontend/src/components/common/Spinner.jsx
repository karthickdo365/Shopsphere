export default function ProductSkeleton() {
  return (
    <div className="animate-pulse flex items-center gap-4 px-4 py-3 border-b border-line">
      {/* Image */}
      <div className="w-10 h-14 bg-gray-200 rounded"></div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <div className="h-4 w-48 bg-gray-200 rounded"></div>
        <div className="h-3 w-32 bg-gray-200 rounded"></div>
      </div>

      {/* Price */}
      <div className="h-4 w-16 bg-gray-200 rounded"></div>

      {/* Buttons */}
      <div className="flex gap-2">
        <div className="w-12 h-6 bg-gray-200 rounded"></div>
        <div className="w-14 h-6 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}