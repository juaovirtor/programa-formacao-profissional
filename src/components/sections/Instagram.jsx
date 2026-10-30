import { Instagram as IconeInstagram } from "lucide-react";
import Container from "../ui/Container";
import Reveal from "../ui/Reveal";
import Eyebrow from "../ui/Eyebrow";
import { instagram } from "../../data/program";
import { mostrarEspacos } from "../../lib/espacos";

/**
 * Instagram oficial. Sem API paga nem login: os posts são escolhidos à mão
 * em program.js (imagem + link do post). Sem posts, a seção vira só a
 * chamada para o perfil.
 */
export default function Instagram() {
  const posts = instagram.posts.length ? instagram.posts : mostrarEspacos ? Array.from({ length: 6 }, () => null) : [];

  return (
    <section className="secao-adiada border-y border-line-soft bg-deep py-20 sm:py-24">
      <Container>
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[640px]">
            <Eyebrow tone="violet">Instagram oficial</Eyebrow>
            <h2 className="mt-5 font-display text-[26px] font-extrabold uppercase leading-[1.05] tracking-[-0.02em] sm:text-[36px] lg:text-[40px]">
              {instagram.titulo} <span className="text-gradient-blue">{instagram.destaque}</span>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-mute-soft sm:text-[16px]">{instagram.texto}</p>
          </div>
          <a
            href={instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 self-start rounded-full border border-line bg-white/[0.03] px-6 py-4 font-display text-[13.5px] font-semibold text-white transition-colors hover:border-violet/60 hover:bg-violet/10 lg:self-auto"
          >
            <IconeInstagram size={17} className="text-violet" />
            {instagram.perfil}
          </a>
        </Reveal>

        {posts.length > 0 && (
          <div className="mt-10 grid grid-cols-3 gap-2.5 sm:gap-3 lg:grid-cols-6">
            {posts.map((post, i) =>
              post ? (
                <a
                  key={post.url}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-panel-2"
                >
                  <img
                    src={post.imagem}
                    alt={post.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </a>
              ) : (
                <div
                  key={i}
                  className="grid aspect-[4/5] place-items-center rounded-2xl border border-dashed border-[#2a3b5a] bg-panel-2 text-center text-[11.5px] text-mute"
                >
                  [Post escolhido]
                </div>
              ),
            )}
          </div>
        )}
      </Container>
    </section>
  );
}
