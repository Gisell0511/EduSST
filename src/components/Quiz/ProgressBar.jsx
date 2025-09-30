export default function ProgressBar({ current, total }) {
  const progress = (current / total) * 100;

  return (
    <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
      <div
        className="bg-green-400 h-3 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
