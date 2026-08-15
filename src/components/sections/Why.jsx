import Container from "../ui/Container";
import Reveal from "../ui/Reveal";
import Eyebrow from "../ui/Eyebrow";
import Icon from "../ui/Icon";
import { reasons } from "../../data/program";

export default function Why() {
  return (
    <section id="programa" className="relative scroll-mt-20 overflow-hidden py-20 sm:py-28">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="tech-grid absolute inset-0 opacity-25" />
      </div>

      <Container>
        <Reveal className="mx-auto max-w-[720px] text-center">
          <Eyebrow tone="lime">Por que participar?</Eyebrow>
          <h2 className="mt-5 font-display text-[30px] font-extrabold uppercase leading-[1.03] tracking-[-0.02em] sm:text-[42px] lg:text-[46px]">
            Uma experiência que <span className="text-gradient-blue">abre portas</span>.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {reasons.map((reason, i) => (
            <Reveal key={reason.title} delay={(i % 3) * 0.08}>
              <article className="edge group relative h-full overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-panel/80 to-void/60 p-6 transition-all duration-400 hover:-translate-y-1.5 sm:p-7">
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-[2px] w-0 bg-gradient-to-r from-blue via-violet to-lime transition-all duration-500 group-hover:w-full"
                />
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-blue/20 to-violet/15 ring-1 ring-blue/25 transition-transform duration-400 group-hover:scale-110">
                  <Icon name={reason.icon} size={19} strokeWidth={2} className="text-blue-soft" />
                </div>
                <h3 className="mt-5 font-display text-[16.5px] font-bold uppercase tracking-[0.02em] text-white sm:text-[17.5px]">
                  {reason.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-mute-soft">{reason.text}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mx-auto mt-8 max-w-[760px]">
          <p className="rounded-xl border border-line bg-white/[0.02] px-5 py-4 text-center text-[12.5px] leading-relaxed text-mute sm:text-[13.5px]">
            O programa é uma formação profissional. A participação não garante contratação — os
            participantes com melhor desempenho poderão ter a oportunidade de integrar a equipe.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
