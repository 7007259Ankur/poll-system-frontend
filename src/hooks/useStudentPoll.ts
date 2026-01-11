import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

// ✅ FIX: Define the shape explicitly to resolve red squiggly lines
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
  remainingTime: number;         // Fixes "Property remainingTime does not exist"
  userVotedOptionId?: string | null; // Fixes "Property userVotedOptionId does not exist"
};

// Singleton socket
const socket: Socket = io("http://localhost:5000", {
  autoConnect: false,
});

export const useStudentPoll = (studentName: string) => {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!studentName) return;

    // Connect with auth data
    socket.auth = { name: studentName };
    socket.connect();
    setIsConnected(true);

    // ✅ RESILIENCE: Immediately ask backend for current state
    // "I just joined/refreshed. What is happening?"
    console.log("Student connecting, requesting state...");
    socket.emit("get_current_state", { studentName });

    // Listeners
    socket.on("sync_state", (data: { poll: Poll | null }) => {
      console.log("Synced state:", data);
      if (data.poll) setPoll(data.poll);
      else setPoll(null);
    });

    socket.on("poll_started", (newPoll: Poll) => {
      setPoll(newPoll);
    });

    socket.on("poll_updated", (updatedPoll: Poll) => {
      // ✅ TIMER SYNC: The backend sends the correct 'remainingTime' here
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
    
    // Optimistic UI Update (makes it feel instant)
    setPoll(prev => prev ? { ...prev, userVotedOptionId: optionId } : null);
    
    socket.emit("submit_vote", { 
        pollId: poll.id, 
        optionId,
        studentName 
    });
  }, [poll, studentName]);

  return { poll, submitVote, isConnected };
};