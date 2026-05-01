// components/ThoughtProcess.jsx

export default function ThoughtProcess({ steps, loading }) {
  return (
    <div className="w-[300px] bg-[#020617] border-l border-gray-800 p-4">
      <h2 className="text-lg font-bold mb-3">🧠 AI Thinking</h2>

      {loading ? (
        steps.map((step, i) => (
          <div key={i} className="text-sm mb-2 animate-pulse">
            {step}
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-sm">
          Waiting for query...
        </p>
      )}
    </div>
  );
}