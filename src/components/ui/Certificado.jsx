import { certificado, marca } from "../../data/program";

/**
 * Certificado exemplo, flutuando.
 *
 * Com a imagem real (certificado.imagem), mostra ela. Sem ela, desenha só a
 * moldura genérica — sem nome de aluno, data ou assinatura — e avisa que é
 * ilustrativa, para ninguém tomar a moldura pelo documento real.
 *
 * `tamanho`: "sm" no topo do site, "lg" na seção de certificação.
 */
export default function Certificado({ tamanho = "lg", className = "" }) {
  const grande = tamanho === "lg";

  return (
    <figure className={`flutua m-0 ${className}`}>
      <div
        className={`rotate-[-5deg] rounded-xl bg-white text-[#13202f] shadow-[0_40px_80px_-24px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.08),0_0_70px_-12px_rgba(43,140,255,0.5)] ${
          grande ? "p-3 sm:p-4" : "p-2 sm:p-2.5"
        }`}
      >
        {certificado.imagem ? (
          <img
            src={certificado.imagem}
            alt="Certificado de participação do Programa de Formação Profissional"
            loading="lazy"
            className="block w-full rounded-md"
          />
        ) : (
          <div
            className={`flex aspect-[1.414] flex-col items-center justify-center rounded-md border-[1.5px] border-[#c9d3e2] text-center ${
              grande ? "gap-3 px-6" : "gap-1.5 px-3"
            }`}
          >
            <p
              className={`font-display font-bold uppercase text-blue ${
                grande ? "text-[10px] tracking-[0.26em] sm:text-[12px]" : "text-[7.5px] tracking-[0.22em] sm:text-[9px]"
              }`}
            >
              Certificado de participação
            </p>
            <p
              className={`font-display font-extrabold uppercase leading-tight ${
                grande ? "text-[15px] sm:text-[19px]" : "text-[10px] sm:text-[12px]"
              }`}
            >
              {marca.programa}
            </p>
            <span className={`h-px bg-[#c9d3e2] ${grande ? "w-1/2" : "w-2/5"}`} />
            <p className={`text-[#8792a3] ${grande ? "text-[10px] sm:text-[11px]" : "text-[7.5px] sm:text-[8.5px]"}`}>
              {marca.grupo} · {marca.parceira}
            </p>
          </div>
        )}
      </div>
      {!certificado.imagem && (
        <figcaption className="mt-3 text-center text-[11px] text-mute/80">Imagem ilustrativa</figcaption>
      )}
    </figure>
  );
}
