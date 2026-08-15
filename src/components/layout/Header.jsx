import { useEffect, useState } from "react";
import { CircleUserRound, Menu, X } from "lucide-react";
import Container from "../ui/Container";
import { nav } from "../../data/program";

export default function Header({ onCta }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Só mexe no scroll enquanto o menu está aberto — escrever "" com o menu
  // fechado destravaria a rolagem de quem travou antes (a abertura da marca).
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (href) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line-soft bg-void/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Container className="flex h-[68px] items-center justify-between gap-4 sm:h-[76px]">
        {/* LOGO DO GRUPO — /public/assets/logo-grupo-phoenix.png */}
        <a href="#topo" className="flex shrink-0 items-center" aria-label="Group Phoenix — página inicial">
          <img
            src="/assets/logo-grupo-phoenix.png"
            alt="Group Phoenix"
            className="h-7 w-auto sm:h-8"
            width="121"
            height="32"
          />
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <button
              key={item.href}
              onClick={() => go(item.href)}
              className="group relative text-[13.5px] font-medium text-mute-soft transition-colors hover:text-white"
            >
              {item.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gradient-to-r from-blue to-violet transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Acesso da equipe ao painel de inscrições — discreto, de propósito. */}
          <a
            href="/admin"
            title="Acesso da equipe"
            aria-label="Acesso da equipe"
            className="grid h-11 w-11 place-items-center rounded-xl border border-transparent text-mute/60 transition-colors hover:border-line hover:bg-white/[0.03] hover:text-mute-soft"
          >
            <CircleUserRound size={19} strokeWidth={1.8} />
          </a>

          <button
            onClick={onCta}
            className="btn-shine hidden rounded-full bg-gradient-to-r from-blue-deep via-blue to-violet px-5 py-2.5 font-display text-[12.5px] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_12px_34px_-14px_rgba(43,140,255,0.9)] transition-transform duration-300 hover:-translate-y-0.5 sm:inline-flex"
          >
            Quero me inscrever
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-white/[0.03] text-white transition-colors hover:border-blue/50 lg:hidden"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </Container>

      <div
        className={`overflow-hidden border-t bg-deep/97 backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
          open ? "max-h-[360px] border-line-soft opacity-100" : "max-h-0 border-transparent opacity-0"
        }`}
      >
        <div>
          <Container className="flex flex-col gap-1 py-4">
            {nav.map((item) => (
              <button
                key={item.href}
                tabIndex={open ? 0 : -1}
                onClick={() => go(item.href)}
                className="rounded-xl px-3 py-3.5 text-left text-[15px] font-medium text-mute-soft transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                {item.label}
              </button>
            ))}
            <button
              tabIndex={open ? 0 : -1}
              onClick={() => {
                setOpen(false);
                onCta();
              }}
              className="mt-2 rounded-full bg-lime px-6 py-4 text-center font-display text-[13px] font-bold uppercase tracking-[0.1em] text-void"
            >
              Quero me inscrever
            </button>
          </Container>
        </div>
      </div>
    </header>
  );
}
