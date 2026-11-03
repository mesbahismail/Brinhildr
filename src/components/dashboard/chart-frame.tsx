"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type ChartSize = { width: number; height: number };

/**
 * Sizes a Recharts chart to its box in layout pixels. ResponsiveContainer reads
 * getBoundingClientRect, which includes the dashboard's 110% zoom, so charts drawn
 * inside it come out 10% wider than their card.
 */
export function ChartFrame({ children }: { children: (size: ChartSize) => ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<ChartSize>({ width: 0, height: 0 });

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const width = frame.clientWidth;
      const height = frame.clientHeight;
      setSize((current) =>
        current.width === width && current.height === height ? current : { width, height },
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frameRef} className="size-full min-h-0 min-w-0">
      {size.width > 0 && size.height > 0 && children(size)}
    </div>
  );
}
