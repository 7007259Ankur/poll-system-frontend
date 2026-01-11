export default function StudentWaiting() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="mb-8">
        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-bold shadow-sm">
          Intervue Poll
        </span>
      </div>

      <div className="relative mb-8">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Waiting for the teacher...
      </h2>
      <p className="text-gray-500 max-w-sm">
        The question will appear here automatically when the teacher launches it.
      </p>
    </div>
  );
}