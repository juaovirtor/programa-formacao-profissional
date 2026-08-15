import Container from "../ui/Container";
import Reveal from "../ui/Reveal";
import Eyebrow from "../ui/Eyebrow";
import Icon from "../ui/Icon";
import { local } from "../../data/program";

export default function LocalRoots() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/40 to-transparent" />
        <div className="absolute left-1/2 top-0 h-[320px] w-[560px] -translate-x-1/2 rounded-full bg-lime/[0.06] blur-[120px]" />
      </div>

      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
          <Reveal>
            <Eyebrow tone="lime">
              {local.cidade} · {local.estado}
            </Eyebrow>
            <h2 className="mt-5 font-display text-[28px] font-extrabold uppercase leading-[1.05] tracking-[-0.02em] sm:text-[38px] lg:text-[42px]">
              Inovação que nasce em <span className="text-lime">{local.cidade}</span>.
            </h2>
            <p className="mt-5 max-w-[540px] text-[15px] leading-relaxed text-mute-soft sm:text-[16.5px]">
              {local.texto}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-3">
              {local.pilares.map((pilar) => (
                <div
                  key={pilar.title}
                  className="edge group flex items-start gap-4 rounded-2xl border border-line bg-panel/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-lime/40 hover:bg-panel"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-white/[0.03] transition-colors duration-300 group-hover:border-lime/40 group-hover:bg-lime/10">
                    <Icon
                      name={pilar.icon}
                      size={17}
                      strokeWidth={2}
                      className="text-blue transition-colors duration-300 group-hover:text-lime"
                    />
                  </span>
                  <div>
                    <h3 className="font-display text-[14.5px] font-bold uppercase tracking-[0.03em] text-white sm:text-[15.5px]">
                      {pilar.title}
                    </h3>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-mute-soft">{pilar.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
