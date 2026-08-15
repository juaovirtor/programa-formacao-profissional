import { useEffect, useState } from "react";

/**
 * Abertura da marca.
 * Cobre a tela por ~1,2s com a logo do Group Phoenix e sai com um fade.
 *
 * Não aparece quando:
 * - o visitante prefere menos animação (acessibilidade);
 * - a URL já vem com âncora (ex.: /#inscricao vindo de um link compartilhado),
 *   porque nesse caso a pessoa quer ir direto ao ponto.
 */
const DURACAO = 1150; // tempo com a logo na tela
const FADE = 500; // tempo do fade de saída

export default function Intro() {
  const pular =
    typeof window !== "undefined" &&
    (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.location.hash.length > 1);

  const [estado, setEstado] = useState(pular ? "fim" : "entrando");

  useEffect(() => {
    if (estado === "fim") return;

    // Trava nos dois elementos: só no body a página ainda rola em alguns navegadores.
    const html = document.documentElement;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const saida = window.setTimeout(() => setEstado("saindo"), DURACAO);
    const fim = window.setTimeout(() => setEstado("fim"), DURACAO + FADE);

    return () => {
      window.clearTimeout(saida);
      window.clearTimeout(fim);
      html.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [estado]);

  if (estado === "fim") return null;

  const saindo = estado === "saindo";

  return (
    <div
      role="status"
      aria-label="Carregando"
      className={`fixed inset-0 z-[100] grid place-items-center bg-void transition-opacity duration-500 ease-out ${
        saindo ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div aria-hidden className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_45%,#0d1c3d_0%,#070b16_55%,#04060d_100%)]" />
        <div className="tech-grid absolute inset-0 opacity-40" />
        <div className="intro-brilho absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue/20 blur-[110px]" />
      </div>

      <div className={`relative flex flex-col items-center px-8 ${saindo ? "intro-sobe" : ""}`}>
        <img
          src="/assets/logo-grupo-phoenix.png"
          alt="Group Phoenix"
          className="intro-logo h-12 w-auto sm:h-14"
          width="182"
          height="48"
        />

        {/* Barra de progresso da abertura */}
        <div className="mt-7 h-px w-[140px] overflow-hidden rounded-full bg-line sm:w-[180px]">
          <div className="intro-barra h-full w-full origin-left bg-gradient-to-r from-blue via-violet to-lime" />
        </div>

        <p className="intro-texto mt-5 font-display text-[10px] font-semibold uppercase tracking-[0.24em] text-mute">
          Programa de Formação
        </p>
      </div>
    </div>
  );
}
