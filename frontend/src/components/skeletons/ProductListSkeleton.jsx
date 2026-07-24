export default function ProductListSkeleton({ rows = 8 }) {
  return (
    <div className="border border-line bg-white divide-y divide-line animate-pulse">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 px-4 py-3"
        >
          {/* Image */}
          <div className="w-10 h-14 rounded bg-gray-200"></div>

          {/* Product Details */}
          <div className="flex-1">
            <div className="h-4 w-40 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 w-28 bg-gray-200 rounded"></div>
          </div>

          {/* Price */}
          <div className="h-4 w-16 bg-gray-200 rounded"></div>

          {/* Edit */}
          <div className="h-4 w-10 bg-gray-200 rounded"></div>

          {/* Delete */}
          <div className="h-4 w-12 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}