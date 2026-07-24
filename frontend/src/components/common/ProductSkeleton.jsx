export default function ProductSkeleton() {
  return (
    <div className="animate-pulse bg-white border border-gray-200 rounded-lg p-4">
      {/* Image */}
      <div className="w-full h-56 bg-gray-200 rounded-md"></div>

      {/* Product Name */}
      <div className="mt-4 h-5 w-3/4 bg-gray-200 rounded"></div>

      {/* Category */}
      <div className="mt-2 h-4 w-1/2 bg-gray-200 rounded"></div>

      {/* Price */}
      <div className="mt-4 h-6 w-20 bg-gray-200 rounded"></div>

      {/* Button */}
      <div className="mt-5 h-10 w-full bg-gray-200 rounded"></div>
    </div>
  );
}