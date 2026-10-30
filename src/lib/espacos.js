/**
 * Mostrar os espaços de conteúdo ainda não recebido (fotos, convidados…)?
 *
 * - Em desenvolvimento (npm run dev): sim, marcados, para revisar o layout.
 * - Num build de prévia com VITE_MOSTRAR_ESPACOS=1: sim.
 * - No site publicado: não. Seção sem conteúdo real não aparece, e nenhum
 *   espaço vazio ou texto "[foto]" chega ao visitante.
 */
export const mostrarEspacos = import.meta.env.DEV || import.meta.env.VITE_MOSTRAR_ESPACOS === "1";

/** Fotos que podem ir para a tela: as reais, mais os espaços quando liberados. */
export function fotosVisiveis(lista) {
  return lista.filter((foto) => foto?.src || mostrarEspacos);
}

/** Há pelo menos uma foto real na lista? */
export function temFotoReal(lista) {
  return lista.some((foto) => foto?.src);
}
