import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export type PollOption = {
  id: string;
  text: string;
  votes: number;
  percentage?: number;
};

export type Poll = {
  id: string;
  question: string;
  options: PollOption[];
  status: 'active' | 'ended';
  remainingTime: number;
  userVotedOptionId?: string | null;
};

// 🔴 FIX START: Define API_URL dynamically based on environment
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Use API_URL instead of hardcoded string
const socket: Socket = io(API_URL, {
  autoConnect: false,
});
// 🔴 FIX END

export const useStudentPoll = (studentName: string) => {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!studentName) return;

    socket.auth = { name: studentName };
    socket.connect();
    setIsConnected(true);

    console.log("Student connecting, requesting state from:", API_URL);
    socket.emit("get_current_state", { studentName });

    socket.on("sync_state", (data: { poll: Poll | null }) => {
      console.log("Synced state:", data);
      if (data.poll) setPoll(data.poll);
      else setPoll(null);
    });

    socket.on("poll_started", (newPoll: Poll) => {
      setPoll(newPoll);
    });

    socket.on("poll_updated", (updatedPoll: Poll) => {
      setPoll(updatedPoll);
    });

    socket.on("poll_ended", (endedPoll: Poll) => {
       setPoll({ ...endedPoll, status: 'ended', remainingTime: 0 });
    });

    return () => {
      socket.off("sync_state");
      socket.off("poll_started");
      socket.off("poll_updated");
      socket.off("poll_ended");
      socket.disconnect();
    };
  }, [studentName]);

  const submitVote = useCallback((optionId: string) => {
    if (!poll) return;
    
    setPoll(prev => prev ? { ...prev, userVotedOptionId: optionId } : null);
    
    socket.emit("submit_vote", { 
        pollId: poll.id, 
        optionId,
        studentName 
    });
  }, [poll, studentName]);

  return { poll, submitVote, isConnected };
};