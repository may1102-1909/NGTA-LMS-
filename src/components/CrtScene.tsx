"use client";

import React from "react";
import { CrtBackground } from "@/shaders/crt/CrtBackground";
import "@/shaders/threeui.css";

export { CrtBackground };

export function Scene() {
  return (
    <div className="shader-frame">
      <CrtBackground
        variant="terminal"
        speed={1.0}
        typeSpeed={1.0}
        motion={1.0}
        hue={0}
        saturation={1.0}
        brightness={1.0}
        opacity={1.0}
      />
    </div>
  );
}
