import { useEffect, useState } from "react";

/**
 * Abertura da marca.
 *
 * Regra de tempo: a abertura tem um tempo-alvo contado desde o INÍCIO DO
 * CARREGAMENTO, não desde a montagem do React. Se o aparelho for lento e o
 * React só montar em 2s, o tempo-alvo já passou e a abertura sai quase
 * imediatamente — o visitante nunca fica preso esperando por causa da
 * lentidão do próprio site.
 *
 * A rolagem não é mais bloqueada no documento. O overlay cobre a tela e usa
 * `touch-action: none` enquanto está opaco; assim que o fade começa, ele já
 * libera o toque. Antes, `html/body { overflow: hidden }` mantinha a página
 * congelada por 1,65s contados após a montagem — a causa do travamento.
 */
const ALVO = 1100; // tempo total desde o carregamento da página
const MINIMO = 450; // nunca menos que isto, para o fade não parecer um piscar
const FADE = 450;

export default function Intro() {
  const pular =
    typeof window !== "undefined" &&
    (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.location.hash.length > 1);

  const [estado, setEstado] = useState(pular ? "fim" : "entrando");

  // Roda UMA vez, na montagem. Não pode depender de `estado`: a mudança para
  // "saindo" dispararia a limpeza e cancelaria o timer que remove a abertura.
  useEffect(() => {
    if (pular) return;

    // Quanto ainda falta para completar o tempo-alvo desde o carregamento.
    const restante = Math.max(MINIMO, ALVO - performance.now());

    const saida = window.setTimeout(() => setEstado("saindo"), restante);
    const fim = window.setTimeout(() => setEstado("fim"), restante + FADE);

    return () => {
      window.clearTimeout(saida);
      window.clearTimeout(fim);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (estado === "fim") return null;

  const saindo = estado === "saindo";

  return (
    <div
      role="status"
      aria-label="Carregando"
      style={{ touchAction: saindo ? "auto" : "none" }}
      className={`fixed inset-0 z-[100] grid place-items-center bg-void transition-opacity duration-450 ease-out ${
        saindo ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div aria-hidden className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_45%,#0d1c3d_0%,#070b16_55%,#04060d_100%)]" />
        <div className="tech-grid absolute inset-0 opacity-40" />
        <div className="intro-brilho absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue/20 blur-[60px] sm:h-[320px] sm:w-[320px] sm:blur-[110px]" />
      </div>

      <div className={`relative flex flex-col items-center px-8 ${saindo ? "intro-sobe" : ""}`}>
        {/* Largura fixa: garante a proporção da logo em qualquer tela. */}
        <img
          src="/assets/logo-grupo-phoenix.webp"
          alt="Group Phoenix"
          className="intro-logo h-auto w-[150px] sm:w-[190px]"
          width="600"
          height="159"
          fetchpriority="high"
        />

        {/* Barra de progresso da abertura */}
        <div className="mt-7 h-px w-[120px] overflow-hidden rounded-full bg-line sm:w-[160px]">
          <div className="intro-barra h-full w-full origin-left bg-gradient-to-r from-blue via-violet to-lime" />
        </div>

        <p className="intro-texto mt-5 font-display text-[10px] font-semibold uppercase tracking-[0.24em] text-mute">
          Programa de Formação
        </p>
      </div>
    </div>
  );
}
