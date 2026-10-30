import Container from "../ui/Container";
import Reveal from "../ui/Reveal";
import Eyebrow from "../ui/Eyebrow";
import Certificado from "../ui/Certificado";
import { certificado } from "../../data/program";

export default function Certificacao() {
  return (
    <section className="secao-adiada relative overflow-hidden border-y border-line-soft bg-deep py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal>
            <Eyebrow>Certificação</Eyebrow>
            <h2 className="mt-5 font-display text-[28px] font-extrabold uppercase leading-[1.04] tracking-[-0.02em] sm:text-[38px] lg:text-[42px]">
              {certificado.titulo} <span className="text-gradient-blue">{certificado.destaque}</span>
            </h2>
            <p className="mt-5 max-w-[480px] text-[15px] leading-relaxed text-mute-soft sm:text-[16.5px]">{certificado.texto}</p>
          </Reveal>

          <Reveal delay={0.1} className="relative mx-auto w-full max-w-[520px] px-4 py-6">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(43,140,255,0.32),rgba(139,92,246,0.14),transparent)]"
            />
            <Certificado tamanho="lg" />
            <span className="absolute -bottom-1 right-2 rotate-[4deg] rounded-full bg-lime px-4 py-2 font-display text-[10.5px] font-bold uppercase tracking-[0.14em] text-void sm:text-[11px]">
              Sem custo para o participante
            </span>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
