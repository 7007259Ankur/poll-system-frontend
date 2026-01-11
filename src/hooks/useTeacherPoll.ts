import { useState, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";

// Define strict types for the poll structure
export type PollOption = { 
  id?: string; 
  text: string; 
  votes: number; 
  percentage?: number 
};

export type Poll = { 
  id: string; 
  question: string; 
  options: PollOption[]; 
  duration: number; 
  remainingTime: number; // Critical for sync
  status: 'active' | 'ended';
};

// Singleton socket connection to prevent multiple connections
const socket: Socket = io("http://localhost:5000", {
  autoConnect: false,
  reconnection: true,
});

export const useTeacherPoll = () => {
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string>("");

  useEffect(() => {
    socket.connect();

    function onConnect() {
      setIsConnected(true);
      setSocketId(socket.id || "");
      
      // ✅ RESILIENCE: Immediately ask backend for current state on refresh/connect
      console.log("Connected. Requesting state sync...");
      socket.emit("get_current_state");
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    // ✅ RESILIENCE: Handle the state sent back from server
    function onSyncState(state: { poll: Poll | null }) {
      console.log("State synced:", state);
      if (state.poll) {
        setActivePoll(state.poll);
      }
    }

    function onPollStarted(poll: Poll) {
      setActivePoll(poll);
    }

    function onPollUpdated(updatedPoll: Poll) {
      // This handles real-time vote updates AND timer updates
      setActivePoll(updatedPoll);
    }

    function onPollEnded(finalPoll: Poll) {
      setActivePoll({ ...finalPoll, status: 'ended', remainingTime: 0 });
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("sync_state", onSyncState);
    socket.on("poll_started", onPollStarted);
    socket.on("poll_updated", onPollUpdated); // Updates votes & timer
    socket.on("poll_ended", onPollEnded);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("sync_state", onSyncState);
      socket.off("poll_started", onPollStarted);
      socket.off("poll_updated", onPollUpdated);
      socket.off("poll_ended", onPollEnded);
      socket.disconnect();
    };
  }, []);

  // ✅ SEPARATION OF CONCERNS: Logic is here, not in UI
  const createPoll = useCallback((question: string, options: string[], duration: number) => {
    if (!question.trim()) return alert("Please enter a question");
    if (options.some(opt => !opt.trim())) return alert("Please fill all options");

    socket.emit("create_poll", {
      question,
      options: options.map(text => ({ text })), 
      duration
    });
  }, []);

  const resetPoll = useCallback(() => {
    // Ideally, tell server to clear state if needed, or just clear local
    setActivePoll(null);
  }, []);

  return { 
    activePoll, 
    createPoll, 
    resetPoll, 
    isConnected,
    socketId
  };
};