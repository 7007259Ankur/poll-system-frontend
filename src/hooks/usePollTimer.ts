import { useEffect, useState } from "react";

export const usePollTimer = (initialTime: number) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    setTime(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (time <= 0) return;

    const interval = setInterval(() => {
      setTime((t) => Math.max(t - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  return time;
};
