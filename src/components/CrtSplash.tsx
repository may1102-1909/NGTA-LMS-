"use client";

import { useState, useCallback, useEffect } from "react";
import { CrtBackground } from "./effects/crt/CrtBackground";
import "./effects/crt/styles.css";

export function CrtSplash() {
  const [done, setDone] = useState(false);

  const handleBootComplete = useCallback(() => {
    setDone(true);
  }, []);

  // Failsafe: dismiss splash automatically after 3.2s
  useEffect(() => {
    const timer = setTimeout(() => {
      setDone(true);
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      onClick={() => setDone(true)}
      className={`crt-splash-overlay${done ? " crt-splash-done" : ""}`}
      title="Click anywhere to skip intro"
    >
      <CrtBackground
        variant="terminal"
        speed={1}
        motion={1}
        onBootComplete={handleBootComplete}
        bootDuration={2.8}
      />
    </div>
  );
}
