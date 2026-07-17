"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";

export function useClock(): { time: string; date: string } {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return { time: "--:-- --", date: "---" };

  return {
    time: format(now, "hh:mm:ss aa"),
    date: format(now, "EEE, dd MMM yyyy"),
  };
}
