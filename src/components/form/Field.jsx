import { AlertCircle } from "lucide-react";

/** Wrapper de campo com rótulo, marcação de obrigatório e mensagem de erro. */
export default function Field({ label, htmlFor, error, hint, required = true, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 flex items-baseline gap-1.5 font-display text-[12px] font-semibold uppercase tracking-[0.12em] text-mute-soft"
      >
        {label}
        {required && <span className="text-lime">*</span>}
      </label>

      {children}

      {error ? (
        <p className="mt-2 flex items-center gap-1.5 text-[12.5px] font-medium text-red-400">
          <AlertCircle size={14} strokeWidth={2.4} className="shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p className="mt-2 text-[12px] text-mute">{hint}</p>
      ) : null}
    </div>
  );
}
