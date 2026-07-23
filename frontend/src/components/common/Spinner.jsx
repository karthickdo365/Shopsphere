export default function Spinner({
  text = "Loading..."
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        {/* Background Ring */}
        <div className="w-10 h-10 rounded-full border-4 border-slate-200"></div>

        {/* Rotating Ring */}
        <div className="absolute inset-0 w-1o h-10 rounded-full border-4 border-transparent border-t-blue-600 border-r-indigo-500 animate-spin"></div>

        {/* Center Dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></div>
        </div>
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">
        {text}
      </p>
    </div>
  );
}