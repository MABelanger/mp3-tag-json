import React, { useState, useRef } from "react";

export default function TapTempo() {
  const [bpm, setBpm] = useState(null);
  const [status, setStatus] = useState("TAP HERE");

  // Use refs to track timestamps without triggering unnecessary re-renders
  const timestampsRef = useRef([]);
  const timeoutRef = useRef(null);

  const handleTap = () => {
    const now = performance.now();
    const RESET_TIMEOUT = 2000; // 2 seconds

    // 1. Clear any active auto-reset timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 2. Check if user paused too long since last tap
    const lastTap = timestampsRef.current[timestampsRef.current.length - 1];
    if (lastTap && now - lastTap > RESET_TIMEOUT) {
      timestampsRef.current = [];
    }

    // 3. Save new timestamp
    timestampsRef.current.push(now);

    // 4. Limit array to the last 4 taps for a smooth rolling average
    if (timestampsRef.current.length > 4) {
      timestampsRef.current.shift();
    }

    // 5. Calculate the BPM
    const count = timestampsRef.current.length;
    if (count > 1) {
      let totalIntervals = 0;
      for (let i = 1; i < count; i++) {
        totalIntervals +=
          timestampsRef.current[i] - timestampsRef.current[i - 1];
      }
      const averageInterval = totalIntervals / (count - 1);
      const calculatedBpm = Math.round(60000 / averageInterval);

      setBpm(calculatedBpm);
      setStatus("Tapping...");
    } else {
      setStatus("First tap...");
    }

    // 6. Schedule a reset if the user stops tapping
    timeoutRef.current = setTimeout(() => {
      timestampsRef.current = [];
      setBpm(null);
      setStatus("TAP HERE");
    }, RESET_TIMEOUT);
  };

  return (
    <div style={styles.container}>
      <button onMouseDown={handleTap} style={styles.button}>
        {status}
      </button>
      <div style={styles.display}>{bpm ? `${bpm} BPM` : "-- BPM"}</div>
    </div>
  );
}

// Minimal inline styles for quick preview
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "sans-serif",
    gap: "20px",
  },
  button: {
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    outline: "none",
    userSelect: "none",
  },
  display: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#333",
  },
};
