import { ArrowRight } from "lucide-react";
import Container from "../ui/Container";
import Reveal from "../ui/Reveal";
import Particles from "../ui/Particles";

export default function CtaBanner({ onCta }) {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <Container>
        <Reveal>
          <div className="edge edge-lime relative overflow-hidden rounded-3xl border border-line px-6 py-14 text-center sm:px-12 sm:py-20">
            <div aria-hidden className="absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-[radial-gradient(110%_120%_at_50%_0%,#12244a_0%,#0a1122_50%,#04060d_100%)]" />
              <div className="tech-grid absolute inset-0 opacity-40" />
              <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-violet/20 blur-[110px]" />
              <div className="absolute -right-16 top-0 h-72 w-72 rounded-full bg-blue/22 blur-[110px]" />
              <div className="absolute left-1/2 top-1/2 h-40 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/8 blur-[100px]" />
              <Particles count={14} />
            </div>

            <h2 className="mx-auto max-w-[720px] font-display text-[30px] font-extrabold uppercase leading-[1.03] tracking-[-0.02em] sm:text-[44px] lg:text-[52px]">
              Pronto para dar o <span className="text-lime">primeiro passo</span>?
            </h2>
            <p className="mx-auto mt-5 max-w-[500px] text-[15.5px] leading-relaxed text-mute-soft sm:text-[17.5px]">
              Seu futuro profissional não precisa esperar. Comece agora.
            </p>

            <button
              onClick={onCta}
              className="btn-shine group mt-9 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-lime px-9 py-4.5 font-display text-[14.5px] font-bold uppercase tracking-[0.08em] text-void shadow-[0_18px_50px_-14px_rgba(200,245,50,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-lime-soft sm:w-auto sm:px-11 sm:py-5 sm:text-[16px]"
            >
              Fazer minha inscrição
              <ArrowRight size={19} strokeWidth={2.8} className="transition-transform group-hover:translate-x-1" />
            </button>

            <p className="mt-5 font-display text-[11.5px] font-semibold uppercase tracking-[0.16em] text-mute">
              Leva menos de 2 minutos · 100% gratuito
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
