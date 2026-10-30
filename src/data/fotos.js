/**
 * Fotografias REAIS do programa.
 *
 * Cada foto: { src, alt, legenda?, categoria? }.
 * - `src: null` = foto ainda não recebida. No site publicado ela simplesmente
 *   não aparece; em desenvolvimento vira um espaço marcado com `descricao`,
 *   que diz que tipo de foto vai ali.
 * - Nunca usar banco de imagens aqui: tudo nesta lista é apresentado como
 *   registro do programa.
 *
 * Para adicionar: salve a foto otimizada (WebP, ~1600px no lado maior) em
 * public/fotos/ e preencha `src` com "/fotos/<arquivo>.webp" e um `alt`
 * que descreva a cena.
 */

const espaco = (descricao, extra = {}) => ({ src: null, alt: "", descricao, ...extra });

/** Montagem da primeira dobra (4 fotos). */
export const fotosHero = [
  espaco("Participantes conversando em roda"),
  espaco("Participante apresentando"),
  espaco("Dinâmica em grupo"),
  espaco("Encontro com convidado"),
];

export const fotosHistoria = [espaco("Idealizadores do programa"), espaco("Primeiro encontro da turma")];

/** Fotos dos dois pilares principais, pela chave usada em formacao.pilares. */
export const fotosPilares = {
  comunicacao: espaco("Jovem apresentando ideias"),
  relacionamento: espaco("Turma em dinâmica de grupo"),
};

export const categoriasGaleria = ["Dinâmicas", "Apresentações", "Convidados", "Bastidores", "Encerramento"];

/** Galeria "Experiência na prática". A primeira foto é o destaque. */
export const galeria = [
  espaco("Dinâmica em grupo · destaque", { categoria: "Dinâmicas" }),
  espaco("Apresentação", { categoria: "Apresentações" }),
  espaco("Conversa em dupla", { categoria: "Dinâmicas" }),
  espaco("Bastidores", { categoria: "Bastidores" }),
  espaco("Convidado falando", { categoria: "Convidados" }),
  espaco("Momento de aprendizado", { categoria: "Apresentações" }),
  espaco("Turma reunida", { categoria: "Encerramento" }),
  espaco("Atividade prática", { categoria: "Dinâmicas" }),
  espaco("Entrega de certificados", { categoria: "Encerramento" }),
];

export const fotosTurmas = {
  principal: espaco("Turma reunida no encerramento"),
  extras: [espaco("Aula"), espaco("Entrega de certificados")],
};
