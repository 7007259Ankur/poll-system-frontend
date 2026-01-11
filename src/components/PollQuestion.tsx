type Option = {
  id: string;
  text: string;
  percentage?: number;
};

export default function PollQuestion({
  question,
  options,
  onSelect,
  showResults,
}: any) {
  return (
    <div className="border rounded-xl overflow-hidden">
      <div className="bg-gray-700 text-white px-4 py-3">
        {question}
      </div>

      <div className="p-4 space-y-3">
        {options.map((o: Option) => (
          <div
            key={o.id}
            onClick={() => !showResults && onSelect(o.id)}
            className="border p-3 rounded cursor-pointer"
          >
            <div className="flex justify-between">
              <span>{o.text}</span>
              {showResults && <span>{o.percentage}%</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
