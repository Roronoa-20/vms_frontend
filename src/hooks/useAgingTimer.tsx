import { useEffect, useState } from "react";

function parseTimeDiff(timeDiff: string) {
  if (!timeDiff) return 0;
  const regex = /(?:(\d+)d)?\s*(?:(\d+)h)?\s*(?:(\d+)m)?/;
  const match = timeDiff.match(regex);

  if (!match) return 0;

  const days = parseInt(match[1] || "0", 10);
  const hours = parseInt(match[2] || "0", 10);
  const minutes = parseInt(match[3] || "0", 10);

  return days * 86400 + hours * 3600 + minutes * 60; // total seconds
}

function formatTime(seconds: number) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${days}d ${hours}h ${minutes}m ${secs}s`;
}

export function useAgingTimer(initialDiff: string) {
  const [elapsed, setElapsed] = useState(() => parseTimeDiff(initialDiff));

  useEffect(() => {
    setElapsed(parseTimeDiff(initialDiff));
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [initialDiff]);

  return formatTime(elapsed);
}
