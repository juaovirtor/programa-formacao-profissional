import { useState } from "react";
import { AlertCircle, Loader2, Lock } from "lucide-react";
import { login } from "../lib/adminApi";

export default function Login({ onEntrar }) {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const submeter = async (e) => {
    e.preventDefault();
    if (enviando) return;
    setEnviando(true);
    setErro("");
    try {
      await login(senha);
      onEntrar();
    } catch (err) {
      setErro(err.message);
      setEnviando(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-5">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_0%,#0d1c3d_0%,#070b16_50%,#04060d_100%)]" />
        <div className="tech-grid tech-grid-fade absolute inset-0 opacity-60" />
      </div>

      <form onSubmit={submeter} className="edge w-full max-w-[400px] rounded-3xl border border-line bg-panel/70 p-7 sm:p-9">
        <img src="/assets/logo-grupo-phoenix.webp" alt="Group Phoenix" className="h-7 w-auto" />

        <h1 className="mt-7 font-display text-[22px] font-extrabold uppercase leading-tight tracking-tight text-white sm:text-[25px]">
          Painel de <span className="text-lime">inscrições</span>
        </h1>
        <p className="mt-2 text-[13.5px] text-mute">Acesso restrito à equipe do Group Phoenix.</p>


        <label
          htmlFor="senha"
          className="mt-7 mb-2 block font-display text-[12px] font-semibold uppercase tracking-[0.12em] text-mute-soft"
        >
          Senha
        </label>
        <div className="relative">
          <Lock size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mute" />
          <input
            id="senha"
            type="password"
            autoFocus
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••"
            className={`field pl-11 ${erro ? "field-error" : ""}`}
          />
        </div>

        {erro && (
          <p className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium text-red-400">
            <AlertCircle size={14} strokeWidth={2.4} />
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="btn-shine mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-deep via-blue to-violet py-3.5 font-display text-[13px] font-bold uppercase tracking-[0.08em] text-white transition-transform duration-300 hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70"
        >
          {enviando ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </button>

        <a href="/" className="mt-5 block text-center text-[12.5px] text-mute transition-colors hover:text-white">
          ← Voltar para o site
        </a>
      </form>
    </div>
  );
}
