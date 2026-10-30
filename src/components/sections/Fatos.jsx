import Container from "../ui/Container";
import { fatos } from "../../data/program";

/** Faixa logo abaixo da apresentação: como o programa funciona, em 4 fatos. */
export default function Fatos() {
  return (
    <div className="border-y border-line-soft bg-deep">
      <Container>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 py-6 sm:py-7 lg:grid-cols-4">
          {fatos.map((fato) => (
            <div key={fato.valor}>
              <dt className="sr-only">{fato.texto}</dt>
              <dd className="m-0">
                <p
                  className={`font-display text-[20px] font-extrabold uppercase leading-none sm:text-[26px] ${
                    fato.destaque ? "text-lime" : "text-white"
                  }`}
                >
                  {fato.valor}
                </p>
                <p className="mt-1.5 text-[12.5px] text-mute sm:text-[13.5px]">{fato.texto}</p>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </div>
  );
}
