import Container from "../ui/Container";
import Reveal from "../ui/Reveal";
import Eyebrow from "../ui/Eyebrow";
import Foto from "../ui/Foto";
import { formacao } from "../../data/program";
import { fotosPilares } from "../../data/fotos";

const destaque = {
  violet: { borda: "border-violet/45", rotulo: "text-violet" },
  blue: { borda: "border-blue/45", rotulo: "text-blue" },
};

/**
 * Os seis pilares. Comunicação e relacionamento interpessoal são os
 * principais e ganham bloco grande com foto; os outros quatro vêm menores.
 */
export default function Formacao() {
  const principais = formacao.pilares.slice(0, 2);
  const demais = formacao.pilares.slice(2);

  return (
    <section id="formacao" className="secao-adiada relative scroll-mt-20 overflow-hidden border-y border-line-soft bg-deep py-20 sm:py-28">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_85%_10%,rgba(139,92,246,0.14),transparent_60%)]" />
      <Container>
        <Reveal className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow tone="violet">O que você desenvolve</Eyebrow>
            <h2 className="mt-5 font-display text-[30px] font-extrabold uppercase leading-[1.02] tracking-[-0.02em] sm:text-[44px] lg:text-[52px]">
              {formacao.titulo} <span className="text-gradient-blue">{formacao.destaque}</span>
            </h2>
          </div>
          <p className="max-w-[400px] text-[15px] leading-relaxed text-mute-soft sm:text-[16.5px]">{formacao.frase}</p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:mt-12 md:grid-cols-2 md:gap-5">
          {principais.map((pilar, i) => {
            const cor = destaque[pilar.cor];
            return (
              <Reveal key={pilar.titulo} delay={i * 0.08}>
                <article className={`flex h-full flex-col overflow-hidden rounded-3xl border bg-panel ${cor.borda}`}>
                  <Foto foto={fotosPilares[pilar.foto]} sizes="(max-width: 767px) 92vw, 560px" className="aspect-[16/8]" />
                  <div className="flex flex-col gap-3 p-6 sm:p-8">
                    <p className={`font-display text-[11.5px] font-bold uppercase tracking-[0.18em] ${cor.rotulo}`}>
                      Pilar {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="font-display text-[23px] font-extrabold uppercase leading-tight sm:text-[30px]">
                      {pilar.titulo}
                    </h3>
                    <p className="text-[15px] leading-relaxed text-mute-soft sm:text-[16px]">{pilar.texto}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:mt-5 lg:grid-cols-4">
          {demais.map((pilar, i) => (
            <Reveal key={pilar.titulo} delay={0.04 * i}>
              <div className="flex h-full flex-col gap-2.5 rounded-2xl border border-line p-5 sm:p-6">
                <p className="font-display text-[12px] font-bold text-mute">{String(i + 3).padStart(2, "0")}</p>
                <h3 className="font-display text-[15px] font-bold uppercase leading-snug">{pilar.titulo}</h3>
                <p className="text-[14px] leading-relaxed text-mute">{pilar.texto}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
