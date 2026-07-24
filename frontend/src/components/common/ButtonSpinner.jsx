export default function ButtonSpinner({
  text = "Loading...",
  color = "white",
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <span
        className={`w-2 h-2 rounded-full dot-wave ${
          color === "blue" ? "bg-white" : "bg-blue-600"
        }`}
        style={{ animationDelay: "0s" }}
      />

      <span
        className={`w-2 h-2 rounded-full dot-wave ${
          color === "yellow" ? "bg-white" : "bg-yellow-500"
        }`}
        style={{ animationDelay: "0.15s" }}
      />

      <span
        className={`w-2 h-2 rounded-full dot-wave ${
          color === "red" ? "bg-white" : "bg-red-500"
        }`}
        style={{ animationDelay: "0.3s" }}
      />

      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}