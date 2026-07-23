export default function Spinner({
  text = "Loading..."
}) {
  return (
    <div className="flex flex-col justify-center items-center py-16">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>

        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-indigo-500 animate-spin"></div>
      </div>

      <p className="mt-4 text-sm text-gray-500 font-medium">
        {text}
      </p>
    </div>
  );
}