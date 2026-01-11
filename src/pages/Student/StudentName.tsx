import { useState, useEffect } from "react";

type Props = {
  onSubmit: (name: string) => void;
};

export default function StudentName({ onSubmit }: Props) {
  const [name, setName] = useState("");

  // RESILIENCE: Check if name already exists in storage on mount
  useEffect(() => {
    const storedName = localStorage.getItem("studentName");
    if (storedName) {
      setName(storedName);
    }
  }, []);

  const handleSubmit = () => {
    if (!name.trim()) return;
    
    // Save to storage so it persists on refresh
    localStorage.setItem("studentName", name.trim());
    onSubmit(name.trim());
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-28 px-4">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="flex justify-center mb-10">
          <span className="bg-blue-50 text-blue-600 text-sm font-bold py-2 px-6 rounded-full">
            Intervue Poll
          </span>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Let’s Get Started</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Enter your name to join the live session. You'll be able to vote and see real-time results with your classmates.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Rahul Bajaj"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-14 px-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-lg"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="w-full h-14 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-200 disabled:shadow-none bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Join Session
          </button>
        </div>
      </div>
    </div>
  );
}