import Container from "../ui/Container";
import Reveal from "../ui/Reveal";
import Eyebrow from "../ui/Eyebrow";
import Foto from "../ui/Foto";
import { turmas } from "../../data/program";
import { fotosTurmas } from "../../data/fotos";
import { fotosVisiveis, mostrarEspacos } from "../../lib/espacos";

export default function Turmas() {
  const principal = fotosVisiveis([fotosTurmas.principal])[0];
  const extras = fotosVisiveis(fotosTurmas.extras);
  const depoimentos = turmas.depoimentos;

  return (
    // A âncora "Nossas turmas" do menu aponta para cá (esta seção sempre existe;
    // a galeria só aparece quando há fotos).
    <section id="turma" className="secao-adiada scroll-mt-20 py-20 sm:py-28">
      <Container>
        <div className={`grid items-center gap-10 ${principal ? "lg:grid-cols-[1.25fr_1fr] lg:gap-14" : ""}`}>
          {principal && (
            <Reveal>
              <Foto foto={principal} sizes="(max-width: 1023px) 92vw, 640px" className="aspect-[4/3.4] rounded-[26px]" />
            </Reveal>
          )}

          <Reveal delay={0.08} className={principal ? "" : "max-w-[720px]"}>
            <Eyebrow tone="lime">Nossas turmas</Eyebrow>
            <h2 className="mt-5 font-display text-[28px] font-extrabold uppercase leading-[1.04] tracking-[-0.02em] sm:text-[38px] lg:text-[42px]">
              {turmas.titulo} <span className="text-gradient-blue">{turmas.destaque}</span>
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-mute-soft sm:text-[16.5px]">{turmas.texto}</p>

            {extras.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-3">
                {extras.map((foto, i) => (
                  <Foto key={i} foto={foto} sizes="(max-width: 1023px) 45vw, 230px" className="aspect-[4/3] rounded-2xl" />
                ))}
              </div>
            )}

            {depoimentos.map((d) => (
              <blockquote key={d.nome} className="mt-6 rounded-2xl border-l-2 border-lime bg-lime/[0.06] py-4 pl-5 pr-4">
                <p className="text-[15px] leading-relaxed text-white">“{d.texto}”</p>
                <footer className="mt-2 text-[13px] text-mute">
                  {d.nome}
                  {d.papel ? ` · ${d.papel}` : ""}
                </footer>
              </blockquote>
            ))}
            {depoimentos.length === 0 && mostrarEspacos && (
              <p className="mt-6 rounded-2xl border border-dashed border-[#2a3b5a] p-4 text-[13.5px] text-mute">
                [Espaço para depoimento real de participante — só com autorização]
              </p>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
