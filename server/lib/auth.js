import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Autenticação do painel administrativo.
 * Senha única definida em ADMIN_PASSWORD (.env). O login devolve um token
 * assinado (HMAC) com validade — nada é gravado em banco.
 */

const SECRET = process.env.ADMIN_TOKEN_SECRET || randomBytes(32).toString("hex");
const TTL_HOURS = 12;

function sign(payload) {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function createToken() {
  const expira = Date.now() + TTL_HOURS * 60 * 60 * 1000;
  const payload = `admin.${expira}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidToken(token) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [prefix, expira, assinatura] = parts;
  const payload = `${prefix}.${expira}`;
  const esperado = sign(payload);

  if (assinatura.length !== esperado.length) return false;
  if (!timingSafeEqual(Buffer.from(assinatura), Buffer.from(esperado))) return false;

  return Number(expira) > Date.now();
}

export function checkPassword(senha) {
  const esperada = process.env.ADMIN_PASSWORD;
  if (!esperada) return false;
  const a = Buffer.from(String(senha ?? ""));
  const b = Buffer.from(esperada);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Middleware: exige Authorization: Bearer <token>. */
export function requireAdmin(req, res, next) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : req.query.token;
  if (!isValidToken(token)) {
    return res.status(401).json({ error: "Sessão expirada. Faça login novamente." });
  }
  next();
}
