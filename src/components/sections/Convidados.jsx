import Container from "../ui/Container";
import Reveal from "../ui/Reveal";
import Eyebrow from "../ui/Eyebrow";
import Foto from "../ui/Foto";
import { convidados, segmentos } from "../../data/program";
import { mostrarEspacos } from "../../lib/espacos";

/** Quatro cartões de exemplo, só para revisar o layout antes dos dados reais. */
const exemplo = Array.from({ length: 4 }, () => ({
  foto: { src: null, descricao: "Foto do convidado" },
  nome: "[Nome]",
  cargo: "[Cargo]",
  empresa: "[Empresa]",
  segmento: "[Segmento]",
  tema: "[Tema compartilhado]",
}));

export default function Convidados() {
  const lista = convidados.length ? convidados : mostrarEspacos ? exemplo : [];
  const listaSegmentos = segmentos.length ? segmentos : mostrarEspacos ? ["[Segmento]", "[Segmento]", "[Segmento]"] : [];

  // Nenhum convidado real informado: a seção não existe no site publicado.
  if (lista.length === 0) return null;

  return (
    <section className="secao-adiada border-y border-line-soft bg-deep py-20 sm:py-28">
      <Container>
        <Reveal className="grid gap-5 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-12">
          <div>
            <Eyebrow tone="violet">Convidados e segmentos</Eyebrow>
            <h2 className="mt-5 font-display text-[28px] font-extrabold uppercase leading-[1.04] tracking-[-0.02em] sm:text-[40px] lg:text-[44px]">
              Quem dividiu a experiência <span className="text-gradient-blue">com a turma.</span>
            </h2>
          </div>
          <p className="text-[15px] leading-relaxed text-mute-soft sm:text-[16px]">
            Profissionais de diferentes áreas ampliam a visão dos participantes sobre o mercado de trabalho.
          </p>
        </Reveal>

        {/* No celular os cartões deslizam para o lado; no computador, grade de 4. */}
        <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {lista.map((c, i) => (
            <article key={i} className="w-[240px] shrink-0 snap-start overflow-hidden rounded-[22px] border border-line bg-panel sm:w-auto">
              <Foto foto={c.foto} sizes="(max-width: 639px) 240px, 280px" className="aspect-[4/4.2]" />
              <div className="flex flex-col gap-1.5 p-5">
                {c.segmento && (
                  <p className="font-display text-[10.5px] font-bold uppercase tracking-[0.16em] text-violet">{c.segmento}</p>
                )}
                <h3 className="font-display text-[16px] font-bold text-white">{c.nome}</h3>
                <p className="text-[13.5px] text-mute">{[c.cargo, c.empresa].filter(Boolean).join(" · ")}</p>
                {c.apresentacao && <p className="mt-1 text-[14px] leading-relaxed text-mute-soft">{c.apresentacao}</p>}
                {c.tema && <p className="mt-1 text-[14px] leading-relaxed text-mute-soft">{c.tema}</p>}
              </div>
            </article>
          ))}
        </div>

        {listaSegmentos.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            <span className="mr-1 text-[13px] text-mute">Segmentos representados:</span>
            {listaSegmentos.map((s, i) => (
              <span
                key={i}
                className="rounded-full border border-line bg-white/[0.03] px-3.5 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.1em] text-white/85"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
