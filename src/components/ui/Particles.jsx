import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Partículas tecnológicas discretas (puro CSS, sem custo de render).
 *
 * Duas economias importantes no celular:
 * 1. Metade das partículas — em tela pequena a diferença visual é imperceptível.
 * 2. A animação é PAUSADA quando o bloco sai da tela. Antes, 52 partículas
 *    animavam infinitamente mesmo com 41 delas fora da viewport, consumindo
 *    GPU e bateria durante toda a visita.
 */
export default function Particles({ count = 18, className = "" }) {
  const ref = useRef(null);
  const [visivel, setVisivel] = useState(true);

  // Menos partículas em telas pequenas (avaliado uma vez, na montagem).
  const total = useMemo(() => {
    if (typeof window === "undefined") return count;
    return window.innerWidth < 768 ? Math.ceil(count / 2) : count;
  }, [count]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entrada]) => setVisivel(entrada.isIntersecting),
      { rootMargin: "100px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const dots = useMemo(
    () =>
      Array.from({ length: total }, (_, i) => ({
        left: `${(i * 37 + 11) % 97}%`,
        top: `${(i * 53 + 7) % 92}%`,
        size: i % 5 === 0 ? 3 : 2,
        delay: `${(i % 7) * 0.8}s`,
        duration: `${7 + (i % 5)}s`,
        color: i % 6 === 0 ? "bg-lime" : i % 3 === 0 ? "bg-violet" : "bg-blue",
      })),
    [total],
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${
        visivel ? "" : "particulas-pausadas"
      } ${className}`}
    >
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
