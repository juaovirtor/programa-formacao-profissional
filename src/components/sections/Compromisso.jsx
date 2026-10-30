import Container from "../ui/Container";
import Reveal from "../ui/Reveal";
import Eyebrow from "../ui/Eyebrow";
import { compromisso } from "../../data/program";

/** Gratuidade e compromisso social — seção institucional própria. */
export default function Compromisso() {
  return (
    <section className="secao-adiada relative overflow-hidden py-20 sm:py-28">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_15%_50%,rgba(200,245,50,0.08),transparent_65%)]" />
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <Reveal>
            <Eyebrow tone="lime">Gratuidade e compromisso social</Eyebrow>
            <h2 className="mt-5 font-display text-[34px] font-extrabold uppercase leading-[0.98] tracking-[-0.02em] sm:text-[52px] lg:text-[62px]">
              {compromisso.titulo} <span className="text-lime">{compromisso.destaque}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="space-y-4 text-[15px] leading-relaxed text-mute-soft sm:text-[16.5px]">
            {compromisso.paragrafos.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="font-semibold text-white">{compromisso.fecho}</p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
