import { marca } from "../data/program";

export const STATUS = {
  novo: { label: "Novo", chip: "border-blue/40 bg-blue/12 text-blue-soft", dot: "bg-blue" },
  em_analise: { label: "Em análise", chip: "border-violet/45 bg-violet/12 text-violet", dot: "bg-violet" },
  selecionado: { label: "Selecionado", chip: "border-lime/45 bg-lime/12 text-lime", dot: "bg-lime" },
  nao_selecionado: {
    label: "Não selecionado",
    chip: "border-line bg-white/[0.04] text-mute",
    dot: "bg-mute",
  },
};

export const STATUS_ORDER = ["novo", "em_analise", "selecionado", "nao_selecionado"];

export function formatarTelefone(digits = "") {
  const d = digits.replace(/\D/g, "");
  if (d.length === 11) return d.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  if (d.length === 10) return d.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  return digits;
}

export function formatarData(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Mensagem inicial de contato pelo WhatsApp. */
export function mensagemWhatsApp(candidato) {
  const primeiroNome = candidato.nome.trim().split(" ")[0];
  return (
    `Olá, ${primeiroNome}! Aqui é da ${marca.empresa}. ` +
    `Recebemos sua inscrição no Programa de Formação Profissional (protocolo ${candidato.protocolo}). ` +
    `Podemos conversar sobre os próximos passos?`
  );
}

export function linkWhatsApp(candidato) {
  const numero = candidato.telefone.replace(/\D/g, "");
  const completo = numero.startsWith("55") ? numero : `55${numero}`;
  return `https://wa.me/${completo}?text=${encodeURIComponent(mensagemWhatsApp(candidato))}`;
}

export function linkEmail(candidato) {
  const assunto = `Programa de Formação Profissional — ${marca.empresa}`;
  const corpo = mensagemWhatsApp(candidato);
  return `mailto:${candidato.email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
}
