export default function Spinner() {
  return (
    <div className="flex items-center gap-1">
      <span
        className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
        style={{ animationDelay: "0s" }}
      />
      <span
        className="w-2 h-2 rounded-full bg-yellow-500 animate-bounce"
        style={{ animationDelay: "0.15s" }}
      />
      <span
        className="w-2 h-2 rounded-full bg-red-500 animate-bounce"
        style={{ animationDelay: "0.3s" }}
      />
    </div>
  );
}