import Container from "../ui/Container";
import Reveal from "../ui/Reveal";
import { highlights } from "../../data/program";

export default function Stats() {
  return (
    <section className="relative border-y border-line-soft bg-deep/60">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(43,140,255,0.06),transparent_70%)]" />
      <Container className="py-10 sm:py-14">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
          {highlights.map((item, i) => (
            <Reveal
              key={item.label}
              delay={i * 0.07}
              className="group relative bg-void px-4 py-7 text-center transition-colors duration-300 hover:bg-panel sm:px-6 sm:py-9"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <p
                className={`font-display font-extrabold uppercase leading-[1.05] tracking-[-0.02em] text-transparent bg-gradient-to-b from-white to-white/65 bg-clip-text ${
                  // Palavra longa e sem espaço ("Certificação") não quebra em duas
                  // linhas: o corpo acompanha a largura da tela para nunca estourar
                  // a célula, com teto no desktop.
                  item.long
                    ? "text-[clamp(13px,4.1vw,30px)]"
                    : "text-[26px] sm:text-[36px] lg:text-[40px]"
                }`}
              >
                {item.value}
                {item.unit && (
                  <span className="ml-1.5 text-[15px] font-bold text-lime sm:text-[19px]">{item.unit}</span>
                )}
              </p>
              <p className="mt-2.5 text-[12.5px] text-mute sm:text-[13.5px]">{item.label}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
