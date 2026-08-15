import { useEffect, useRef, useState } from "react";
import { Camera, Check, FileText, Trash2, Upload } from "lucide-react";
import { formatFileSize } from "../../lib/validation";

/**
 * Upload com clique ou arrastar-e-soltar.
 * variant="photo"  → mostra preview circular da imagem
 * variant="pdf"    → mostra nome e tamanho do arquivo
 */
export default function FileUpload({
  id,
  variant = "pdf",
  accept,
  file,
  error,
  onSelect,
  title,
  subtitle,
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (variant !== "photo" || !file || !file.type?.startsWith("image/")) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file, variant]);

  const pick = (selected) => {
    if (selected) onSelect(selected);
  };

  const clear = (e) => {
    e.stopPropagation();
    onSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const filled = Boolean(file);

  return (
    <div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => pick(e.target.files?.[0] ?? null)}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pick(e.dataTransfer.files?.[0] ?? null);
        }}
        className={`group flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed p-4 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue sm:p-5 ${
          error
            ? "border-red-400/70 bg-red-500/5"
            : filled
              ? "border-lime/50 bg-lime/[0.06]"
              : dragging
                ? "border-blue bg-blue/10"
                : "border-line bg-void/60 hover:border-blue/55 hover:bg-blue/[0.05]"
        }`}
      >
        {/* Miniatura / ícone */}
        <div
          className={`grid shrink-0 place-items-center overflow-hidden transition-transform duration-300 group-hover:scale-105 ${
            variant === "photo"
              ? "h-16 w-16 rounded-full border-2"
              : "h-14 w-14 rounded-xl border"
          } ${filled ? "border-lime/60 bg-lime/10" : "border-line bg-white/[0.03]"}`}
        >
          {preview ? (
            <img src={preview} alt="Pré-visualização da foto" className="h-full w-full object-cover" />
          ) : variant === "photo" ? (
            <Camera size={20} strokeWidth={1.9} className={filled ? "text-lime" : "text-blue"} />
          ) : filled ? (
            <FileText size={20} strokeWidth={1.9} className="text-lime" />
          ) : (
            <Upload size={20} strokeWidth={1.9} className="text-blue" />
          )}
        </div>

        {/* Texto */}
        <div className="min-w-0 flex-1">
          {filled ? (
            <>
              <p className="flex items-center gap-1.5 font-display text-[13.5px] font-semibold text-lime">
                <Check size={14} strokeWidth={3} />
                Arquivo selecionado
              </p>
              <p className="mt-1 truncate text-[13px] text-white/90">{file.name}</p>
              <p className="mt-0.5 text-[11.5px] text-mute">{formatFileSize(file.size)} · toque para trocar</p>
            </>
          ) : (
            <>
              <p className="font-display text-[13.5px] font-semibold text-white">{title}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-mute">{subtitle}</p>
            </>
          )}
        </div>

        {filled && (
          <button
            type="button"
            onClick={clear}
            aria-label="Remover arquivo"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line text-mute transition-colors hover:border-red-400/60 hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 size={15} strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  );
}
