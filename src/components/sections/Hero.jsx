import { ArrowDown, ArrowRight, BadgeCheck, Building2, CalendarDays, MapPin, Wallet } from "lucide-react";
import Container from "../ui/Container";
import Particles from "../ui/Particles";

const badges = [
  { icon: CalendarDays, label: "4 semanas" },
  { icon: Building2, label: "Presencial" },
  { icon: Wallet, label: "Gratuito" },
  { icon: BadgeCheck, label: "Certificação" },
  { icon: MapPin, label: "Reserva · PR" },
];

export default function Hero({ onCta }) {
  return (
    <section id="topo" className="relative overflow-hidden pt-[104px] pb-16 sm:pt-[132px] sm:pb-24 lg:pt-[150px] lg:pb-28">
      {/* Fundo */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_15%_0%,#0d1c3d_0%,#070b16_45%,#04060d_100%)]" />
        <div className="tech-grid tech-grid-fade absolute inset-0 opacity-70" />
        <div className="absolute -left-24 top-10 h-[420px] w-[420px] rounded-full bg-blue/18 blur-[60px] sm:blur-[130px]" />
        <div className="absolute right-0 top-40 h-[380px] w-[380px] rounded-full bg-violet/16 blur-[60px] sm:blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 h-[260px] w-[260px] rounded-full bg-lime/[0.07] blur-[55px] sm:blur-[120px]" />
        <Particles count={16} />
      </div>

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* ---------------- COLUNA ESQUERDA ---------------- */}
          <div className="text-center lg:text-left">
            <div style={{ "--surge-delay": "0s" }} className="surge flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue/35 bg-blue/10 px-4 py-2 font-display text-[10.5px] font-semibold uppercase tracking-[0.2em] text-blue-soft sm:text-[11px]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="halo absolute inline-flex h-full w-full rounded-full bg-lime" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime" />
                </span>
                Programa de Formação Profissional
              </span>
            </div>

            <h1 style={{ "--surge-delay": "0.08s" }} className="surge mt-6 font-display text-[38px] font-extrabold uppercase leading-[0.98] tracking-[-0.02em] sm:text-[52px] lg:text-[62px] xl:text-[68px]"
            >
              Seu futuro
              <br className="hidden sm:block" /> começa com o{" "}
              <span className="relative inline-block">
                <span className="text-lime">primeiro passo</span>
                <svg
                  aria-hidden
                  viewBox="0 0 300 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1 left-0 h-[8px] w-full text-lime/70 sm:-bottom-2 sm:h-[10px]"
                >
                  <path
                    d="M2 8.5C60 3.5 140 2.5 298 6.5"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
              <span className="text-lime">.</span>
            </h1>

            <p style={{ "--surge-delay": "0.16s" }} className="surge mx-auto mt-7 max-w-[540px] text-[15.5px] leading-relaxed text-mute-soft sm:text-[17px] lg:mx-0"
            >
              Uma formação prática para desenvolver conhecimentos técnicos, profissionais e preparar você
              para os desafios do mercado de trabalho.
            </p>

            {/* Linha de destaque */}
            <div style={{ "--surge-delay": "0.24s" }} className="surge mt-7 flex flex-wrap justify-center gap-2 sm:gap-2.5 lg:justify-start"
            >
              {badges.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-3.5 py-2 font-display text-[11.5px] font-semibold uppercase tracking-[0.1em] text-white/85 sm:text-[12px]"
                >
                  <Icon size={13} className="text-blue" strokeWidth={2.4} />
                  {label}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ "--surge-delay": "0.32s" }} className="surge mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start"
            >
              <button
                onClick={onCta}
                className="btn-shine group inline-flex items-center justify-center gap-2 rounded-full bg-lime px-8 py-4 font-display text-[14px] font-bold uppercase tracking-[0.08em] text-void shadow-[0_16px_45px_-15px_rgba(200,245,50,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-lime-soft"
              >
                Quero me inscrever
                <ArrowRight size={17} strokeWidth={2.8} className="transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="#programa"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white/[0.03] px-7 py-4 font-display text-[13.5px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-blue/60 hover:bg-blue/10"
              >
                Conhecer o programa
                <ArrowDown size={16} strokeWidth={2.4} className="text-blue" />
              </a>
            </div>
          </div>

          {/* ---------------- COLUNA DIREITA — IMAGEM ---------------- */}
          <div
            style={{ "--surge-delay": "0.2s" }}
            className="surge-escala relative mx-auto w-full max-w-[420px] lg:max-w-none"
          >
            {/* Moldura luminosa */}
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-3 rounded-[32px] bg-gradient-to-tr from-blue/35 via-violet/25 to-lime/25 opacity-60 blur-2xl"
              />
              <div className="edge relative overflow-hidden rounded-[26px] border border-line bg-panel">
                {/*
                  IMAGEM DO HERO — para trocar, gere as duas larguras em WebP
                  (480 e 900px) mantendo proporção retrato (~4:5).
                */}
                <img
                  src="/assets/hero-jovem-900.webp"
                  srcSet="/assets/hero-jovem-480.webp 480w, /assets/hero-jovem-900.webp 900w"
                  sizes="(max-width: 1023px) 92vw, 500px"
                  alt="Jovem sorrindo em ambiente de tecnologia"
                  className="aspect-[4/5] w-full object-cover object-top"
                  width="900"
                  height="1159"
                  fetchpriority="high"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-void via-void/12 to-transparent"
                />

                {/* Cantos técnicos */}
                <span aria-hidden className="absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-lime/70" />
                <span aria-hidden className="absolute right-4 top-4 h-6 w-6 border-r-2 border-t-2 border-blue/70" />
                <span aria-hidden className="absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-blue/70" />
                <span aria-hidden className="absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-lime/70" />

                {/* Selo flutuante */}
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-line bg-void/80 px-4 py-3 backdrop-blur-md">
                  <div>
                    <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-mute">
                      Inscrições
                    </p>
                    <p className="font-display text-[15px] font-bold uppercase tracking-tight text-lime">
                      Abertas
                    </p>
                  </div>
                  <div className="h-9 w-px bg-line" />
                  <div className="text-right">
                    <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-mute">
                      Custo
                    </p>
                    <p className="font-display text-[15px] font-bold uppercase tracking-tight text-white">
                      R$ 0
                    </p>
                  </div>
                </div>
              </div>

              {/* Etiqueta 100% gratuito */}
              <div className="absolute -right-2 -top-3 rotate-[6deg] rounded-xl bg-gradient-to-r from-blue-deep to-blue px-3.5 py-2 shadow-[0_14px_36px_-12px_rgba(43,140,255,0.9)] sm:-right-4 sm:-top-4">
                <p className="font-display text-[11px] font-extrabold uppercase leading-none tracking-[0.12em] text-white sm:text-[12.5px]">
                  100% Gratuito
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
