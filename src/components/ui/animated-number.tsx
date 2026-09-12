"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";

export function AnimatedNumber({ value, duration = 1 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, duration]);

  return <>{display.toLocaleString("fr-FR")}</>;
}
