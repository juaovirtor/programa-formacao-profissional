import { useEffect, useRef, useState } from "react";
import { AlertCircle, Loader2, Trash2, X } from "lucide-react";
import { excluirInscricao } from "../lib/adminApi";

/**
 * Confirmação da exclusão lógica.
 *
 * O motivo é obrigatório: sem ele o botão não envia, e a API também recusa.
 * É esse texto que fica guardado como histórico da exclusão.
 */
export default function DeleteModal({ candidato, onCancelar, onExcluida }) {
  const [motivo, setMotivo] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const campoRef = useRef(null);

  useEffect(() => {
    campoRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onCancelar();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancelar]);

  const valido = motivo.trim().length >= 3;

  const confirmar = async (e) => {
    e.preventDefault();
    if (!valido || enviando) return;
    setEnviando(true);
    setErro("");
    try {
      onExcluida(await excluirInscricao(candidato.id, motivo.trim()));
    } catch (err) {
      setErro(err.message);
      setEnviando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-void/85 px-5 py-8 backdrop-blur-sm"
      onClick={onCancelar}
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-exclusao"
    >
      <form
        onSubmit={confirmar}
        onClick={(e) => e.stopPropagation()}
        className="edge max-h-full w-full max-w-[460px] overflow-y-auto rounded-3xl border border-line bg-panel p-6 sm:p-7"
      >
        <div className="flex items-start gap-3.5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-red-400/40 bg-red-500/10">
            <Trash2 size={18} className="text-red-400" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="titulo-exclusao" className="font-display text-[17px] font-bold leading-tight text-white">
              Excluir inscrição
            </h2>
            <p className="mt-1 truncate text-[13px] text-mute">
              {candidato.nome} · {candidato.protocolo}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancelar}
            aria-label="Cancelar"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line text-mute transition-colors hover:border-blue/50 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <p className="mt-5 rounded-xl border border-line bg-void/60 px-4 py-3 text-[12.5px] leading-relaxed text-mute-soft">
          A inscrição sai da lista ativa, mas <strong className="text-white">nada é apagado</strong>: os
          dados do candidato, a foto e o currículo continuam guardados e podem ser consultados no
          filtro <strong className="text-white">Excluídas</strong>.
        </p>

        <label
          htmlFor="motivo-exclusao"
          className="mt-5 mb-2 block font-display text-[12px] font-semibold uppercase tracking-[0.12em] text-mute-soft"
        >
          Motivo da exclusão <span className="text-red-400">*</span>
        </label>
        <textarea
          id="motivo-exclusao"
          ref={campoRef}
          rows={3}
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          maxLength={500}
          placeholder="Ex.: inscrição duplicada, enviada por engano, candidato desistiu..."
          className={`field resize-none ${erro ? "field-error" : ""}`}
        />
        <p className="mt-1.5 text-[11.5px] text-mute">
          Obrigatório — fica registrado no histórico. {motivo.trim().length}/500
        </p>

        {erro && (
          <p className="mt-3 flex items-start gap-1.5 text-[12.5px] font-medium text-red-400">
            <AlertCircle size={14} strokeWidth={2.4} className="mt-0.5 shrink-0" />
            {erro}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-full border border-line px-5 py-3 font-display text-[12.5px] font-semibold text-mute-soft transition-colors hover:border-blue/40 hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!valido || enviando}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-red-400/50 bg-red-500/15 px-5 py-3 font-display text-[12.5px] font-bold text-red-300 transition-colors hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-red-500/15"
          >
            {enviando ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Excluindo...
              </>
            ) : (
              <>
                <Trash2 size={14} />
                Confirmar exclusão
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
