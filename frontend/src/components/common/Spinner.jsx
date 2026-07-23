export default function Spinner({ size = 40 }) {
  return (
    <div className="flex justify-center items-center py-10">
      <div
        className="animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      ></div>
    </div>
  );
}