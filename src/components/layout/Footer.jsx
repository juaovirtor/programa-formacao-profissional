import { useState } from "react";
import { Instagram, MessageCircle, ShieldCheck } from "lucide-react";
import Container from "../ui/Container";
import PrivacyNotice from "../form/PrivacyNotice";
import { contact, marca, nav } from "../../data/program";

export default function Footer() {
  const [avisoAberto, setAvisoAberto] = useState(false);

  return (
    // padding inferior extra no mobile por causa da barra fixa de inscrição
    <footer className="relative border-t border-line-soft bg-deep/50 pb-[calc(96px+env(safe-area-inset-bottom))] pt-14 lg:pb-8">
      <Container>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-[340px]">
            {/* LOGO DO GRUPO — /public/assets/logo-grupo-phoenix.webp */}
            <img
              src="/assets/logo-grupo-phoenix.webp"
              alt="Group Phoenix"
              className="h-8 w-auto"
              width="121"
              height="32"
            />
            <p className="mt-5 text-[13.5px] leading-relaxed text-mute">
              Programa de Formação Profissional — uma iniciativa da {marca.empresa}, empresa do{" "}
              {marca.grupo}, para preparar os jovens de Reserva · PR para o mercado de trabalho.
            </p>

            {/* LOGO DA INICIATIVA — /public/assets/logo-visual-software.webp */}
            <div className="mt-6 border-t border-line-soft pt-5">
              <p className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-mute">
                Uma iniciativa
              </p>
              <img
                src="/assets/logo-visual-software.webp"
                alt={marca.empresa}
                className="mt-3 h-8 w-auto"
                width="141"
                height="32"
              />
              <p className="mt-2.5 text-[12px] leading-relaxed text-mute/80">{marca.descricaoRevenda}</p>
            </div>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
            <div>
              <p className="font-display text-[10.5px] font-semibold uppercase tracking-[0.2em] text-mute">
                Navegação
              </p>
              <ul className="mt-3 space-y-1">
                {nav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="inline-block py-2 text-[13.5px] text-mute-soft transition-colors hover:text-white"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-display text-[10.5px] font-semibold uppercase tracking-[0.2em] text-mute">
                Dúvidas? Fale conosco
              </p>
              <ul className="mt-3 space-y-1">
                <li>
                  <a
                    href={contact.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 py-2 text-[13.5px] text-mute-soft transition-colors hover:text-white"
                  >
                    <MessageCircle size={16} strokeWidth={2} className="text-lime" />
                    {contact.whatsapp}
                  </a>
                </li>
                <li>
                  <a
                    href={contact.instagramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 py-2 text-[13.5px] text-mute-soft transition-colors hover:text-white"
                  >
                    <Instagram size={16} strokeWidth={2} className="text-violet" />
                    {contact.instagram}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Privacidade */}
        <div className="mt-10 flex flex-col items-center gap-3 border-t border-line-soft pt-7 sm:flex-row sm:items-start sm:justify-between">
          <p className="flex items-start gap-2 text-center text-[12.5px] leading-relaxed text-mute sm:max-w-[520px] sm:text-left">
            <ShieldCheck size={14} strokeWidth={2} className="mt-0.5 hidden shrink-0 text-lime sm:block" />
            Os dados enviados na inscrição são usados apenas para avaliar e selecionar os participantes
            deste programa. Não são vendidos, compartilhados nem reproduzidos.
          </p>
          <button
            onClick={() => setAvisoAberto(true)}
            className="shrink-0 rounded-full border border-line px-4 py-2.5 text-[12.5px] font-medium text-mute-soft transition-colors hover:border-lime/50 hover:bg-lime/10 hover:text-white"
          >
            Aviso de Privacidade
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 border-t border-line-soft pt-7 sm:flex-row sm:justify-between">
          <p className="text-center text-[12px] text-mute sm:text-left">
            © {new Date().getFullYear()} {marca.grupo}. Todos os direitos reservados.
          </p>
          <p className="text-center text-[12px] text-mute/70 sm:text-right">
            {marca.empresa} · Reserva · PR
          </p>
        </div>

        <p className="mt-5 text-center text-[11px] text-mute/45">
          Desenvolvido por João Vitor Ribas
        </p>
      </Container>

      <PrivacyNotice open={avisoAberto} onClose={() => setAvisoAberto(false)} />
    </footer>
  );
}
