import { useCallback, useEffect, useState } from "react";
import { Instagram, MessageCircle, X } from "lucide-react";
import { contact, marca } from "../../data/program";

/**
 * Modal de sucesso.
 * A entrada/saída é controlada por estado local + transição CSS, para que o
 * fechamento seja sempre determinístico (sem depender de animação de saída).
 */
export default function SuccessModal({ open, protocolo, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  const close = useCallback(() => {
    setVisible(false);
    window.setTimeout(onClose, 240);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sucesso-titulo"
      onClick={close}
      className={`fixed inset-0 z-[60] flex items-end justify-center bg-void/85 backdrop-blur-md transition-opacity duration-250 sm:items-center sm:p-6 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`edge edge-lime relative w-full max-w-[520px] overflow-hidden rounded-t-3xl border border-line bg-gradient-to-b from-panel to-void px-6 pb-[max(28px,env(safe-area-inset-bottom))] pt-10 text-center transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] sm:rounded-3xl sm:px-10 sm:pb-10 sm:pt-12 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute -top-16 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-lime/18 blur-[40px] sm:blur-[90px]" />
          <div className="tech-grid absolute inset-0 opacity-25" />
        </div>

        <button
          onClick={close}
          aria-label="Fechar"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-lg border border-line text-mute transition-colors hover:border-blue/50 hover:text-white"
        >
          <X size={16} />
        </button>

        {/* Animação de sucesso */}
        <div className="relative mx-auto grid h-20 w-20 place-items-center">
          <span aria-hidden className="halo absolute inset-0 rounded-full border-2 border-lime/60" />
          <div className="ring-pop grid h-20 w-20 place-items-center rounded-full border-2 border-lime bg-lime/10">
            <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none">
              <path
                d="M4.5 12.5l5 5 10-11"
                stroke="#c8f532"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="draw-check"
              />
            </svg>
          </div>
        </div>

        <h3
          id="sucesso-titulo"
          className="mt-7 font-display text-[26px] font-extrabold uppercase leading-[1.05] tracking-[-0.02em] sm:text-[32px]"
        >
          Inscrição <span className="text-lime">recebida!</span>
        </h3>

        <p className="mt-4 font-display text-[16px] font-semibold text-white sm:text-[17.5px]">
          Você acabou de dar o primeiro passo.
        </p>
        <p className="mx-auto mt-3 max-w-[380px] text-[14px] leading-relaxed text-mute-soft">
          Recebemos seus dados para o Programa de Formação Profissional da {marca.empresa}.
        </p>

        {protocolo && (
          <div className="mt-6 inline-flex items-center gap-2.5 rounded-xl border border-line bg-void/70 px-4 py-2.5">
            <span className="font-display text-[10.5px] font-semibold uppercase tracking-[0.18em] text-mute">
              Protocolo
            </span>
            <span className="font-display text-[14px] font-bold tracking-wide text-blue-soft">
              {protocolo}
            </span>
          </div>
        )}

        <p className="mx-auto mt-6 max-w-[400px] rounded-xl border border-line bg-white/[0.02] px-4 py-3.5 text-[13px] leading-relaxed text-mute-soft">
          Agora é só acompanhar seus canais de contato. Em breve, teremos novidades.
        </p>


        <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <a
            href={contact.instagramHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white/[0.03] px-5 py-3 text-[13px] font-medium text-white transition-colors hover:border-violet/50 hover:bg-violet/10"
          >
            <Instagram size={15} strokeWidth={2} className="text-violet" />
            Seguir no Instagram
          </a>
          <a
            href={contact.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white/[0.03] px-5 py-3 text-[13px] font-medium text-white transition-colors hover:border-lime/50 hover:bg-lime/10"
          >
            <MessageCircle size={15} strokeWidth={2} className="text-lime" />
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
