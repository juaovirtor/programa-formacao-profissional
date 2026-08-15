import { Check } from "lucide-react";
import Container from "../ui/Container";
import Reveal from "../ui/Reveal";
import Eyebrow from "../ui/Eyebrow";
import Particles from "../ui/Particles";
import { inclusao } from "../../data/program";

export default function Inclusion() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(85%_65%_at_20%_40%,rgba(200,245,50,0.07),transparent_60%),radial-gradient(70%_60%_at_85%_60%,rgba(139,92,246,0.14),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/40 to-transparent" />
        <Particles count={10} />
      </div>

      <Container>
        <div className="edge edge-lime rounded-3xl border border-line bg-panel/50 p-6 sm:p-10 lg:p-12">
          <div className="grid gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
            <Reveal>
              <Eyebrow tone="lime">Para quem é</Eyebrow>
              <h2 className="mt-5 font-display text-[28px] font-extrabold uppercase leading-[1.05] tracking-[-0.02em] sm:text-[38px] lg:text-[42px]">
                Aqui, todo mundo tem <span className="text-lime">espaço</span>.
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-mute-soft sm:text-[16.5px]">
                {inclusao.texto}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <ul className="space-y-3">
                {inclusao.itens.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3.5 rounded-2xl border border-line bg-void/60 p-4 transition-colors duration-300 hover:border-lime/40 sm:p-5"
                  >
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-lime/50 bg-lime/12">
                      <Check size={13} strokeWidth={3} className="text-lime" />
                    </span>
                    <span className="text-[14px] leading-relaxed text-mute-soft sm:text-[14.5px]">{item}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-[12.5px] leading-relaxed text-mute">{inclusao.observacao}</p>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
