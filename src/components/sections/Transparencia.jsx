import { Download, ExternalLink, FileText } from "lucide-react";
import Container from "../ui/Container";
import Reveal from "../ui/Reveal";
import Eyebrow from "../ui/Eyebrow";
import { transparencia } from "../../data/program";
import { mostrarEspacos } from "../../lib/espacos";

export default function Transparencia() {
  const { termo } = transparencia;
  const termoNoAr = termo.publicado && termo.arquivo;

  return (
    <section id="transparencia" className="secao-adiada scroll-mt-20 border-t border-line bg-panel py-20 sm:py-28">
      <Container>
        <Reveal className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-14">
          <div>
            <Eyebrow>Transparência</Eyebrow>
            <h2 className="mt-5 font-display text-[28px] font-extrabold uppercase leading-[1.04] tracking-[-0.02em] sm:text-[38px] lg:text-[42px]">
              Transparência e compromisso <span className="text-gradient-blue">institucional.</span>
            </h2>
          </div>
          <p className="text-[15px] leading-relaxed text-mute-soft sm:text-[16px]">{transparencia.texto}</p>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {transparencia.organizacoes.map((org, i) => (
            <Reveal key={org.papel} delay={i * 0.06}>
              <div className="flex h-full flex-col gap-4 rounded-[22px] border border-line bg-void p-6 sm:p-7">
                <p className="font-display text-[10.5px] font-bold uppercase tracking-[0.18em] text-blue-soft">{org.papel}</p>
                {org.logo ? (
                  <img src={org.logo} alt={org.nome} className="h-8 w-auto self-start" loading="lazy" />
                ) : (
                  <p className="font-display text-[17px] font-bold uppercase text-white">{org.nome}</p>
                )}
                <p className="text-[14.5px] leading-relaxed text-mute-soft">{org.texto}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* O termo só aparece depois de autorizado (transparencia.termo.publicado). */}
        {termoNoAr ? (
          <div className="mt-8 flex flex-col gap-3 border-t border-line pt-7 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href={termo.arquivo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-blue px-6 py-4 font-display text-[13.5px] font-semibold text-white transition-colors hover:bg-blue/10"
            >
              <FileText size={16} className="text-blue" />
              Consultar termo de parceria institucional
            </a>
            <a href={termo.arquivo} download className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[13.5px] text-mute-soft hover:text-white">
              <Download size={15} /> Baixar PDF
            </a>
            <a href={termo.arquivo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[13.5px] text-mute-soft hover:text-white">
              <ExternalLink size={15} /> Abrir em nova aba
            </a>
          </div>
        ) : (
          mostrarEspacos && (
            <p className="mt-8 rounded-2xl border border-dashed border-[#2a3b5a] p-4 text-[13.5px] text-mute">
              [Botão “Consultar termo de parceria institucional” — aparece só depois que o PDF oficial for enviado e a publicação for autorizada]
            </p>
          )
        )}
      </Container>
    </section>
  );
}
