/** Etiqueta pequena acima dos títulos de seção. */
export default function Eyebrow({ children, tone = "blue", className = "" }) {
  const tones = {
    blue: "border-blue/35 text-blue-soft bg-blue/8",
    lime: "border-lime/40 text-lime bg-lime/8",
    violet: "border-violet/40 text-violet bg-violet/10",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.16em] ${tones[tone]} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
