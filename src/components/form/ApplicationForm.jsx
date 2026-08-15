import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AlertCircle, ArrowLeft, ArrowRight, Check, Loader2, Lock, Send, ShieldCheck } from "lucide-react";
import Container from "../ui/Container";
import Reveal from "../ui/Reveal";
import Eyebrow from "../ui/Eyebrow";
import Field from "./Field";
import FileUpload from "./FileUpload";
import PrivacyNotice from "./PrivacyNotice";
import StepIndicator, { STEPS } from "./StepIndicator";
import SuccessModal from "./SuccessModal";
import { originOptions, privacidade } from "../../data/program";
import { submitApplication } from "../../lib/api";
import {
  maskPhone,
  validateConsentimento,
  validateCurriculo,
  validateEmail,
  validateFoto,
  validateNome,
  validateOrigem,
  validateTelefone,
} from "../../lib/validation";

const EMPTY = {
  nome: "",
  telefone: "",
  email: "",
  foto: null,
  curriculo: null,
  origem: "",
  origemOutro: "",
  consentimento: false,
};

const stepTitles = [
  { eyebrow: "Etapa 01", title: "Seus dados", text: "Como podemos falar com você." },
  { eyebrow: "Etapa 02", title: "Seu perfil", text: "Envie sua foto e seu currículo." },
  { eyebrow: "Etapa 03", title: "Como você conheceu?", text: "Isso nos ajuda a chegar em mais jovens." },
  { eyebrow: "Etapa 04", title: "Confira e envie", text: "Revise os dados antes de finalizar." },
];

