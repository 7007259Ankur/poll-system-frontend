import { useEffect, useState } from "react";

type PollOption = {
  id: string;
  text: string;
  votes: number;
};

type Poll = {
  _id: string;
  question: string;
  createdAt: string;
  options: PollOption[];
};

// 🔴 FIX: Explicitly define the Props type
type Props = {
  onClose: () => void;
};

export default function PollHistory({ onClose }: Props) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selected, setSelected] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_URL}/api/polls/history`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setPolls(data);
          if (data.length > 0) setSelected(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {/* 🔴 FIX: This button uses the onClose prop */}
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors text-2xl font-bold"
            >
              ←
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Poll History</h1>
          </div>
          <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border">
            {polls.length} Past Polls
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : polls.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-400 text-lg">No history found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-3 lg:col-span-1 h-[calc(100vh-200px)] overflow-y-auto pr-2">
              {polls.map((poll) => {
                const total = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                const date = new Date(poll.createdAt).toLocaleDateString();

                return (
                  <div
                    key={poll._id}
                    onClick={() => setSelected(poll)}
                    className={`
                      relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                      ${selected?._id === poll._id 
                        ? "border-blue-600 bg-blue-50 shadow-sm" 
                        : "border-white bg-white hover:border-blue-200 hover:shadow-md"
                      }
                    `}
                  >
                    <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{poll.question}</h3>
                    <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                      <span>{date}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded-md">{total} Votes</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-2">
              {selected ? (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8 sticky top-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 leading-snug">{selected.question}</h2>
                  <div className="space-y-4">
                    {selected.options.map((opt) => {
                      const total = selected.options.reduce((sum, o) => sum + o.votes, 0);
                      const percent = total === 0 ? 0 : Math.round((opt.votes / total) * 100);

                      return (
                        <div key={opt.id} className="group">
                          <div className="flex justify-between text-sm font-semibold mb-1 text-gray-700">
                            <span>{opt.text}</span>
                            <span className="text-blue-600">{percent}%</span>
                          </div>
                          <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                            <div 
                              className="absolute left-0 top-0 h-full bg-blue-100 transition-all duration-1000 ease-out"
                              style={{ width: `${percent}%` }}
                            />
                            <div className="absolute inset-0 flex items-center px-4">
                              <span className="text-xs font-bold text-gray-500 z-10">{opt.votes} votes</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-8 pt-6 border-t flex justify-end">
                    <span className="text-sm text-gray-400">Poll ID: {selected._id}</span>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                  <span className="text-4xl mb-2">👈</span>
                  <p>Select a poll to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}