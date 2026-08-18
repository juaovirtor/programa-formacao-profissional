import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ClipboardCheck,
  LogOut,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import { clearToken, getToken, listarInscricoes } from "../lib/adminApi";
import CandidateDetail from "./CandidateDetail";
import DeleteModal from "./DeleteModal";
import Foto from "./Foto";
import Login from "./Login";
import { STATUS, STATUS_ORDER, formatarData, formatarTelefone } from "./status";

export default function AdminApp() {
  const [autenticado, setAutenticado] = useState(Boolean(getToken()));
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [selecionadoId, setSelecionadoId] = useState(null);
  // Alterna entre a lista ativa e o histórico de excluídas. As duas nunca
  // aparecem juntas: é a API que decide qual conjunto devolver.
  const [verExcluidas, setVerExcluidas] = useState(false);
  const [paraExcluir, setParaExcluir] = useState(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      setDados(await listarInscricoes({ excluidas: verExcluidas }));
    } catch (err) {
      setErro(err.message);
      if (/sessão/i.test(err.message)) setAutenticado(false);
    } finally {
      setCarregando(false);
    }
  }, [verExcluidas]);

  useEffect(() => {
    if (autenticado) carregar();
  }, [autenticado, carregar]);

  // Trocar de lista fecha o que estava aberto: o id não existe na outra.
  const alternarExcluidas = (mostrar) => {
    if (mostrar === verExcluidas) return;
    setVerExcluidas(mostrar);
    setSelecionadoId(null);
    setDados(null);
  };

  const sair = () => {
    clearToken();
    setAutenticado(false);
    setDados(null);
  };

  const inscricoes = dados?.inscricoes ?? [];

  // Calculado a partir da lista em memória para refletir mudanças de status na hora.
  const resumo = useMemo(
    () => ({
      total: inscricoes.length,
      novos: inscricoes.filter((r) => r.status === "novo").length,
      emAnalise: inscricoes.filter((r) => r.status === "em_analise").length,
      selecionados: inscricoes.filter((r) => r.status === "selecionado").length,
    }),
    [inscricoes],
  );

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return inscricoes.filter((row) => {
      if (filtro !== "todos" && row.status !== filtro) return false;
      if (!termo) return true;
      return [row.nome, row.email, row.protocolo, row.telefone].join(" ").toLowerCase().includes(termo);
    });
  }, [inscricoes, busca, filtro]);

  const selecionado = inscricoes.find((row) => row.id === selecionadoId) ?? null;

  const aplicarAtualizacao = (atualizado) => {
    setDados((prev) => ({
      ...prev,
      inscricoes: prev.inscricoes.map((row) => (row.id === atualizado.id ? atualizado : row)),
    }));
  };

  // A inscrição excluída sai da lista ativa na hora. Ela continua no banco e
  // reaparece no filtro "Excluídas" — nada foi apagado.
  const aplicarExclusao = (excluida) => {
    setDados((prev) => ({
      ...prev,
      inscricoes: prev.inscricoes.filter((row) => row.id !== excluida.id),
    }));
    setParaExcluir(null);
    setSelecionadoId((atual) => (atual === excluida.id ? null : atual));
  };

  if (!autenticado) return <Login onEntrar={() => setAutenticado(true)} />;

  return (
    <div className="min-h-screen">
      <div aria-hidden className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_0%,#0b1730_0%,#070b16_45%,#04060d_100%)]" />
        <div className="tech-grid tech-grid-fade absolute inset-0 opacity-40" />
      </div>

      {/* Topo */}
      <header className="sticky top-0 z-30 border-b border-line-soft bg-void/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-3">
            <img src="/assets/logo-grupo-phoenix.webp" alt="Group Phoenix" className="h-6 w-auto" />
            <span className="hidden font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-mute sm:block">
              Painel de inscrições
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={carregar}
              disabled={carregando}
              className="grid h-10 w-10 place-items-center rounded-xl border border-line text-mute transition-colors hover:border-blue/50 hover:text-white disabled:opacity-50"
              aria-label="Atualizar"
            >
              <RefreshCw size={16} className={carregando ? "animate-spin" : ""} />
            </button>
            <button
              onClick={sair}
              className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-[12.5px] font-medium text-mute-soft transition-colors hover:border-red-400/50 hover:text-white"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1240px] px-5 py-7 sm:px-8 sm:py-10">
        <h1 className="font-display text-[26px] font-extrabold uppercase leading-tight tracking-[-0.02em] sm:text-[34px]">
          Candidatos do <span className="text-gradient-blue">programa</span>
        </h1>

        {/* Indicadores */}
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Indicador
            icone={verExcluidas ? Trash2 : Users}
            label={verExcluidas ? "Excluídas" : "Inscrições"}
            valor={resumo.total}
            cor={verExcluidas ? "text-red-400" : "text-blue"}
          />
          <Indicador icone={Sparkles} label="Novos" valor={resumo.novos} cor="text-blue-soft" />
          <Indicador icone={ClipboardCheck} label="Em análise" valor={resumo.emAnalise} cor="text-violet" />
          <Indicador icone={UserRound} label="Selecionados" valor={resumo.selecionados} cor="text-lime" />
        </div>

        {/* Busca e filtros */}
        <div className="mt-7 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative lg:max-w-[360px] lg:flex-1">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mute" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, e-mail ou protocolo"
              className="field pl-11"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Filtro ativo={filtro === "todos"} onClick={() => setFiltro("todos")}>
              Todos
            </Filtro>
            {STATUS_ORDER.map((chave) => (
              <Filtro key={chave} ativo={filtro === chave} onClick={() => setFiltro(chave)}>
                {STATUS[chave].label}
              </Filtro>
            ))}
            {/* Separado dos status de propósito: não é um status, é outra lista. */}
            <Filtro ativo={verExcluidas} onClick={() => alternarExcluidas(!verExcluidas)} tom="perigo">
              <Trash2 size={13} className="mr-1.5 inline-block align-[-2px]" />
              Excluídas
            </Filtro>
          </div>
        </div>

        {verExcluidas && (
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-500/[0.07] px-4 py-3 text-[12.5px] leading-relaxed text-mute-soft">
            <Trash2 size={14} className="mt-0.5 shrink-0 text-red-400" />
            Histórico de inscrições excluídas. Os dados, a foto e o currículo continuam guardados —
            a exclusão apenas tira o candidato da lista ativa.
          </p>
        )}

        {erro && (
          <p className="mt-5 flex items-start gap-2 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            {erro}
          </p>
        )}

        {/* Lista */}
        <div className="mt-5 space-y-2.5">
          {filtradas.map((row) => (
            // Um <div> por fora, e não um <button>: o cartão tem dois botões
            // dentro (abrir e excluir) e um botão não pode conter outro.
            <div
              key={row.id}
              className={`edge group flex w-full items-center gap-3 rounded-2xl border bg-panel/60 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-panel sm:gap-4 sm:p-4 ${
                row.excluida ? "border-red-400/25 hover:border-red-400/45" : "border-line hover:border-blue/40"
              }`}
            >
              <button
                onClick={() => setSelecionadoId(row.id)}
                className="flex min-w-0 flex-1 items-center gap-3 text-left sm:gap-4"
              >
                <Foto url={row.fotoUrl} nome={row.nome} className="h-12 w-12 rounded-xl sm:h-14 sm:w-14" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-[15px] font-bold text-white sm:text-[16px]">{row.nome}</p>
                  <p className="mt-0.5 truncate text-[12.5px] text-mute">
                    {formatarTelefone(row.telefone)} · {row.email}
                  </p>
                  <p className="mt-1 truncate font-display text-[10.5px] font-semibold uppercase tracking-[0.14em] text-mute/70">
                    {row.protocolo} · {formatarData(row.criadoEm)}
                  </p>
                  {row.excluida && (
                    <p className="mt-1 truncate text-[11.5px] text-red-300/90">
                      Excluída em {formatarData(row.exclusao.em)} — {row.exclusao.motivo}
                    </p>
                  )}
                </div>
              </button>

              <span
                className={`hidden shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-medium sm:inline-flex ${STATUS[row.status].chip}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${STATUS[row.status].dot}`} />
                {STATUS[row.status].label}
              </span>
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full sm:hidden ${STATUS[row.status].dot}`} />

              {!row.excluida && (
                <button
                  onClick={() => setParaExcluir(row)}
                  aria-label={`Excluir a inscrição de ${row.nome}`}
                  title="Excluir inscrição"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line text-mute transition-colors hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-300"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}

          {!carregando && filtradas.length === 0 && (
            <p className="rounded-2xl border border-dashed border-line bg-void/50 px-5 py-12 text-center text-[14px] text-mute">
              {inscricoes.length > 0
                ? "Nenhum candidato encontrado com esse filtro."
                : verExcluidas
                  ? "Nenhuma inscrição foi excluída até agora."
                  : "Nenhuma inscrição recebida ainda."}
            </p>
          )}
        </div>
      </main>

      {selecionado && (
        <CandidateDetail
          candidato={selecionado}
          onFechar={() => setSelecionadoId(null)}
          onAtualizar={aplicarAtualizacao}
          onExcluir={() => setParaExcluir(selecionado)}
        />
      )}

      {paraExcluir && (
        <DeleteModal
          candidato={paraExcluir}
          onCancelar={() => setParaExcluir(null)}
          onExcluida={aplicarExclusao}
        />
      )}
    </div>
  );
}

function Indicador({ icone: Icone, label, valor, cor }) {
  return (
    <div className="edge rounded-2xl border border-line bg-panel/60 p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <Icone size={15} strokeWidth={2.1} className={cor} />
        <p className="font-display text-[10.5px] font-semibold uppercase tracking-[0.16em] text-mute">{label}</p>
      </div>
      <p className="mt-2 font-display text-[28px] font-extrabold leading-none tracking-tight text-white sm:text-[34px]">
        {valor}
      </p>
    </div>
  );
}

function Filtro({ ativo, onClick, children, tom = "normal" }) {
  const perigo = tom === "perigo";
  const ativoClasses = perigo
    ? "border-red-400/50 bg-red-500/12 text-red-300"
    : "border-blue/50 bg-blue/12 text-blue-soft";
  const inativoClasses = perigo
    ? "border-line bg-void/60 text-mute hover:border-red-400/40 hover:text-red-300"
    : "border-line bg-void/60 text-mute hover:border-blue/40 hover:text-white";

  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2.5 text-[12.5px] font-medium transition-all ${
        ativo ? ativoClasses : inativoClasses
      }`}
    >
      {children}
    </button>
  );
}
