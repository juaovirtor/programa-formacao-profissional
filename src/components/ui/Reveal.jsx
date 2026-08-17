import { useEffect, useRef } from "react";

/**
 * Fade-in suave conforme a seção entra na tela.
 *
 * Antes: cada Reveal era um componente do Framer Motion com `whileInView`,
 * o que criava um IntersectionObserver por elemento (22 no total) e um custo
 * de montagem alto no carregamento.
 *
 * Agora: um ÚNICO observer compartilhado por toda a página e a transição
 * feita em CSS. O efeito visual (opacidade + deslocamento, mesma duração e
 * mesma curva) continua idêntico.
 */

let observador = null;

function getObservador() {
  if (observador) return observador;

  observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        entrada.target.classList.add("reveal-visivel");
        observador.unobserve(entrada.target); // once: dispara uma vez só
      }
    },
    { rootMargin: "-60px 0px" },
  );

  return observador;
}

const MARGEM = 60;

export default function Reveal({ children, delay = 0, y = 22, className = "", as: Tag = "div" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mostrarJa = () => el.classList.add("reveal-visivel");

    // Sem animação para quem pediu menos movimento: aparece direto.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return mostrarJa();

    // Navegador sem suporte: o conteúdo aparece, nunca fica invisível.
    if (!("IntersectionObserver" in window)) return mostrarJa();

    // Se já está na tela na montagem, mostra sem esperar o observer.
    // Além de ser mais rápido para o conteúdo da primeira dobra, garante que
    // nada dependa de um callback que pode demorar (ou não vir, se a aba
    // estiver em segundo plano no carregamento).
    const box = el.getBoundingClientRect();
    if (box.top < window.innerHeight - MARGEM && box.bottom > MARGEM) return mostrarJa();

    const obs = getObservador();
    obs.observe(el);
    return () => obs.unobserve(el);
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--reveal-y": `${y}px`, "--reveal-delay": `${delay}s` }}
    >
      {children}
    </Tag>
  );
}
