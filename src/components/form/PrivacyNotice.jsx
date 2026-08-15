import { useCallback, useEffect, useState } from "react";
import { ShieldCheck, X } from "lucide-react";
import { privacidade } from "../../data/program";

/** Aviso de Privacidade completo (LGPD), em modal. */
export default function PrivacyNotice({ open, onClose }) {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => setVisivel(true));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  const fechar = useCallback(() => {
    setVisivel(false);
    window.setTimeout(onClose, 220);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && fechar();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, fechar]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacidade-titulo"
      onClick={fechar}
      className={`fixed inset-0 z-[70] flex items-end justify-center bg-void/85 backdrop-blur-md transition-opacity duration-250 sm:items-center sm:p-6 ${
        visivel ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`edge relative flex max-h-[88vh] w-full max-w-[620px] flex-col overflow-hidden rounded-t-3xl border border-line bg-gradient-to-b from-panel to-void transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] sm:max-h-[85vh] sm:rounded-3xl ${
          visivel ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <header className="flex items-start gap-3 border-b border-line px-5 py-5 sm:px-7">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-lime/40 bg-lime/10">
            <ShieldCheck size={18} strokeWidth={2} className="text-lime" />
          </span>
          <div className="min-w-0 flex-1">
            <h3
              id="privacidade-titulo"
              className="font-display text-[17px] font-bold uppercase tracking-tight text-white sm:text-[19px]"
            >
              Aviso de Privacidade
            </h3>
            <p className="mt-1 text-[12.5px] text-mute">
              Programa de Formação Profissional · Atualizado em {privacidade.atualizadoEm}
            </p>
          </div>
          <button
            onClick={fechar}
            aria-label="Fechar"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line text-mute transition-colors hover:border-blue/50 hover:text-white"
          >
            <X size={16} />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6 pb-[max(24px,env(safe-area-inset-bottom))] sm:px-7">
          {privacidade.blocos.map((bloco) => (
            <section key={bloco.titulo}>
              <h4 className="font-display text-[11.5px] font-semibold uppercase tracking-[0.14em] text-blue-soft">
                {bloco.titulo}
              </h4>
              <p className="mt-2 text-[14px] leading-relaxed text-mute-soft">{bloco.texto}</p>
            </section>
          ))}
        </div>

        <footer className="border-t border-line px-5 py-4 sm:px-7">
          <button
            onClick={fechar}
            className="w-full rounded-full bg-lime py-3.5 font-display text-[13px] font-bold uppercase tracking-[0.08em] text-void transition-colors hover:bg-lime-soft"
          >
            Entendi
          </button>
        </footer>
      </div>
    </div>
  );
}
