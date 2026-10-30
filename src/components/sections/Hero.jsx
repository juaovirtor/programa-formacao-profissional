import { ArrowDown, ArrowRight } from "lucide-react";
import Container from "../ui/Container";
import Particles from "../ui/Particles";
import Foto from "../ui/Foto";
import Certificado from "../ui/Certificado";
import { hero } from "../../data/program";
import { fotosHero } from "../../data/fotos";
import { fotosVisiveis } from "../../lib/espacos";

export default function Hero({ onCta }) {
  // Sem nenhuma foto disponível, a montagem dá lugar só ao certificado.
  const comFotos = fotosVisiveis(fotosHero).length > 0;
  const [principal, apresentando, dinamica, convidado] = fotosHero;

  return (
    <section id="topo" className="relative overflow-hidden pt-[104px] pb-16 sm:pt-[132px] sm:pb-20 lg:pt-[150px] lg:pb-24">
      {/* Fundo */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_15%_0%,#0d1c3d_0%,#070b16_45%,#04060d_100%)]" />
        <div className="tech-grid tech-grid-fade absolute inset-0 opacity-70" />
        <div className="absolute -left-24 top-10 h-[420px] w-[420px] rounded-full bg-blue/18 blur-[60px] sm:blur-[130px]" />
        <div className="absolute right-0 top-40 h-[380px] w-[380px] rounded-full bg-violet/16 blur-[60px] sm:blur-[130px]" />
        <Particles count={14} />
      </div>

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-12">
          {/* ---------------- TEXTO ---------------- */}
          <div className="text-center lg:text-left">
            <div style={{ "--surge-delay": "0s" }} className="surge flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue/35 bg-blue/10 px-4 py-2 font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-soft sm:text-[11px]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="halo absolute inline-flex h-full w-full rounded-full bg-lime" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime" />
                </span>
                {hero.selo}
              </span>
            </div>

            <h1
              style={{ "--surge-delay": "0.08s" }}
              className="surge mt-6 font-display text-[34px] font-extrabold uppercase leading-[1] tracking-[-0.02em] sm:text-[48px] lg:text-[54px] xl:text-[60px]"
            >
              {hero.titulo} <span className="text-gradient-blue">{hero.destaque}</span>
            </h1>

            <p
              style={{ "--surge-delay": "0.16s" }}
              className="surge mx-auto mt-6 max-w-[540px] text-[15.5px] leading-relaxed text-mute-soft sm:text-[17px] lg:mx-0"
            >
              {hero.texto}
            </p>

            <ul
              style={{ "--surge-delay": "0.24s" }}
              className="surge mt-7 flex flex-wrap justify-center gap-2 sm:gap-2.5 lg:justify-start"
            >
              {hero.destaques.map((item, i) => (
                <li
                  key={item}
                  className={`inline-flex items-center rounded-full border px-3.5 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.1em] sm:text-[12px] ${
                    i === 0 ? "border-lime/45 bg-lime/10 text-lime" : "border-line bg-white/[0.03] text-white/85"
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>

            <div
              style={{ "--surge-delay": "0.32s" }}
              className="surge mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start"
            >
              <button
                onClick={onCta}
                className="btn-shine group inline-flex items-center justify-center gap-2 rounded-full bg-lime px-8 py-4 font-display text-[14px] font-bold uppercase tracking-[0.08em] text-void shadow-[0_16px_45px_-15px_rgba(200,245,50,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-lime-soft"
              >
                Quero participar
                <ArrowRight size={17} strokeWidth={2.8} className="transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="#historia"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white/[0.03] px-7 py-4 font-display text-[13.5px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-blue/60 hover:bg-blue/10"
              >
                Conheça o programa
                <ArrowDown size={16} strokeWidth={2.4} className="text-blue" />
              </a>
            </div>
          </div>

          {/* ---------------- MONTAGEM DE FOTOS + CERTIFICADO ---------------- */}
          <div style={{ "--surge-delay": "0.2s" }} className="surge-escala relative mx-auto w-full max-w-[560px]">
            {comFotos ? (
              <div className="relative aspect-[1/1.02] w-full">
                <Foto foto={principal} priority sizes="(max-width: 1023px) 60vw, 330px" className="absolute left-0 top-0 h-[66%] w-[62%] rounded-[22px]" />
                <Foto foto={apresentando} sizes="(max-width: 1023px) 34vw, 190px" className="absolute right-0 top-[6%] h-[40%] w-[34%] rounded-[20px]" />
                <Foto foto={dinamica} sizes="(max-width: 1023px) 34vw, 190px" className="absolute right-0 top-[50%] h-[32%] w-[34%] rounded-[20px]" />
                <Foto foto={convidado} sizes="(max-width: 1023px) 40vw, 220px" className="absolute bottom-0 left-0 hidden h-[30%] w-[40%] rounded-[20px] sm:block" />
                <div className="absolute left-[30%] top-[52%] w-[54%] sm:left-[36%] sm:w-[52%]">
                  <Certificado tamanho="sm" />
                </div>
              </div>
            ) : (
              <div className="relative mx-auto max-w-[460px] py-6">
                <Certificado tamanho="lg" />
              </div>
            )}
            <span className="absolute -top-3 right-2 rotate-[4deg] rounded-xl bg-violet px-3.5 py-2 font-display text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_14px_36px_-12px_rgba(139,92,246,0.9)] sm:text-[11.5px]">
              Primeira turma realizada
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
