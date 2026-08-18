/**
 * Otimização da foto do candidato — NO NAVEGADOR, antes do upload.
 *
 * Por que existe: os candidatos escolhem a foto direto da galeria do celular.
 * Um aparelho atual gera arquivos de 8 a 15 MB. Enviar isso para a API e só
 * então comprimir seria desperdiçar a internet (quase sempre móvel) de quem
 * está se inscrevendo, além de encher o Storage.
 *
 * O que este módulo faz, nesta ordem:
 *   1. decodifica o arquivo já com a orientação do EXIF aplicada
 *      (foto tirada em pé continua em pé);
 *   2. reduz a maior dimensão para 1600px, mantendo a proporção — sem cortar
 *      e sem esticar, e sem nunca aumentar uma imagem pequena;
 *   3. recomprime baixando a qualidade por etapas até chegar perto do alvo;
 *   4. devolve um File novo, pronto para o mesmo FormData de sempre.
 *
 * Só a foto do candidato passa por aqui. As imagens do site não são tocadas.
 */

/** Maior dimensão da foto final. Suficiente para identificar o candidato. */
export const DIMENSAO_MAX = 1600;

/** Alvo de tamanho depois da compressão. Não é um limite rígido. */
const ALVO_BYTES = 1.5 * 1024 * 1024;

/** Abaixo disto a foto já está boa: não vale a pena recomprimir e perder qualidade. */
const JA_ESTA_BOA = 1 * 1024 * 1024;

/** Qualidades tentadas, da melhor para a mais econômica. */
const QUALIDADES = [0.82, 0.74, 0.66, 0.58, 0.5];

/** Tipos que a API e os buckets do Supabase aceitam. */
export const TIPOS_SAIDA = ["image/webp", "image/jpeg"];

/* ------------------------------------------------------------------ */
/* Suporte do navegador                                                */
/* ------------------------------------------------------------------ */

let webpSuportado = null;

/**
 * O WebP gera arquivos bem menores com a mesma qualidade, mas nem todo
 * navegador sabe CODIFICAR (mesmo sabendo exibir). Quando não souber,
 * caímos para JPEG, que funciona em qualquer lugar.
 */
function suportaWebp() {
  if (webpSuportado !== null) return webpSuportado;
  try {
    const teste = document.createElement("canvas");
    teste.width = 1;
    teste.height = 1;
    webpSuportado = teste.toDataURL("image/webp").startsWith("data:image/webp");
  } catch {
    webpSuportado = false;
  }
  return webpSuportado;
}

/* ------------------------------------------------------------------ */
/* Decodificação                                                       */
/* ------------------------------------------------------------------ */

/**
 * Transforma o arquivo em algo que o canvas saiba desenhar, já com a
 * orientação correta.
 *
 * Caminho principal: createImageBitmap com imageOrientation "from-image",
 * que aplica o EXIF na hora de decodificar.
 *
 * Caminho reserva: um <img> comum. Os navegadores atuais já respeitam o EXIF
 * em <img> por padrão (image-orientation: from-image), então a orientação
 * continua certa também aqui.
 *
 * HEIC/HEIF: não existe conversão manual. Se o aparelho souber decodificar
 * (iPhone/Safari), funciona por qualquer um dos dois caminhos. Se não souber
 * (a maioria dos Android/Chrome), os dois falham e o erro é tratado por quem
 * chamou, com uma mensagem clara para o candidato.
 */
async function decodificar(file) {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      // Navegador antigo pode não aceitar as opções: tenta sem elas.
      try {
        return await createImageBitmap(file);
      } catch {
        /* cai para o <img> abaixo */
      }
    }
  }

  return await new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("decodificacao"));
    };
    img.src = url;
  });
}

function dimensoesDe(fonte) {
  return {
    largura: fonte.width ?? fonte.naturalWidth,
    altura: fonte.height ?? fonte.naturalHeight,
  };
}

/* ------------------------------------------------------------------ */
/* Redimensionamento                                                   */
/* ------------------------------------------------------------------ */

/**
 * Desenha a imagem já reduzida num canvas.
 *
 * Reduções grandes feitas de uma vez só ficam serrilhadas. Por isso a imagem
 * é reduzida pela metade a cada passo até chegar perto do tamanho final —
 * é o mesmo princípio dos mipmaps e sai bem mais limpo.
 *
 * A escala é a MESMA nos dois eixos: a proporção nunca muda e nada é cortado.
 */
function desenharReduzido(fonte, larguraFinal, alturaFinal) {
  let atual = fonte;
  let { largura, altura } = dimensoesDe(fonte);

  while (largura > larguraFinal * 2) {
    const meio = document.createElement("canvas");
    meio.width = Math.max(1, Math.round(largura / 2));
    meio.height = Math.max(1, Math.round(altura / 2));
    const ctx = meio.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(atual, 0, 0, meio.width, meio.height);
    atual = meio;
    largura = meio.width;
    altura = meio.height;
  }

  const canvas = document.createElement("canvas");
  canvas.width = larguraFinal;
  canvas.height = alturaFinal;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(atual, 0, 0, larguraFinal, alturaFinal);
  return canvas;
}

