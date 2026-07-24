export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Image */}
      <div className="aspect-[3/4] rounded-lg bg-gray-200"></div>

      {/* Product Name */}
      <div className="mt-3 h-4 w-3/4 rounded bg-gray-200"></div>

      {/* Brand */}
      <div className="mt-2 h-4 w-1/2 rounded bg-gray-200"></div>

      {/* Price */}
      <div className="mt-3 h-5 w-1/3 rounded bg-gray-300"></div>
    </div>
  );
}