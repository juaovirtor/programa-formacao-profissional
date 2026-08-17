import Container from "../ui/Container";
import Reveal from "../ui/Reveal";
import Eyebrow from "../ui/Eyebrow";
import { steps } from "../../data/program";

export default function HowItWorks() {
  return (
    <section className="secao-adiada relative overflow-hidden py-20 sm:py-28">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(43,140,255,0.12),transparent_65%)]" />
      </div>

      <Container>
        <Reveal className="mx-auto max-w-[720px] text-center">
          <Eyebrow>Como funciona</Eyebrow>
          <h2 className="mt-5 font-display text-[30px] font-extrabold uppercase leading-[1.03] tracking-[-0.02em] sm:text-[42px] lg:text-[46px]">
            Do primeiro clique à <span className="text-lime">certificação</span>.
          </h2>
        </Reveal>

        <div className="relative mx-auto mt-14 max-w-[860px] sm:mt-18">
          {/* Linha conectora */}
          <div
            aria-hidden
            className="pulse-line absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-blue via-violet to-lime sm:left-1/2 sm:-translate-x-1/2"
          />

          <ol className="space-y-5 sm:space-y-0">
            {steps.map((step, i) => {
              const right = i % 2 === 1;
              return (
                <Reveal
                  key={step.number}
                  delay={0.05}
                  className={`relative flex gap-5 sm:gap-0 ${
                    right ? "sm:flex-row-reverse" : "sm:flex-row"
                  } sm:items-center sm:py-4`}
                >
                  {/* Marcador */}
                  <div className="relative z-10 shrink-0 sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                    <div className="grid h-10 w-10 place-items-center rounded-full border border-blue/45 bg-void font-display text-[12.5px] font-extrabold text-blue-soft shadow-[0_0_0_5px_rgba(4,6,13,1)]">
                      {step.number}
                    </div>
                  </div>

                  {/* Card */}
                  <div className={`flex-1 sm:max-w-[46%] ${right ? "sm:pl-10" : "sm:pr-10"}`}>
                    <div
                      className={`edge group rounded-2xl border border-line bg-panel/70 p-5 transition-all duration-300 hover:border-blue/40 hover:bg-panel sm:p-6 ${
                        right ? "sm:text-left" : "sm:text-right"
                      }`}
                    >
                      <h3 className="font-display text-[15.5px] font-bold uppercase tracking-[0.02em] text-white sm:text-[16.5px]">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-mute-soft sm:text-[14px]">
                        {step.text}
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:block sm:max-w-[46%] sm:flex-1" />
                </Reveal>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
