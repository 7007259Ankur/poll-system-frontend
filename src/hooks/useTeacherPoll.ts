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
  remainingTime: number; 
  status: 'active' | 'ended';
};

// 🔴 FIX START: Define API_URL dynamically based on environment
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Use API_URL instead of hardcoded string
const socket: Socket = io(API_URL, {
  autoConnect: false,
  reconnection: true,
});
// 🔴 FIX END

export const useTeacherPoll = () => {
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string>("");

  useEffect(() => {
    socket.connect();

    function onConnect() {
      setIsConnected(true);
      setSocketId(socket.id || "");
      
      console.log("Connected to", API_URL, "- Requesting state sync...");
      socket.emit("get_current_state");
    }

    function onDisconnect() {
      setIsConnected(false);
    }

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
      setActivePoll(updatedPoll);
    }

    function onPollEnded(finalPoll: Poll) {
      setActivePoll({ ...finalPoll, status: 'ended', remainingTime: 0 });
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("sync_state", onSyncState);
    socket.on("poll_started", onPollStarted);
    socket.on("poll_updated", onPollUpdated);
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