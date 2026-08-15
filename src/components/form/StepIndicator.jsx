import { Check } from "lucide-react";

export const STEPS = ["Dados", "Perfil", "Origem", "Finalizar"];

export default function StepIndicator({ current, onGoTo }) {
  const progress = (current / (STEPS.length - 1)) * 100;

  return (
    <div className="relative">
      {/* Trilha */}
      <div aria-hidden className="absolute left-0 right-0 top-[18px] h-[3px] rounded-full bg-line sm:top-[21px]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue via-violet to-lime transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ol className="relative flex items-start justify-between">
        {STEPS.map((label, i) => {
          const done = i < current;
          const active = i === current;
          const clickable = i < current;

          return (
            <li key={label} className="flex flex-1 flex-col items-center gap-2 first:items-start last:items-end">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onGoTo(i)}
                aria-current={active ? "step" : undefined}
                className={`grid h-9 w-9 place-items-center rounded-full border font-display text-[12px] font-bold transition-all duration-300 sm:h-11 sm:w-11 sm:text-[13px] ${
                  done
                    ? "border-lime bg-lime text-void hover:scale-110"
                    : active
                      ? "border-blue bg-void text-white shadow-[0_0_0_4px_rgba(43,140,255,0.18)]"
                      : "border-line bg-void text-mute"
                } ${clickable ? "cursor-pointer" : "cursor-default"}`}
              >
                {done ? <Check size={16} strokeWidth={3} /> : `0${i + 1}`}
              </button>
              <span
                className={`text-center text-[10.5px] font-medium transition-colors duration-300 sm:text-[12px] ${
                  active ? "text-white" : done ? "text-lime/85" : "text-mute"
                }`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
