import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Container from "../ui/Container";
import Reveal from "../ui/Reveal";
import Eyebrow from "../ui/Eyebrow";
import Foto from "../ui/Foto";
import { categoriasGaleria, galeria } from "../../data/fotos";
import { fotosVisiveis } from "../../lib/espacos";

/*
 * Tamanhos da grade editorial (12 colunas no computador). Repete a partir
 * da 10ª foto. No celular a grade vira 2 colunas e a 1ª foto ocupa as duas.
 */
const formatos = [
  "col-span-2 row-span-2 lg:col-span-6 lg:row-span-4",
  "lg:col-span-3 lg:row-span-2",
  "lg:col-span-3 lg:row-span-3",
  "lg:col-span-3 lg:row-span-2",
  "lg:col-span-3 lg:row-span-3",
  "lg:col-span-4 lg:row-span-3",
  "col-span-2 lg:col-span-5 lg:row-span-3",
  "lg:col-span-3 lg:row-span-2",
  "lg:col-span-3 lg:row-span-2",
];

/** Seção "Experiência na prática": galeria das turmas com ampliação. */
export default function Galeria() {
  const fotos = useMemo(() => fotosVisiveis(galeria), []);
  const [filtro, setFiltro] = useState("Todos");
  const [aberta, setAberta] = useState(null); // índice em `filtradas`

  // Só mostra filtros de categorias que têm foto.
  const categorias = categoriasGaleria.filter((c) => fotos.some((f) => f.categoria === c));
  const filtradas = filtro === "Todos" ? fotos : fotos.filter((f) => f.categoria === filtro);
  const ampliaveis = filtradas.filter((f) => f.src);

  if (fotos.length === 0) return null;

  return (
    <section id="experiencia" className="secao-adiada scroll-mt-20 py-20 sm:py-28">
      <Container>
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow>Experiência na prática</Eyebrow>
            <h2 className="mt-5 font-display text-[29px] font-extrabold uppercase leading-[1.04] tracking-[-0.02em] sm:text-[42px] lg:text-[48px]">
              O que aconteceu <span className="text-gradient-blue">na sala.</span>
            </h2>
          </div>
          {categorias.length > 1 && (
            <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filtrar fotos">
              {["Todos", ...categorias].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFiltro(c)}
                  aria-pressed={filtro === c}
                  className={`shrink-0 rounded-full border px-4 py-2.5 font-display text-[11.5px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                    filtro === c
                      ? "border-blue bg-blue text-white"
                      : "border-line bg-white/[0.03] text-white/85 hover:border-blue/50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </Reveal>

        <div className="mt-10 grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[180px] lg:auto-rows-[110px] lg:grid-cols-12 lg:gap-3.5">
          {filtradas.map((foto, i) => (
            <Foto
              key={`${filtro}-${i}`}
              foto={foto}
              sizes="(max-width: 1023px) 46vw, 600px"
              className={`rounded-[20px] ${formatos[i % formatos.length]}`}
              onClick={foto.src ? () => setAberta(ampliaveis.indexOf(foto)) : undefined}
            />
          ))}
        </div>
        {ampliaveis.length > 0 && (
          <p className="mt-4 text-[13px] text-mute">Toque em uma foto para ampliar.</p>
        )}
      </Container>

      {aberta !== null && ampliaveis[aberta] && (
        <Ampliada fotos={ampliaveis} indice={aberta} onTrocar={setAberta} onFechar={() => setAberta(null)} />
      )}
    </section>
  );
}

/** Visualização ampliada, com setas, teclado e legenda. */
function Ampliada({ fotos, indice, onTrocar, onFechar }) {
  const fecharRef = useRef(null);
  const foto = fotos[indice];
  const anterior = () => onTrocar((indice - 1 + fotos.length) % fotos.length);
  const proxima = () => onTrocar((indice + 1) % fotos.length);

  useEffect(() => {
    const voltarFoco = document.activeElement;
    fecharRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      voltarFoco?.focus?.();
    };
  }, []);

  const teclado = (e) => {
    if (e.key === "Escape") onFechar();
    if (e.key === "ArrowLeft") anterior();
    if (e.key === "ArrowRight") proxima();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Foto ampliada"
      onKeyDown={teclado}
      onClick={(e) => e.target === e.currentTarget && onFechar()}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 bg-void/95 p-4 sm:p-10"
    >
      <button
        ref={fecharRef}
        type="button"
        onClick={onFechar}
        aria-label="Fechar"
        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-xl border border-line bg-panel text-white"
      >
        <X size={19} />
      </button>

      <img src={foto.src} alt={foto.alt} className="max-h-[78vh] max-w-full rounded-2xl object-contain" />
      {(foto.legenda || foto.categoria) && (
        <p className="max-w-[640px] text-center text-[14px] text-mute-soft">
          {foto.categoria && <span className="font-semibold text-white">{foto.categoria}</span>}
          {foto.categoria && foto.legenda && " · "}
          {foto.legenda}
        </p>
      )}

      {fotos.length > 1 && (
        <div className="flex items-center gap-3">
          <button type="button" onClick={anterior} aria-label="Foto anterior" className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-panel text-white">
            <ChevronLeft size={20} />
          </button>
          <span className="min-w-[64px] text-center text-[13px] text-mute">
            {indice + 1} / {fotos.length}
          </span>
          <button type="button" onClick={proxima} aria-label="Próxima foto" className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-panel text-white">
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
