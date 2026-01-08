 import { useState, useEffect } from "react";

export default function CountdownTimer({ deadline }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!deadline) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(deadline).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  if (!deadline) return <span>Rolling</span>;

  return (
    <span style={{ 
      color: "#ff4d4f", 
      fontWeight: "bold", 
      backgroundColor: "#fff1f0", 
      padding: "2px 6px", 
      borderRadius: "4px",
      fontSize: "0.9rem"
    }}>
      {timeLeft}
    </span>
  );
}