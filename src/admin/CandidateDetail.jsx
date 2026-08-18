import { useEffect, useState } from "react";
import {
  AlertCircle,
  Check,
  FileText,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { atualizarInscricao, withToken } from "../lib/adminApi";
import Foto from "./Foto";
import { STATUS, STATUS_ORDER, formatarData, formatarTelefone, linkEmail, linkWhatsApp } from "./status";

export default function CandidateDetail({ candidato, onFechar, onAtualizar, onExcluir }) {
  // Registro excluído é histórico: pode ser consultado à vontade, mas não
  // aceita mais edição — a API recusa qualquer alteração nele.
  const excluida = Boolean(candidato.excluida);
  const [erro, setErro] = useState("");
  const [observacoes, setObservacoes] = useState(candidato.observacoes ?? "");
  const [salvo, setSalvo] = useState(false);

  // Depende só do id: salvar a observação atualiza o candidato e, se este efeito
  // reagisse a `observacoes`, apagaria o "Salvo" no mesmo instante em que aparece
  // (e sobrescreveria o que a pessoa estivesse digitando).
  useEffect(() => {
    setObservacoes(candidato.observacoes ?? "");
    setErro("");
    setSalvo(false);
  }, [candidato.id]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onFechar();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onFechar]);

  const mudarStatus = async (status) => {
    try {
      onAtualizar(await atualizarInscricao(candidato.id, { status }));
    } catch (err) {
      setErro(err.message);
    }
  };

  const salvarObservacoes = async () => {
    try {
      onAtualizar(await atualizarInscricao(candidato.id, { observacoes }));
      setSalvo(true);
      setTimeout(() => setSalvo(false), 2200);
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-void/80 backdrop-blur-sm" onClick={onFechar}>
      <aside
        onClick={(e) => e.stopPropagation()}
        className="h-full w-full max-w-[620px] overflow-y-auto border-l border-line bg-deep"
      >
        {/* Cabeçalho */}
        <header className="sticky top-0 z-10 flex items-start gap-4 border-b border-line bg-deep/95 px-5 py-5 backdrop-blur-xl sm:px-7">
          <Foto
            url={candidato.fotoUrl}
            nome={candidato.nome}
            className="h-16 w-16 rounded-2xl sm:h-[72px] sm:w-[72px]"
          />
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-display text-[19px] font-bold leading-tight text-white sm:text-[21px]">
              {candidato.nome}
            </h2>
            <p className="mt-1 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-mute">
              {candidato.protocolo} · {formatarData(candidato.criadoEm)}
            </p>
            <span
              className={`mt-2.5 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-medium ${STATUS[candidato.status].chip}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${STATUS[candidato.status].dot}`} />
              {STATUS[candidato.status].label}
            </span>
          </div>
          <button
            onClick={onFechar}
            aria-label="Fechar"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line text-mute transition-colors hover:border-blue/50 hover:text-white"
          >
            <X size={16} />
          </button>
        </header>

        <div className="space-y-7 px-5 py-6 sm:px-7">
          {/* Auditoria da exclusão: quando, por quê e por quem. */}
          {excluida && (
            <section className="rounded-2xl border border-red-400/40 bg-red-500/[0.08] px-4 py-4 sm:px-5">
              <h3 className="flex items-center gap-2 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
                <Trash2 size={13} />
                Inscrição excluída
              </h3>
              <dl className="mt-3 space-y-2.5 text-[13px]">
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-mute">Data da exclusão</dt>
                  <dd className="mt-0.5 text-white">{formatarData(candidato.exclusao?.em)}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-mute">Motivo</dt>
                  <dd className="mt-0.5 whitespace-pre-wrap break-words text-white">
                    {candidato.exclusao?.motivo || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-mute">Excluída por</dt>
                  <dd className="mt-0.5 text-white">{candidato.exclusao?.por || "Não identificado"}</dd>
                </div>
              </dl>
              <p className="mt-3.5 text-[12px] leading-relaxed text-mute-soft">
                Nenhum dado foi apagado: os dados do candidato, a foto e o currículo continuam
                guardados. O registro fica somente para consulta.
              </p>
            </section>
          )}

          {erro && (
            <p className="flex items-start gap-2 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              {erro}
            </p>
          )}

          {/* Contato */}
          <section>
            <h3 className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">
              Falar com o candidato
            </h3>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
              <a
                href={linkWhatsApp(candidato)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-lime/40 bg-lime/10 px-4 py-3 font-display text-[12.5px] font-semibold text-lime transition-colors hover:bg-lime/18"
              >
                <MessageCircle size={15} strokeWidth={2.2} />
                WhatsApp
              </a>
              <a
                href={linkEmail(candidato)}
                className="flex items-center justify-center gap-2 rounded-xl border border-line bg-white/[0.03] px-4 py-3 font-display text-[12.5px] font-semibold text-white transition-colors hover:border-blue/50 hover:bg-blue/10"
              >
                <Mail size={15} strokeWidth={2.2} className="text-blue" />
                E-mail
              </a>
              <a
                href={`tel:+55${candidato.telefone}`}
                className="flex items-center justify-center gap-2 rounded-xl border border-line bg-white/[0.03] px-4 py-3 font-display text-[12.5px] font-semibold text-white transition-colors hover:border-violet/50 hover:bg-violet/10"
              >
                <Phone size={15} strokeWidth={2.2} className="text-violet" />
                Ligar
              </a>
            </div>
            <dl className="mt-3 grid gap-2 sm:grid-cols-2">
              <Info label="Telefone" valor={formatarTelefone(candidato.telefone)} />
              <Info label="E-mail" valor={candidato.email} />
              <Info
                label="Como conheceu"
                valor={
                  candidato.origem === "Outro" && candidato.origemOutro
                    ? `Outro — ${candidato.origemOutro}`
                    : candidato.origem
                }
              />
              <Info label="Currículo" valor={candidato.curriculoNome} />
            </dl>
            {candidato.curriculoUrl ? (
              <a
                href={withToken(candidato.curriculoUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 inline-flex items-center gap-2 rounded-xl border border-line bg-white/[0.03] px-4 py-2.5 text-[13px] text-white transition-colors hover:border-blue/50 hover:bg-blue/10"
              >
                <FileText size={15} className="text-blue" />
                Abrir currículo (PDF)
              </a>
            ) : (
              // O link assinado expira em 1 hora — atualizar a lista gera um novo.
              <p className="mt-2.5 inline-flex items-center gap-2 rounded-xl border border-line bg-white/[0.02] px-4 py-2.5 text-[12.5px] text-mute">
                <FileText size={15} />
                Link do currículo expirou — atualize a lista.
              </p>
            )}

            {candidato.consentimento?.aceito && (
              <p className="mt-2.5 flex items-start gap-2 rounded-xl border border-lime/30 bg-lime/[0.06] px-4 py-3 text-[12.5px] leading-relaxed text-mute-soft">
                <ShieldCheck size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-lime" />
                Consentimento de uso dos dados registrado em {formatarData(candidato.consentimento.em)}.
              </p>
            )}
          </section>


          {/* Situação */}
          <section>
            <h3 className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">Situação</h3>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {STATUS_ORDER.map((chave) => {
                const ativo = candidato.status === chave;
                return (
                  <button
                    key={chave}
                    onClick={() => mudarStatus(chave)}
                    disabled={excluida}
                    className={`rounded-xl border px-3 py-3 text-[12.5px] font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                      ativo
                        ? STATUS[chave].chip
                        : "border-line bg-void/60 text-mute enabled:hover:border-blue/40 enabled:hover:text-white"
                    }`}
                  >
                    {STATUS[chave].label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Observações */}
          <section className="pb-4">
            <h3 className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">
              Observações internas
            </h3>
            <textarea
              rows={4}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              disabled={excluida}
              placeholder="Anotações da equipe sobre este candidato..."
              className="field mt-3 resize-none disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              onClick={salvarObservacoes}
              disabled={excluida}
              className="mt-2.5 inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-display text-[12px] font-semibold text-white transition-colors enabled:hover:border-lime/50 enabled:hover:bg-lime/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {salvo ? (
                <>
                  <Check size={14} className="text-lime" />
                  Salvo
                </>
              ) : (
                "Salvar observações"
              )}
            </button>
          </section>

          {/* Exclusão lógica — só para inscrições ativas. */}
          {!excluida && onExcluir && (
            <section className="border-t border-line pb-4 pt-6">
              <h3 className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">
                Excluir inscrição
              </h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-mute-soft">
                A inscrição sai da lista ativa e passa para o histórico. Nada é apagado — os dados,
                a foto e o currículo continuam guardados.
              </p>
              <button
                onClick={onExcluir}
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-red-400/45 bg-red-500/10 px-5 py-2.5 font-display text-[12px] font-semibold text-red-300 transition-colors hover:bg-red-500/20"
              >
                <Trash2 size={14} />
                Excluir inscrição
              </button>
            </section>
          )}
        </div>
      </aside>
    </div>
  );
}

function Info({ label, valor }) {
  return (
    <div className="rounded-xl border border-line bg-void/50 px-4 py-3">
      <dt className="font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-mute">{label}</dt>
      <dd className="mt-1 truncate text-[13.5px] text-white">{valor || "—"}</dd>
    </div>
  );
}
