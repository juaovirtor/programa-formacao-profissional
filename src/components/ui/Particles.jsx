import { useMemo } from "react";

/** Partículas tecnológicas discretas (puro CSS, sem custo de render). */
export default function Particles({ count = 18, className = "" }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${(i * 37 + 11) % 97}%`,
        top: `${(i * 53 + 7) % 92}%`,
        size: i % 5 === 0 ? 3 : 2,
        delay: `${(i % 7) * 0.8}s`,
        duration: `${7 + (i % 5)}s`,
        color: i % 6 === 0 ? "bg-lime" : i % 3 === 0 ? "bg-violet" : "bg-blue",
      })),
    [count],
  );

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {dots.map((dot, i) => (
        <span
          key={i}
          className={`particle absolute rounded-full ${dot.color}`}
          style={{
            left: dot.left,
            top: dot.top,
            width: dot.size,
            height: dot.size,
            animationDelay: dot.delay,
            animationDuration: dot.duration,
          }}
        />
      ))}
    </div>
  );
}
