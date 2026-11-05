import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** Shared presentation primitives only. No seeded records, persistence, or business actions. */
export function RavenMark({ size = 40, label = "Raven OS" }: { size?: number; label?: string }) {
  return (
    <span role="img" aria-label={label} className="inline-grid shrink-0 place-items-center rounded-xl bg-[#111A18] text-[#D4AF37] font-black" style={{ width: size, height: size }}>
      <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="32" cy="32" r="23" stroke="currentColor" strokeWidth="3" />
        <path d="M42 19 29 27 21 25 27 35 20 44 34 41 40 47 39 34 47 28 37 27Z" fill="currentColor" fillOpacity=".2" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
        <circle cx="34" cy="30" r="1.8" fill="currentColor" />
      </svg>
    </span>
  );
}

export function PageHead({ icon: Icon, eyebrow, title, description, actions }: {
  icon?: LucideIcon; eyebrow?: string; title: string; description?: string; actions?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="flex min-w-0 items-start gap-3">
        {Icon && <span className="hidden h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#111A18] text-[#D4AF37] sm:grid"><Icon size={21} /></span>}
        <div className="min-w-0">
          {eyebrow && <p className="mb-1 text-xs font-extrabold text-[#08794F]">{eyebrow}</p>}
          <h1 className="text-xl font-black leading-8 text-[#111A18] md:text-2xl">{title}</h1>
          {description && <p className="mt-1 max-w-3xl text-sm leading-7 text-[#66736e]">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function SectionCard({ title, description, action, children }: {
  title: string; description?: string; action?: ReactNode; children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 px-5 py-4">
        <div><h2 className="font-extrabold text-[#111A18]">{title}</h2>{description && <p className="mt-1 text-xs leading-5 text-[#66736e]">{description}</p>}</div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const safeValue = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
  return (
    <div>
      {label && <div className="mb-1 text-xs font-bold text-[#66736e]">{label}</div>}
      <div className="h-2 overflow-hidden rounded-full bg-[#e9e7df]" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={safeValue}>
        <div className="h-full rounded-full bg-[#08794F] transition-[width]" style={{ width: safeValue + "%" }} />
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description }: { icon?: LucideIcon; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#C1B489] bg-[#F5F3EC]/60 px-5 py-8 text-center">
      {Icon && <span className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-xl bg-[#111A18] text-[#D4AF37]"><Icon size={19} aria-hidden="true" /></span>}
      <p className="font-extrabold text-[#111A18]">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-[#66736e]">{description}</p>
    </div>
  );
}
