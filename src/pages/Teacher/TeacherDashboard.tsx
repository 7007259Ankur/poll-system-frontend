import { useState } from "react";
import { useTeacherPoll } from "../../hooks/useTeacherPoll"; 
import ChatPanel from "../../components/ChatPanel"; 
import PollHistory from "./PollHistory"; 

export default function TeacherDashboard() {
  const { activePoll, createPoll, resetPoll, isConnected } = useTeacherPoll();
  const [showHistory, setShowHistory] = useState(false);
  const [question, setQuestion] = useState("");
  const [duration, setDuration] = useState(60);
  const [optionTexts, setOptionTexts] = useState(["", ""]);

  const handleCreate = () => {
    createPoll(question, optionTexts, duration);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...optionTexts];
    newOptions[index] = value;
    setOptionTexts(newOptions);
  };

  const addOption = () => {
    if (optionTexts.length < 4) setOptionTexts([...optionTexts, ""]);
  };

  // 1. Handle History View
  if (showHistory) {
    return <PollHistory onClose={() => setShowHistory(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-white border-b px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
            <p className="text-sm text-gray-500">Create and manage live polls</p>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setShowHistory(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md transition-all flex items-center gap-2"
             >
                👁 View History
             </button>

             <div className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-sm font-medium text-gray-600">
                {isConnected ? "Live" : "Connecting"}
                </span>
             </div>
          </div>
        </div>

        <div className="p-8">
          {/* CREATE POLL FORM */}
          {!activePoll && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Question</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Which planet is known as the Red Planet?"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Options</label>
                <div className="space-y-3">
                  {optionTexts.map((text, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                        {i + 1}
                      </div>
                      <input
                        value={text}
                        onChange={(e) => handleOptionChange(i, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none"
                        placeholder={`Option ${i + 1}`}
                      />
                    </div>
                  ))}
                </div>
                {optionTexts.length < 4 && (
                  <button onClick={addOption} className="mt-3 text-sm text-purple-600 font-semibold hover:underline">
                    + Add another option
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Timer Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
                >
                  <option value={10}>10 Seconds (Test)</option>
                  <option value={30}>30 Seconds</option>
                  <option value={60}>60 Seconds</option>
                </select>
              </div>

              <button
                onClick={handleCreate}
                disabled={!isConnected}
                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all shadow-lg"
              >
                + Ask a new question
              </button>
            </div>
          )}

          {/* ACTIVE POLL VIEW - FIXED MAP ERROR */}
          {activePoll && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                 <span className={`px-3 py-1 rounded-full text-sm font-bold ${activePoll.status === 'ended' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-600'}`}>
                  {activePoll.status === 'ended' ? "Poll Ended" : "● Live Polling"}
                </span>
                <span className="text-3xl font-mono font-bold text-gray-800">
                  00:{activePoll.remainingTime < 10 ? `0${activePoll.remainingTime}` : activePoll.remainingTime}
                </span>
              </div>

              <h2 className="text-xl font-semibold text-gray-800 mb-6">{activePoll.question}</h2>

              <div className="space-y-4">
                {/* 🔴 FIX: Added '?.' to prevent crash if options is undefined */}
                {activePoll.options?.map((opt, i) => (
                  <div key={i} className="relative group bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                    <div 
                        className="absolute left-0 top-0 h-full bg-blue-100 transition-all duration-500 ease-out"
                        style={{ width: `${opt.percentage || 0}%` }}
                    />
                    <div className="relative flex justify-between items-center p-4 z-10">
                      <span className="font-medium text-gray-700">{opt.text}</span>
                      <span className="font-bold text-blue-700">{Math.round(opt.percentage || 0)}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {activePoll.status === 'ended' && (
                <button
                  onClick={resetPoll}
                  className="mt-8 w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all"
                >
                  Create New Poll
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-6 right-6">
        <ChatPanel isTeacher />
      </div>
    </div>
  );
}