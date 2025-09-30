export default function StageIndicator({ stage, totalStages }) {
  return (
    <div className="flex justify-center mb-4">
      <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-lg shadow-md">
        Etapa {stage} / {totalStages}
      </span>
    </div>
  );
}
