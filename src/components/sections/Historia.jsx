import Container from "../ui/Container";
import Reveal from "../ui/Reveal";
import Eyebrow from "../ui/Eyebrow";
import Foto from "../ui/Foto";
import { historia } from "../../data/program";
import { fotosHistoria } from "../../data/fotos";
import { fotosVisiveis } from "../../lib/espacos";

export default function Historia() {
  const fotos = fotosVisiveis(fotosHistoria);

  return (
    <section id="historia" className="secao-adiada scroll-mt-20 py-20 sm:py-28">
      <Container>
        <div className={`grid gap-12 ${fotos.length ? "lg:grid-cols-[1fr_1fr] lg:gap-16" : ""}`}>
          <Reveal className={fotos.length ? "" : "max-w-[760px]"}>
            <Eyebrow>Nossa história</Eyebrow>
            <h2 className="mt-5 font-display text-[29px] font-extrabold uppercase leading-[1.04] tracking-[-0.02em] sm:text-[40px] lg:text-[44px]">
              {historia.titulo} <span className="text-gradient-blue">{historia.destaque}</span>
            </h2>
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-mute-soft sm:text-[16.5px]">
              {historia.paragrafos.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>

          {fotos.length > 0 && (
            <Reveal delay={0.1} className="grid grid-cols-2 gap-3 sm:gap-4">
              {fotos.map((foto, i) => (
                <Foto
                  key={i}
                  foto={foto}
                  sizes="(max-width: 1023px) 46vw, 280px"
                  className={`aspect-[4/5] rounded-[22px] ${i === 1 ? "mt-10 sm:mt-14" : ""}`}
                />
              ))}
            </Reveal>
          )}
        </div>

        <Reveal delay={0.05}>
          <ol className="mt-14 grid gap-6 border-t border-line pt-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {historia.marcos.map((marco) => (
              <li key={marco.titulo} className="flex flex-col gap-2">
                {/* Sem data informada, o marco aparece sem data — nunca com uma inventada. */}
                {marco.data && (
                  <span
                    className={`font-display text-[12px] font-bold uppercase tracking-[0.14em] ${
                      marco.data === "Agora" ? "text-lime" : "text-blue"
                    }`}
                  >
                    {marco.data}
                  </span>
                )}
                <span className="font-display text-[15px] font-bold uppercase text-white">{marco.titulo}</span>
                <span className="text-[14px] leading-relaxed text-mute">{marco.texto}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </section>
  );
}