export default function ApplicationForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | error
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(null); // { protocolo }
  const [avisoAberto, setAvisoAberto] = useState(false);
  const cardRef = useRef(null);
  const reduced = useReducedMotion();

  const set = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
    // Editar qualquer campo invalida o erro do envio anterior — senão a
    // mensagem de e-mail já cadastrado continuaria na tela depois da correção.
    setSubmitError("");
  };

  const validateStep = (index) => {
    const next = {};
    if (index === 0) {
      next.nome = validateNome(data.nome);
      next.telefone = validateTelefone(data.telefone);
      next.email = validateEmail(data.email);
    }
    if (index === 1) {
      next.foto = validateFoto(data.foto);
      next.curriculo = validateCurriculo(data.curriculo);
    }
    if (index === 2) {
      next.origem = validateOrigem(data.origem, data.origemOutro);
    }
    if (index === 3) {
      next.consentimento = validateConsentimento(data.consentimento);
    }
    const clean = Object.fromEntries(Object.entries(next).filter(([, v]) => v));
    setErrors(clean);
    return Object.keys(clean).length === 0;
  };

  const scrollToCard = () => {
    const top = cardRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const next = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    scrollToCard();
  };

  const back = () => {
    setStep((s) => Math.max(s - 1, 0));
    scrollToCard();
  };

  const goTo = (index) => {
    setStep(index);
    scrollToCard();
  };

  /** Envio final — ver src/lib/api.js (POST /api/inscricoes). */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return; // impede envios múltiplos

    // Revalida tudo antes de enviar (inclusive o aceite da etapa final)
    for (let i = 0; i < STEPS.length; i += 1) {
      if (!validateStep(i)) {
        setStep(i);
        scrollToCard();
        return;
      }
    }

    setStatus("sending");
    setSubmitError("");

    const result = await submitApplication(data);

    if (result.ok) {
      setStatus("idle");
      setSuccess({ protocolo: result.protocolo });
      setData(EMPTY);
      setErrors({});
      setStep(0);
    } else {
      setStatus("error");
      setSubmitError(result.error ?? "Não conseguimos enviar sua inscrição. Tente novamente.");
    }
  };

  // Cada etapa é remontada (key={step}) e entra com uma transição curta.
  const slide = {
    initial: reduced ? false : { opacity: 0, x: 22 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <section id="inscricao" className="relative scroll-mt-16 overflow-hidden py-16 sm:py-24">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(100%_70%_at_50%_0%,rgba(43,140,255,0.14),transparent_60%)]" />
        <div className="absolute bottom-0 left-1/2 h-80 w-[80%] -translate-x-1/2 rounded-full bg-violet/10 blur-[130px]" />
      </div>

      <Container>
        <Reveal className="mx-auto max-w-[640px] text-center">
          <Eyebrow tone="lime">Inscrição</Eyebrow>
          <h2 className="mt-5 font-display text-[30px] font-extrabold uppercase leading-[1.03] tracking-[-0.02em] sm:text-[42px] lg:text-[46px]">
            Sua inscrição <span className="text-lime">começa aqui</span>.
          </h2>
          <p className="mx-auto mt-4 max-w-[420px] text-[15px] text-mute-soft sm:text-[16.5px]">
            Preencha seus dados. É rápido e gratuito.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mx-auto mt-10 max-w-[720px] sm:mt-14">
          <div
            ref={cardRef}
            className="edge scroll-mt-24 rounded-3xl border border-line bg-gradient-to-b from-panel/90 to-void/95 p-5 sm:p-8"
          >
            <StepIndicator current={step} onGoTo={goTo} />

            <form onSubmit={handleSubmit} noValidate className="mt-8 sm:mt-10">
              <div className="mb-6">
                <p className="font-display text-[10.5px] font-semibold uppercase tracking-[0.2em] text-blue-soft">
                  {stepTitles[step].eyebrow}
                </p>
                <h3 className="mt-1.5 font-display text-[21px] font-bold uppercase tracking-tight text-white sm:text-[24px]">
                  {stepTitles[step].title}
                </h3>
                <p className="mt-1.5 text-[13.5px] text-mute">{stepTitles[step].text}</p>
              </div>

              <motion.div key={step} {...slide}>
                {/* ---------------- ETAPA 01 — DADOS ---------------- */}
                {step === 0 && (
                  <div className="space-y-5">
                    <Field label="Nome completo" htmlFor="nome" error={errors.nome}>
                      <input
                        id="nome"
                        name="nome"
                        type="text"
                        autoComplete="name"
                        placeholder="Ex.: Maria Eduarda Silva"
                        value={data.nome}
                        onChange={(e) => set("nome", e.target.value)}
                        className={`field ${errors.nome ? "field-error" : ""}`}
                      />
                    </Field>

                    <Field
                      label="Telefone / WhatsApp"
                      htmlFor="telefone"
                      error={errors.telefone}
                      hint="É por aqui que vamos te avisar sobre a seleção."
                    >
                      <input
                        id="telefone"
                        name="telefone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        placeholder="(42) 99999-9999"
                        value={data.telefone}
                        onChange={(e) => set("telefone", maskPhone(e.target.value))}
                        className={`field ${errors.telefone ? "field-error" : ""}`}
                      />
                    </Field>

                    <Field label="E-mail" htmlFor="email" error={errors.email}>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="seuemail@exemplo.com"
                        value={data.email}
                        onChange={(e) => set("email", e.target.value)}
                        className={`field ${errors.email ? "field-error" : ""}`}
                      />
                    </Field>
                  </div>
                )}

                {/* ---------------- ETAPA 02 — PERFIL ---------------- */}
                {step === 1 && (
                  <div className="space-y-5">
                    <Field label="Foto" htmlFor="foto" error={errors.foto}>
                      <FileUpload
                        id="foto"
                        variant="photo"
                        accept="image/jpeg,image/png,image/webp"
                        file={data.foto}
                        error={errors.foto}
                        onSelect={(file) => set("foto", file)}
                        title="Enviar minha foto"
                        subtitle="JPG, PNG ou WEBP · até 5MB"
                      />
                    </Field>

                    <Field label="Currículo" htmlFor="curriculo" error={errors.curriculo}>
                      <FileUpload
                        id="curriculo"
                        variant="pdf"
                        accept="application/pdf,.pdf"
                        file={data.curriculo}
                        error={errors.curriculo}
                        onSelect={(file) => set("curriculo", file)}
                        title="Enviar meu currículo"
                        subtitle="Somente PDF · até 10MB"
                      />
                    </Field>

                    <p className="flex items-start gap-2 rounded-xl border border-line bg-white/[0.02] px-4 py-3 text-[12.5px] leading-relaxed text-mute">
                      <Lock size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-blue" />
                      Sua foto e seu currículo são usados apenas na avaliação das inscrições. Não são
                      publicados, compartilhados nem reproduzidos em nenhum canal.
                    </p>
                  </div>
                )}

                {/* ---------------- ETAPA 03 — ORIGEM ---------------- */}
                {step === 2 && (
                  <div className="space-y-5">
                    <Field label="Como você ficou sabendo do Programa?" htmlFor="origem" error={errors.origem}>
                      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                        {originOptions.map((option) => {
                          const active = data.origem === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => set("origem", option)}
                              className={`rounded-xl border px-3 py-3.5 text-[13px] font-medium transition-all duration-250 ${
                                active
                                  ? "border-lime bg-lime/12 text-lime shadow-[0_0_0_3px_rgba(200,245,50,0.1)]"
                                  : "border-line bg-void/60 text-mute-soft hover:border-blue/50 hover:bg-blue/[0.06] hover:text-white"
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </Field>

                    {data.origem === "Outro" && (
                      <motion.div
                        initial={reduced ? false : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pt-1">
                          <Field label="Conte como ficou sabendo" htmlFor="origemOutro">
                            <textarea
                              id="origemOutro"
                              rows={3}
                              placeholder="Ex.: vi um cartaz na minha escola"
                              value={data.origemOutro}
                              onChange={(e) => set("origemOutro", e.target.value)}
                              className="field resize-none"
                            />
                          </Field>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* ---------------- ETAPA 04 — REVISÃO ---------------- */}
                {step === 3 && (
                  <div className="space-y-3">
                    <ReviewRow label="Nome" value={data.nome} onEdit={() => goTo(0)} />
                    <ReviewRow label="Telefone" value={data.telefone} onEdit={() => goTo(0)} />
                    <ReviewRow label="E-mail" value={data.email} onEdit={() => goTo(0)} />
                    <ReviewRow label="Foto" value={data.foto?.name} onEdit={() => goTo(1)} />
                    <ReviewRow label="Currículo" value={data.curriculo?.name} onEdit={() => goTo(1)} />
                    <ReviewRow
                      label="Origem"
                      value={
                        data.origem === "Outro" && data.origemOutro
                          ? `Outro — ${data.origemOutro}`
                          : data.origem
                      }
                      onEdit={() => goTo(2)}
                    />

                    {/* ---------- Consentimento (LGPD) ---------- */}
                    <div
                      className={`rounded-2xl border p-4 transition-colors sm:p-5 ${
                        errors.consentimento
                          ? "border-red-400/70 bg-red-500/5"
                          : data.consentimento
                            ? "border-lime/50 bg-lime/[0.06]"
                            : "border-line bg-void/60"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={15} strokeWidth={2.1} className="shrink-0 text-lime" />
                        <p className="font-display text-[11.5px] font-semibold uppercase tracking-[0.14em] text-mute-soft">
                          Uso dos seus dados (LGPD)
                        </p>
                      </div>

                      <p className="mt-2.5 text-[13px] leading-relaxed text-mute">
                        {privacidade.resumoCurto}
                      </p>

                      <label
                        htmlFor="consentimento"
                        className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl p-1 -m-1"
                      >
                        <span className="relative mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
                          <input
                            id="consentimento"
                            type="checkbox"
                            checked={data.consentimento}
                            onChange={(e) => set("consentimento", e.target.checked)}
                            className="peer sr-only"
                          />
                          <span
                            aria-hidden
                            className="grid h-6 w-6 place-items-center rounded-md border border-line bg-void transition-all peer-checked:border-lime peer-checked:bg-lime peer-focus-visible:ring-2 peer-focus-visible:ring-blue peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-void"
                          >
                            {data.consentimento && <Check size={15} strokeWidth={3.2} className="text-void" />}
                          </span>
                        </span>
                        <span className="text-[13px] leading-relaxed text-white/90">
                          {privacidade.aceite}
                        </span>
                      </label>

                      <button
                        type="button"
                        onClick={() => setAvisoAberto(true)}
                        className="mt-3 text-[12.5px] font-medium text-blue-soft underline underline-offset-4 transition-colors hover:text-white"
                      >
                        Ler o Aviso de Privacidade completo
                      </button>

                      {errors.consentimento && (
                        <p className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium text-red-400">
                          <AlertCircle size={14} strokeWidth={2.4} className="shrink-0" />
                          {errors.consentimento}
                        </p>
                      )}
                    </div>

                    {submitError && (
                      <p className="flex items-start gap-2 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
                        <AlertCircle size={15} strokeWidth={2.2} className="mt-0.5 shrink-0" />
                        {submitError}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>

              {/* ---------------- NAVEGAÇÃO ---------------- */}
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={back}
                    disabled={status === "sending"}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-6 py-3.5 font-display text-[13px] font-semibold text-mute-soft transition-colors hover:border-blue/50 hover:text-white disabled:opacity-50"
                  >
                    <ArrowLeft size={16} strokeWidth={2.4} />
                    Voltar
                  </button>
                ) : (
                  <span className="hidden sm:block" />
                )}

                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={next}
                    className="btn-shine group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-deep via-blue to-violet px-8 py-4 font-display text-[13.5px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_14px_40px_-14px_rgba(43,140,255,0.9)] transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    Continuar
                    <ArrowRight size={17} strokeWidth={2.8} className="transition-transform group-hover:translate-x-1" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn-shine inline-flex items-center justify-center gap-2.5 rounded-full bg-lime px-8 py-4 font-display text-[13.5px] font-bold uppercase tracking-[0.08em] text-void shadow-[0_16px_45px_-15px_rgba(200,245,50,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-lime-soft disabled:translate-y-0 disabled:opacity-70"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 size={17} strokeWidth={2.6} className="animate-spin" />
                        Enviando inscrição...
                      </>
                    ) : (
                      <>
                        <Send size={16} strokeWidth={2.6} />
                        Enviar minha inscrição
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          <p className="mt-5 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-center text-[12px] leading-relaxed text-mute">
            <ShieldCheck size={13} strokeWidth={2} className="text-lime" />
            Seus dados ficam protegidos e são usados só neste processo seletivo.
            <button
              type="button"
              onClick={() => setAvisoAberto(true)}
              className="font-medium text-blue-soft underline underline-offset-4 transition-colors hover:text-white"
            >
              Aviso de Privacidade
            </button>
          </p>
        </Reveal>
      </Container>

      <PrivacyNotice open={avisoAberto} onClose={() => setAvisoAberto(false)} />

      <SuccessModal
        open={Boolean(success)}
        protocolo={success?.protocolo}
        onClose={() => setSuccess(null)}
      />
    </section>
  );
}

function ReviewRow({ label, value, onEdit }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-void/60 px-4 py-3.5">
      <div className="min-w-0">
        <p className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-mute">
          {label}
        </p>
        <p className="mt-1 truncate text-[14px] text-white">{value || "—"}</p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 rounded-lg border border-line px-3 py-1.5 text-[12px] font-medium text-blue-soft transition-colors hover:border-blue/60 hover:bg-blue/10"
      >
        Editar
      </button>
    </div>
  );
}
