import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { withToken } from "../lib/adminApi";

/**
 * Foto do candidato.
 *
 * Os links do Storage são assinados e expiram (1 hora). Se o link faltar ou
 * falhar, mostramos a inicial do nome em vez de uma imagem quebrada.
 */
export default function Foto({ url, nome = "", className = "" }) {
  const [falhou, setFalhou] = useState(false);

  useEffect(() => setFalhou(false), [url]);

  const inicial = nome.trim().charAt(0).toUpperCase();
  const base = `shrink-0 overflow-hidden border border-line bg-panel ${className}`;

  if (!url || falhou) {
    return (
      <div className={`grid place-items-center ${base}`} aria-label={nome || "Sem foto"}>
        {inicial ? (
          <span className="font-display text-[18px] font-bold text-mute">{inicial}</span>
        ) : (
          <UserRound size={20} className="text-mute" />
        )}
      </div>
    );
  }

  return (
    <img
      src={withToken(url)}
      alt={nome}
      onError={() => setFalhou(true)}
      className={`object-cover ${base}`}
    />
  );
}