function paraBlob(canvas, tipo, qualidade) {
  return new Promise((resolve) => canvas.toBlob(resolve, tipo, qualidade));
}

/* ------------------------------------------------------------------ */
/* API do módulo                                                       */
/* ------------------------------------------------------------------ */

/** Troca a extensão do nome mantendo o resto, para o candidato se reconhecer. */
function renomear(nome, tipo) {
  const extensao = tipo === "image/webp" ? "webp" : "jpg";
  const base = (nome || "foto").replace(/\.[^./\\]+$/, "").slice(0, 60) || "foto";
  return `${base}.${extensao}`;
}

export class ErroDeImagem extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = "ErroDeImagem";
  }
}

/**
 * Otimiza a foto escolhida pelo candidato.
 *
 * @param {File} file
 * @returns {Promise<{file: File, info: {
 *   otimizada: boolean, tamanhoOriginal: number, tamanhoFinal: number,
 *   largura: number, altura: number, tipo: string
 * }}>}
 * @throws {ErroDeImagem} com mensagem pronta para mostrar ao candidato
 */
export async function otimizarFoto(file) {
  if (!file) throw new ErroDeImagem("Nenhuma foto foi selecionada.");

  let fonte;
  try {
    fonte = await decodificar(file);
  } catch {
    throw new ErroDeImagem(
      "Não conseguimos abrir esta imagem neste aparelho. " +
        "Tente enviar a foto em JPG, PNG ou WEBP.",
    );
  }

  const { largura, altura } = dimensoesDe(fonte);
  if (!largura || !altura) {
    fonte.close?.();
    throw new ErroDeImagem("O arquivo escolhido não parece ser uma imagem válida.");
  }

  const maior = Math.max(largura, altura);
  // Math.min(1, ...) garante que uma foto pequena nunca é ampliada.
  const escala = Math.min(1, DIMENSAO_MAX / maior);

  // Já está dentro das dimensões e é leve: recomprimir só perderia qualidade.
  if (escala === 1 && file.size <= JA_ESTA_BOA && TIPOS_SAIDA.includes(file.type)) {
    fonte.close?.();
    return {
      file,
      info: {
        otimizada: false,
        tamanhoOriginal: file.size,
        tamanhoFinal: file.size,
        largura,
        altura,
        tipo: file.type,
      },
    };
  }

  const tipo = suportaWebp() ? "image/webp" : "image/jpeg";
  let larguraFinal = Math.max(1, Math.round(largura * escala));
  let alturaFinal = Math.max(1, Math.round(altura * escala));

  let melhor = null;

  // Duas rodadas: na segunda, se ainda estiver grande, a imagem é reduzida
  // mais um pouco. É o suficiente para trazer qualquer foto de celular para
  // dentro do alvo sem deixar o rosto irreconhecível.
  for (const reducao of [1, 0.75]) {
    if (reducao !== 1) {
      larguraFinal = Math.max(1, Math.round(larguraFinal * reducao));
      alturaFinal = Math.max(1, Math.round(alturaFinal * reducao));
    }

    let canvas;
    try {
      canvas = desenharReduzido(fonte, larguraFinal, alturaFinal);
    } catch {
      fonte.close?.();
      throw new ErroDeImagem(
        "Esta foto é grande demais para ser processada neste aparelho. " +
          "Tente escolher uma foto com resolução menor.",
      );
    }

    for (const qualidade of QUALIDADES) {
      const blob = await paraBlob(canvas, tipo, qualidade);
      if (!blob) continue;
      if (!melhor || blob.size < melhor.blob.size) {
        melhor = { blob, largura: canvas.width, altura: canvas.height };
      }
      if (blob.size <= ALVO_BYTES) break;
    }

    if (melhor && melhor.blob.size <= ALVO_BYTES) break;
  }

  fonte.close?.();

  if (!melhor) {
    throw new ErroDeImagem("Não conseguimos processar esta foto. Tente enviar outra imagem.");
  }

  // Caso raro: a "otimização" ficou maior que o original (acontece com
  // imagens pequenas e artificiais, tipo capturas de tela). Fica o original.
  if (melhor.blob.size >= file.size && TIPOS_SAIDA.includes(file.type)) {
    return {
      file,
      info: {
        otimizada: false,
        tamanhoOriginal: file.size,
        tamanhoFinal: file.size,
        largura,
        altura,
        tipo: file.type,
      },
    };
  }

  const otimizado = new File([melhor.blob], renomear(file.name, tipo), {
    type: tipo,
    lastModified: Date.now(),
  });

  return {
    file: otimizado,
    info: {
      otimizada: true,
      tamanhoOriginal: file.size,
      tamanhoFinal: otimizado.size,
      largura: melhor.largura,
      altura: melhor.altura,
      tipo,
    },
  };
}
