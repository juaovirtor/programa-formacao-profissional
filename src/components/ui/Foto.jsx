import { mostrarEspacos } from "../../lib/espacos";

/**
 * Uma foto real do programa (ver src/data/fotos.js).
 *
 * Sem `src`, mostra um espaço marcado — só em desenvolvimento ou prévia.
 * No site publicado, a falta de foto não desenha nada.
 */
export default function Foto({ foto, className = "", sizes, priority = false, onClick }) {
  if (foto?.src) {
    const img = (
      <img
        src={foto.src}
        alt={foto.alt}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchpriority={priority ? "high" : undefined}
        decoding="async"
        className="h-full w-full object-cover"
      />
    );
    return (
      <div className={`overflow-hidden bg-panel-2 ${className}`}>
        {onClick ? (
          <button type="button" onClick={onClick} className="block h-full w-full" aria-label={`Ampliar: ${foto.alt}`}>
            {img}
          </button>
        ) : (
          img
        )}
      </div>
    );
  }

  if (!mostrarEspacos) return null;

  return (
    <div
      className={`grid place-items-center border border-dashed border-[#2a3b5a] bg-panel-2 p-4 text-center text-[12.5px] leading-snug text-mute ${className}`}
    >
      <span>
        [Foto real]
        <br />
        {foto?.descricao}
      </span>
    </div>
  );
}
