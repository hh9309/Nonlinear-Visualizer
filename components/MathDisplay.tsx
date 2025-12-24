
import React, { useEffect, useRef } from 'react';

interface MathDisplayProps {
  math: string;
  block?: boolean;
}

const MathDisplay: React.FC<MathDisplayProps> = ({ math, block = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        // Fix: Cast window to any to access globally loaded KaTeX library without TS errors
        (window as any).katex.render(math, containerRef.current, {
          throwOnError: false,
          displayMode: block,
        });
      } catch (err) {
        console.error("KaTeX error:", err);
      }
    }
  }, [math, block]);

  return <div ref={containerRef} className={block ? "my-4 overflow-x-auto" : "inline-block"} />;
};

export default MathDisplay;
