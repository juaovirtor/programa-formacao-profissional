import Container from "../ui/Container";
import Reveal from "../ui/Reveal";
import Eyebrow from "../ui/Eyebrow";
import Icon from "../ui/Icon";
import Particles from "../ui/Particles";
import { softSkills } from "../../data/program";

export default function BeyondTech() {
  return (
    <section className="secao-adiada relative overflow-hidden py-20 sm:py-28">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_80%_20%,rgba(139,92,246,0.16),transparent_60%),radial-gradient(70%_60%_at_10%_80%,rgba(43,140,255,0.14),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue/45 to-transparent" />
        <Particles count={12} />
      </div>

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <Reveal>
            <Eyebrow tone="violet">Muito mais que tecnologia</Eyebrow>
            <h2 className="mt-5 font-display text-[29px] font-extrabold uppercase leading-[1.05] tracking-[-0.02em] sm:text-[40px] lg:text-[44px]">
              Tecnologia é só uma parte da{" "}
              <span className="text-lime">jornada</span>.
            </h2>
            <p className="mt-5 max-w-[520px] text-[15px] leading-relaxed text-mute-soft sm:text-[16.5px]">
              A formação vai além do conteúdo técnico. Você desenvolve o comportamento profissional que as
              empresas esperam de quem está começando.
            </p>

            <div className="mt-7 rounded-2xl border-l-2 border-lime bg-gradient-to-r from-lime/10 to-transparent py-4 pl-5 pr-4">
              <p className="font-display text-[15.5px] font-semibold leading-snug text-white sm:text-[17px]">
                “Queremos preparar você para situações reais do mercado de trabalho.”
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            {/*
              Uma coluna no celular. Em duas colunas sobram só 54px de largura
              para o texto a 320px (e 109px a 430px), enquanto "Responsabilidade"
              mede 110px — a palavra não cabe em nenhuma largura de celular e
              vazava do card. A partir de sm a grade volta a ter duas colunas.
            */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5">
              {softSkills.map((skill, i) => (
                <div
                  key={skill.label}
                  className="edge group flex items-center gap-3 rounded-xl border border-line bg-panel/60 px-4 py-4 transition-all duration-300 hover:-translate-y-1 hover:border-violet/40 hover:bg-panel sm:px-5"
                  style={{ transitionDelay: `${(i % 4) * 20}ms` }}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-white/[0.03] transition-colors duration-300 group-hover:border-violet/40 group-hover:bg-violet/12">
                    <Icon
                      name={skill.icon}
                      size={16}
                      strokeWidth={2}
                      className="text-blue-soft transition-colors duration-300 group-hover:text-violet"
                    />
                  </span>
                  {/*
                    min-w-0: sem isto o item flex nunca encolhe abaixo da largura
                    da própria palavra, então o texto escapa do card em vez de
                    se ajustar a ele.
                  */}
                  <span className="min-w-0 text-[13px] font-medium leading-tight text-white/90 sm:text-[14px]">
                    {skill.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
