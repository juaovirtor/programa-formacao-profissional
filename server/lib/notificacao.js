/**
 * Aviso por e-mail a cada nova inscrição.
 *
 * Regras que valem para tudo neste arquivo:
 *
 * 1. O aviso é disparado DEPOIS que a inscrição já está garantida — arquivos
 *    no Storage e registro no banco. Ele nunca participa da decisão de aceitar
 *    ou recusar uma inscrição.
 * 2. Nada aqui derruba a inscrição. Toda falha é capturada e vai para o log
 *    da API; o candidato não vê erro nenhum por causa do e-mail.
 * 3. Sem credencial no código. O provedor e as chaves vêm do .env.
 *
 * Provedores (EMAIL_PROVIDER):
 *   resend  → API HTTP da Resend, sem dependência extra
 *   smtp    → servidor SMTP próprio, via nodemailer
 *   none    → desligado (padrão): registra no log e não envia nada
 */

const PROVEDOR = (process.env.EMAIL_PROVIDER ?? "none").trim().toLowerCase();

/** Aceita mais de um destinatário separado por vírgula. */
function destinatarios() {
  return (process.env.NOTIFICATION_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

function remetente() {
  return (process.env.EMAIL_FROM ?? "").trim();
}

/**
 * Endereço do painel usado no link do e-mail. Se ADMIN_PANEL_URL não estiver
 * definida, tenta montar a partir do primeiro domínio autorizado no CORS.
 */
function urlDoPainel() {
  const direta = (process.env.ADMIN_PANEL_URL ?? "").trim();
  if (direta) return direta.replace(/\/+$/, "");

  const origem = (process.env.CORS_ORIGIN ?? "").split(",")[0]?.trim();
  if (!origem) return "";
  return `${origem.replace(/\/+$/, "")}/admin`;
}

/**
 * O que ainda falta configurar. Devolve [] quando está tudo pronto.
 * Usado no arranque da API para avisar cedo, em vez de descobrir só na
 * primeira inscrição.
 */
export function pendenciasDaNotificacao() {
  if (PROVEDOR === "none" || PROVEDOR === "") return ["EMAIL_PROVIDER"];

  const faltando = [];
  if (destinatarios().length === 0) faltando.push("NOTIFICATION_EMAIL");
  if (!remetente()) faltando.push("EMAIL_FROM");

  if (PROVEDOR === "resend") {
    if (!process.env.RESEND_API_KEY?.trim()) faltando.push("RESEND_API_KEY");
  } else if (PROVEDOR === "smtp") {
    if (!process.env.SMTP_HOST?.trim()) faltando.push("SMTP_HOST");
    if (!process.env.SMTP_USER?.trim()) faltando.push("SMTP_USER");
    if (!process.env.SMTP_PASS?.trim()) faltando.push("SMTP_PASS");
  } else {
    faltando.push(`EMAIL_PROVIDER inválido: "${PROVEDOR}"`);
  }

  return faltando;
}

export function notificacaoAtiva() {
  return pendenciasDaNotificacao().length === 0;
}

/* ------------------------------------------------------------------ */
/* Montagem da mensagem                                                */
/* ------------------------------------------------------------------ */

/** Os dados vêm do candidato: escapar é obrigatório antes de virar HTML. */
function escapar(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatarTelefone(digitos = "") {
  const d = String(digitos).replace(/\D/g, "");
  if (d.length === 11) return d.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  if (d.length === 10) return d.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  return digitos;
}

function formatarData(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function montarMensagem(inscricao) {
  const painel = urlDoPainel();
  const linhas = [
    ["Candidato", inscricao.nome],
    ["E-mail", inscricao.email],
    ["Telefone", formatarTelefone(inscricao.telefone)],
    ["Protocolo", inscricao.protocolo],
    ["Data da inscrição", formatarData(inscricao.criadoEm)],
  ];

  const assunto = `Nova inscrição — ${inscricao.nome} (${inscricao.protocolo})`;

  const texto = [
    "Uma nova inscrição foi concluída no Programa de Formação Profissional.",
    "",
    ...linhas.map(([r, v]) => `${r}: ${v}`),
    ...(painel ? ["", `Abrir o painel: ${painel}`] : []),
  ].join("\n");

  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;background:#f4f6fb;padding:24px">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;padding:28px">
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#6b7a90">
      Programa de Formação Profissional
    </p>
    <h1 style="margin:0 0 20px;font-size:20px;color:#0b1120">Nova inscrição recebida</h1>
    <table style="width:100%;border-collapse:collapse;font-size:14px;color:#0b1120">
      ${linhas
        .map(
          ([rotulo, valor]) => `
      <tr>
        <td style="padding:8px 0;color:#6b7a90;width:38%">${escapar(rotulo)}</td>
        <td style="padding:8px 0;font-weight:bold">${escapar(valor)}</td>
      </tr>`,
        )
        .join("")}
    </table>
    ${
      painel
        ? `<p style="margin:24px 0 0">
      <a href="${escapar(painel)}"
         style="display:inline-block;background:#2b8cff;color:#ffffff;text-decoration:none;
                padding:12px 22px;border-radius:999px;font-size:14px;font-weight:bold">
        Abrir o painel de inscrições
      </a>
    </p>`
        : ""
    }
  </div>
</div>`.trim();

  return { assunto, texto, html };
}

/* ------------------------------------------------------------------ */
/* Envio                                                               */
/* ------------------------------------------------------------------ */

async function enviarPelaResend({ assunto, texto, html }) {
  const resposta = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY.trim()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: remetente(),
      to: destinatarios(),
      subject: assunto,
      text: texto,
      html,
    }),
  });

  if (!resposta.ok) {
    const detalhe = await resposta.text().catch(() => "");
    throw new Error(`Resend respondeu ${resposta.status}: ${detalhe.slice(0, 300)}`);
  }
}

async function enviarPorSmtp({ assunto, texto, html }) {
  // Import dinâmico: quem usa a Resend não carrega o nodemailer.
  let nodemailer;
  try {
    nodemailer = (await import("nodemailer")).default;
  } catch {
    throw new Error('EMAIL_PROVIDER=smtp exige o pacote "nodemailer" (npm install nodemailer).');
  }

  const porta = Number(process.env.SMTP_PORT ?? 587);
  const transporte = nodemailer.createTransport({
    host: process.env.SMTP_HOST.trim(),
    port: porta,
    // Porta 465 usa TLS direto; 587 usa STARTTLS. SMTP_SECURE força o modo.
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : porta === 465,
    auth: { user: process.env.SMTP_USER.trim(), pass: process.env.SMTP_PASS },
  });

  await transporte.sendMail({
    from: remetente(),
    to: destinatarios().join(", "),
    subject: assunto,
    text: texto,
    html,
  });
}

/**
 * Avisa a equipe sobre uma inscrição nova.
 *
 * NUNCA lança. Chame sem await depois de responder ao candidato: o resultado
 * do e-mail não pode atrasar nem afetar a resposta da inscrição.
 *
 * @param {{nome: string, email: string, telefone: string,
 *          protocolo: string, criadoEm: string}} inscricao
 * @returns {Promise<{enviado: boolean, motivo?: string}>}
 */
export async function notificarNovaInscricao(inscricao) {
  try {
    const pendencias = pendenciasDaNotificacao();
    if (pendencias.length > 0) {
      const motivo = `notificação desligada — falta configurar: ${pendencias.join(", ")}`;
      console.warn(`[notificacao] ${inscricao.protocolo}: ${motivo}`);
      return { enviado: false, motivo };
    }

    const mensagem = montarMensagem(inscricao);

    if (PROVEDOR === "resend") await enviarPelaResend(mensagem);
    else await enviarPorSmtp(mensagem);

    console.log(`[notificacao] aviso enviado (${inscricao.protocolo}) via ${PROVEDOR}.`);
    return { enviado: true };
  } catch (err) {
    // A inscrição já está salva. O erro fica registrado para a equipe,
    // e o candidato não é afetado de forma alguma.
    console.error(
      `[notificacao] falha ao avisar sobre a inscrição ${inscricao?.protocolo ?? "?"}:`,
      err,
    );
    return { enviado: false, motivo: err.message };
  }
}
