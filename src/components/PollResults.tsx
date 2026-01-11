type PollResultsProps = {
  results: {
    question: string;
    options: {
      id: string;
      text: string;
      votes: number;
      percentage: number;
    }[];
    totalVotes: number;
  };
};

export const PollResults = ({ results }: PollResultsProps) => {
  return (
    <div className="border rounded-xl overflow-hidden">
      {/* Question */}
      <div className="bg-gray-700 text-white px-4 py-3 font-medium">
        {results.question}
      </div>

      {/* Options */}
      <div className="p-4 space-y-3">
        {results.options.map((opt) => (
          <div
            key={opt.id}
            className="relative border rounded-lg px-4 py-3 overflow-hidden"
          >
            {/* Progress Bar */}
            <div
              className="absolute left-0 top-0 h-full bg-primaryLight"
              style={{ width: `${opt.percentage}%` }}
            />

            <div className="relative flex justify-between font-medium">
              <span>{opt.text}</span>
              <span>{opt.percentage}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 text-sm text-mutedText">
        Total Votes: {results.totalVotes}
      </div>
    </div>
  );
};
