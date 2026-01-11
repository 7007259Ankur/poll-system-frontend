import { useEffect, useState } from 'react';

type HistoryItem = {
  _id: string;
  question: string;
  createdAt: string;
  options: { text: string; votes: number }[];
};

type Props = {
  onClose: () => void;
};

export default function PollHistory({ onClose }: Props) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch History
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/polls/history`);
        const data = await res.json();
        setHistory(data);
      } catch (error) {
        console.error("Failed to load history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto animate-fade-in">
      <div className="max-w-4xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">View Poll History</h2>
            <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 font-bold text-xl px-4 py-2"
            >
                ✕ Close
            </button>
        </div>

        {loading ? (
            <div className="text-center py-20 text-gray-500">Loading history...</div>
        ) : history.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No history available yet.</div>
        ) : (
            <div className="space-y-12">
                {history.map((poll, index) => {
                    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

                    return (
                        <div key={poll._id} className="w-full">
                            <h3 className="text-xl font-bold mb-4 text-gray-800">Question {index + 1}</h3>
                            
                            {/* Card Container */}
                            <div className="border border-purple-200 rounded-xl overflow-hidden shadow-sm">
                                {/* Dark Header */}
                                <div className="bg-gray-700 text-white px-6 py-4 font-medium text-lg">
                                    {poll.question}
                                </div>

                                {/* Options List */}
                                <div className="p-6 bg-white space-y-3">
                                    {poll.options.map((opt, i) => {
                                        const percentage = totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);
                                        
                                        return (
                                            <div key={i} className="relative h-14 bg-gray-50 rounded-lg overflow-hidden flex items-center border border-gray-100">
                                                
                                                {/* Purple Progress Bar Background */}
                                                <div 
                                                    className="absolute left-0 top-0 h-full bg-indigo-500 transition-all duration-500"
                                                    style={{ width: `${percentage}%`, opacity: 0.8 }}
                                                />

                                                {/* Content Layer */}
                                                <div className="relative w-full flex justify-between items-center px-4 z-10">
                                                    <div className="flex items-center gap-4">
                                                        {/* Number Badge */}
                                                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                                            {i + 1}
                                                        </div>
                                                        <span className={`font-medium ${percentage > 50 ? 'text-white' : 'text-gray-800'}`}>
                                                            {opt.text}
                                                        </span>
                                                    </div>
                                                    
                                                    <span className={`font-bold ${percentage > 90 ? 'text-white' : 'text-gray-800'}`}>
                                                        {percentage}%
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </div>
    </div>
  );
}