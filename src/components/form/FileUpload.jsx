import { useEffect, useRef, useState } from "react";
import { Camera, Check, FileText, Loader2, Trash2, Upload, Wand2 } from "lucide-react";
import { formatFileSize } from "../../lib/validation";

/**
 * Upload com clique ou arrastar-e-soltar.
 * variant="photo"  → mostra preview circular da imagem
 * variant="pdf"    → mostra nome e tamanho do arquivo
 *
 * `processar` (opcional): função assíncrona que recebe o arquivo escolhido e
 * devolve `{ file, info }`. É por aqui que a foto do candidato é otimizada no
 * navegador antes de virar estado do formulário — quem sobe é sempre o
 * arquivo devolvido, nunca o original.
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
  processar,
  aoProcessar,
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [processando, setProcessando] = useState(false);
  const [info, setInfo] = useState(null);
  // Sequência: se a pessoa trocar de foto no meio do processamento, o
  // resultado da anterior é descartado em vez de sobrescrever o mais novo.
  const sequencia = useRef(0);

  useEffect(() => {
    if (variant !== "photo" || !file || !file.type?.startsWith("image/")) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file, variant]);

  const pick = async (selected) => {
    if (!selected) return;

    if (!processar) {
      onSelect(selected);
      return;
    }

    const meu = (sequencia.current += 1);
    setProcessando(true);
    setInfo(null);
    aoProcessar?.({ processando: true, erro: "" });

    try {
      const { file: pronto, info: resumo } = await processar(selected);
      if (meu !== sequencia.current) return; // chegou atrasado: ignora
      setInfo(resumo);
      onSelect(pronto);
      aoProcessar?.({ processando: false, erro: "" });
    } catch (err) {
      if (meu !== sequencia.current) return;
      setInfo(null);
      onSelect(null);
      aoProcessar?.({ processando: false, erro: err.message });
    } finally {
      if (meu === sequencia.current) setProcessando(false);
    }
  };

  const clear = (e) => {
    e.stopPropagation();
    sequencia.current += 1;
    setProcessando(false);
    setInfo(null);
    onSelect(null);
    aoProcessar?.({ processando: false, erro: "" });
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
        aria-busy={processando}
        onClick={() => !processando && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (processando) return;
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
          {processando ? (
            <Loader2 size={20} strokeWidth={2.2} className="animate-spin text-blue" />
          ) : preview ? (
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
          {processando ? (
            <>
              <p className="flex items-center gap-1.5 font-display text-[13.5px] font-semibold text-blue-soft">
                <Wand2 size={14} strokeWidth={2.4} />
                Otimizando sua foto...
              </p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-mute">
                Reduzindo o tamanho para o envio ficar rápido. Leva só um instante.
              </p>
            </>
          ) : filled ? (
            <>
              <p className="flex items-center gap-1.5 font-display text-[13.5px] font-semibold text-lime">
                <Check size={14} strokeWidth={3} />
                Arquivo selecionado
              </p>
              <p className="mt-1 truncate text-[13px] text-white/90">{file.name}</p>
              <p className="mt-0.5 text-[11.5px] text-mute">
                {formatFileSize(file.size)} · toque para trocar
              </p>
              {info?.otimizada && (
                <p className="mt-1 flex flex-wrap items-center gap-1 text-[11.5px] text-blue-soft">
                  <Wand2 size={12} strokeWidth={2.4} className="shrink-0" />
                  Otimizada: {formatFileSize(info.tamanhoOriginal)} → {formatFileSize(info.tamanhoFinal)}
                  <span className="text-mute">
                    ({info.largura}×{info.altura}px)
                  </span>
                </p>
              )}
            </>
          ) : (
            <>
              <p className="font-display text-[13.5px] font-semibold text-white">{title}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-mute">{subtitle}</p>
            </>
          )}
        </div>

        {filled && !processando && (
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
