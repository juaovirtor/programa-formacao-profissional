import Container from "../ui/Container";
import Reveal from "../ui/Reveal";
import Eyebrow from "../ui/Eyebrow";
import { experiencia, marca } from "../../data/program";

export default function Experience() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(43,140,255,0.12),transparent_65%)]" />
        <div className="tech-grid absolute inset-0 opacity-25" />
      </div>

      <Container>
        <Reveal className="mx-auto max-w-[720px] text-center">
          <Eyebrow>Quem realiza</Eyebrow>
          <h2 className="mt-5 font-display text-[29px] font-extrabold uppercase leading-[1.05] tracking-[-0.02em] sm:text-[40px] lg:text-[44px]">
            Você aprende com quem já está no{" "}
            <span className="text-gradient-blue">mercado</span>.
          </h2>
          <p className="mx-auto mt-5 max-w-[600px] text-[15px] leading-relaxed text-mute-soft sm:text-[16.5px]">
            {experiencia.texto}
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-12 sm:mt-16">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
            {experiencia.numeros.map((item) => (
              <div
                key={item.label}
                className="group relative bg-void px-4 py-7 text-center transition-colors duration-300 hover:bg-panel sm:px-6 sm:py-9"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <p className="font-display text-[28px] font-extrabold uppercase leading-none tracking-[-0.02em] text-lime sm:text-[38px] lg:text-[42px]">
                  {item.valor}
                </p>
                {item.unidade && (
                  <p className="mt-1.5 font-display text-[12.5px] font-bold uppercase tracking-[0.1em] text-white sm:text-[14px]">
                    {item.unidade}
                  </p>
                )}
                <p className="mt-2 text-[12.5px] leading-snug text-mute sm:text-[13.5px]">{item.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.14} className="mx-auto mt-6 max-w-[760px]">
          <p className="rounded-xl border border-line bg-white/[0.02] px-5 py-4 text-center text-[12.5px] leading-relaxed text-mute sm:text-[13.5px]">
            {marca.descricaoRevenda}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
