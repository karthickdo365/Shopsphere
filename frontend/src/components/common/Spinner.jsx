export default function Spinner({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-full bg-blue-500 animate-bounce"
          style={{ animationDelay: "0s" }}
        ></span>

        <span
          className="w-3 h-3 rounded-full bg-purple-500 animate-bounce"
          style={{ animationDelay: "0.15s" }}
        ></span>

        <span
          className="w-3 h-3 rounded-full bg-pink-500 animate-bounce"
          style={{ animationDelay: "0.3s" }}
        ></span>
      </div>

      <p className="mt-4 text-sm font-medium text-gray-500">
        {text}
      </p>
    </div>
  );
}