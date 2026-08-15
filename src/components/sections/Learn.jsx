import Container from "../ui/Container";
import Reveal from "../ui/Reveal";
import Eyebrow from "../ui/Eyebrow";
import Icon from "../ui/Icon";
import { modules } from "../../data/program";

const accents = {
  blue: {
    icon: "text-blue",
    ring: "border-blue/30 bg-blue/10",
    dot: "bg-blue",
    glow: "from-blue/25",
  },
  violet: {
    icon: "text-violet",
    ring: "border-violet/35 bg-violet/12",
    dot: "bg-violet",
    glow: "from-violet/25",
  },
  lime: {
    icon: "text-lime",
    ring: "border-lime/35 bg-lime/10",
    dot: "bg-lime",
    glow: "from-lime/20",
  },
};

export default function Learn() {
  return (
    <section id="aprender" className="relative scroll-mt-20 overflow-hidden py-20 sm:py-28">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="tech-grid absolute inset-0 opacity-30" />
        <div className="absolute left-1/2 top-24 h-[420px] w-[560px] -translate-x-1/2 rounded-full bg-blue/8 blur-[140px]" />
      </div>

      <Container>
        <Reveal className="mx-auto max-w-[720px] text-center">
          <Eyebrow>O que você vai aprender</Eyebrow>
          <h2 className="mt-5 font-display text-[30px] font-extrabold uppercase leading-[1.03] tracking-[-0.02em] sm:text-[42px] lg:text-[48px]">
            Muito mais que <span className="text-gradient-blue">suporte</span>.
          </h2>
          <p className="mx-auto mt-5 max-w-[580px] text-[15px] leading-relaxed text-mute-soft sm:text-[16.5px]">
            Durante a formação, você vai conhecer diferentes áreas e desenvolver conhecimentos que fazem
            parte do dia a dia de empresas e profissionais.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {modules.map((mod, i) => {
            const a = accents[mod.accent];
            return (
              <Reveal key={mod.number} delay={(i % 3) * 0.08}>
                <article className="edge group relative h-full overflow-hidden rounded-2xl border border-line bg-panel/70 p-6 transition-all duration-400 hover:-translate-y-1.5 hover:bg-panel sm:p-7">
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${a.glow} to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
                  />

                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`grid h-12 w-12 place-items-center rounded-xl border ${a.ring} transition-transform duration-400 group-hover:scale-110`}
                    >
                      <Icon name={mod.icon} size={21} strokeWidth={1.9} className={a.icon} />
                    </div>
                    <span className="font-display text-[30px] font-extrabold leading-none tracking-tight text-white/10 transition-colors duration-400 group-hover:text-white/20">
                      {mod.number}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-[17px] font-bold uppercase tracking-[0.02em] text-white sm:text-[18.5px]">
                    {mod.title}
                  </h3>

                  <ul className="mt-4 space-y-2.5">
                    {mod.topics.map((topic) => (
                      <li key={topic} className="flex items-start gap-2.5 text-[14px] text-mute-soft">
                        <span className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${a.dot}`} />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
