import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * Barra fixa inferior no mobile.
 * Aparece depois do hero e some quando o formulário está visível.
 * Entrada/saída por transição CSS (sempre determinística).
 */
export default function MobileCta({ onCta, hideWhenVisible = "#inscricao" }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const target = document.querySelector(hideWhenVisible);
      const pastHero = window.scrollY > window.innerHeight * 0.7;
      let formVisible = false;
      if (target) {
        const rect = target.getBoundingClientRect();
        formVisible = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
      }
      setShow(pastHero && !formVisible);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [hideWhenVisible]);

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line-soft bg-void/92 px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-3.5 backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <button
        onClick={onCta}
        tabIndex={show ? 0 : -1}
        className="btn-shine flex w-full items-center justify-center gap-2 rounded-full bg-lime py-4 font-display text-[14px] font-bold uppercase tracking-[0.08em] text-void shadow-[0_-6px_30px_-10px_rgba(200,245,50,0.5)]"
      >
        Quero me inscrever
        <ArrowRight size={17} strokeWidth={2.6} />
      </button>
    </div>
  );
}
