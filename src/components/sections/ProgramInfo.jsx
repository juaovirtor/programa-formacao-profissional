import Container from "../ui/Container";
import Reveal from "../ui/Reveal";
import Eyebrow from "../ui/Eyebrow";
import Icon from "../ui/Icon";
import { marca, programInfo } from "../../data/program";

export default function ProgramInfo() {
  return (
    <section className="secao-adiada relative overflow-hidden py-20 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-[720px] text-center">
          <Eyebrow>Informações do programa</Eyebrow>
          <h2 className="mt-5 font-display text-[30px] font-extrabold uppercase leading-[1.03] tracking-[-0.02em] sm:text-[42px] lg:text-[46px]">
            Tudo o que você precisa <span className="text-gradient-blue">saber</span>.
          </h2>
        </Reveal>

        <Reveal delay={0.08} className="mt-12 sm:mt-16">
          <div className="edge relative overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-panel/90 to-void p-4 sm:p-6">
            {/* Barra superior estilo painel */}
            <div className="mb-4 flex items-center gap-2 px-2 pt-1 sm:mb-6">
              <span className="h-2 w-2 rounded-full bg-lime" />
              <span className="h-2 w-2 rounded-full bg-blue" />
              <span className="h-2 w-2 rounded-full bg-violet" />
              <span className="ml-2 font-display text-[10.5px] font-semibold uppercase tracking-[0.2em] text-mute">
                Programa de Formação · {marca.grupo}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {programInfo.map((info) => (
                <div
                  key={info.label}
                  className={`group relative overflow-hidden rounded-2xl border border-line bg-void/70 p-5 transition-colors duration-300 hover:border-blue/40 ${
                    info.wide ? "sm:col-span-2 lg:col-span-3" : ""
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      name={info.icon}
                      size={15}
                      strokeWidth={2.1}
                      className={info.accent ? "text-lime" : "text-blue"}
                    />
                    <p className="font-display text-[10.5px] font-semibold uppercase tracking-[0.18em] text-mute">
                      {info.label}
                    </p>
                  </div>
                  <p
                    className={`mt-2.5 font-display font-bold leading-tight tracking-tight ${
                      info.wide
                        ? "text-[15px] text-white sm:text-[16px]"
                        : info.accent
                          ? "text-[26px] text-lime sm:text-[30px]"
                          : "text-[22px] text-white sm:text-[26px]"
                    }`}
                  >
                    {info.value}
                  </p>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-px w-0 bg-gradient-to-r from-blue to-violet transition-all duration-500 group-hover:w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
