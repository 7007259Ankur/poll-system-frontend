import { useState } from "react";
// Import the type we just fixed
import type { Poll } from "../../hooks/useStudentPoll"; 

type Props = {
  poll: Poll;
  onVote: (optionId: string) => void;
  isSubmitting?: boolean;
};

export default function StudentPoll({ poll, onVote, isSubmitting = false }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ✅ LOGIC: Check if interaction is allowed
  // The 'poll' object now definitely has these properties thanks to the hook update
  const hasVoted = !!poll.userVotedOptionId; 
  const isEnded = poll.status === 'ended' || poll.remainingTime === 0;
  const isLocked = hasVoted || isEnded || isSubmitting;

  const handleVote = () => {
    if (selectedId && !isLocked) {
      onVote(selectedId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-12 px-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl overflow-hidden">
        
        {/* Header with Timer */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-white">
          <span className="text-sm font-bold text-gray-500">Live Question</span>
          {!isEnded ? (
             <div className="flex items-center gap-2 text-red-600 font-mono font-bold bg-red-50 px-3 py-1 rounded-lg">
                {/* This time comes directly from backend via socket */}
                <span>⏱ {poll.remainingTime}s</span>
             </div>
          ) : (
            <span className="text-gray-500 font-bold bg-gray-100 px-3 py-1 rounded-lg">Poll Ended</span>
          )}
        </div>

        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 leading-snug">
            {poll.question}
          </h2>

          <div className="space-y-4">
            {poll.options.map((opt) => {
              // Highlight selected option OR the one they voted for previously
              const isSelected = selectedId === opt.id || poll.userVotedOptionId === opt.id;
              const showResults = isEnded || hasVoted;

              return (
                <div
                  key={opt.id}
                  onClick={() => !isLocked && setSelectedId(opt.id)}
                  className={`
                    relative border-2 rounded-xl overflow-hidden transition-all duration-200
                    ${!isLocked ? 'cursor-pointer hover:border-blue-400 hover:shadow-md' : 'cursor-default'}
                    ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}
                  `}
                >
                  {/* Progress Bar (Only visible after voting/end) */}
                  {showResults && (
                    <div 
                      className="absolute left-0 top-0 h-full bg-blue-100 opacity-60 transition-all duration-700 ease-out"
                      style={{ width: `${opt.percentage || 0}%` }}
                    />
                  )}

                  <div className="relative flex justify-between items-center p-4 z-10">
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                        ${isSelected ? 'border-blue-600' : 'border-gray-300'}
                      `}>
                        {isSelected && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
                      </div>
                      <span className={`font-medium text-lg ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                        {opt.text}
                      </span>
                    </div>

                    {showResults && (
                      <span className="font-bold text-blue-700 text-lg">
                        {Math.round(opt.percentage || 0)}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 h-14">
            {!isLocked ? (
              <button
                onClick={handleVote}
                disabled={!selectedId || isSubmitting}
                className="w-full h-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none"
              >
                {isSubmitting ? "Submitting..." : "Submit Answer"}
              </button>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl text-gray-500 font-medium">
                {hasVoted ? "Vote Submitted ✓ Waiting for results..." : "Time's up!"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}