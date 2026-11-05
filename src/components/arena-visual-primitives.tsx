import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

/** Design Arena presentation patterns adapted for Raven. No seeded data or persistence. */
export function ArenaPanel({ title, description, children }: {
  title: string; description?: string; children: ReactNode;
}) {
  return <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">
    <header className="border-b border-black/5 px-5 py-4">
      <h2 className="font-extrabold text-[#111A18]">{title}</h2>
      {description ? <p className="mt-1 text-xs leading-5 text-[#66736e]">{description}</p> : null}
    </header>
    <div className="p-5">{children}</div>
  </section>;
}

export function ArenaEmptyState({ title, description }: { title: string; description: string }) {
  return <div className="rounded-xl border border-dashed border-[#C1B489] bg-[#F5F3EC]/60 px-5 py-10 text-center">
    <Inbox size={22} className="mx-auto mb-3 text-[#66736e]" aria-hidden="true" />
    <h3 className="font-extrabold text-[#111A18]">{title}</h3>
    <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-[#66736e]">{description}</p>
  </div>;
}

export function ArenaStatus({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700">{children}</span>;
}

export function ArenaProgress({ value, label }: { value: number; label?: string }) {
  const safeValue = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
  return <div>
    {label ? <div className="mb-1 text-xs font-bold text-[#66736e]">{label}</div> : null}
    <div className="h-2 overflow-hidden rounded-full bg-[#e9e7df]" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={safeValue}>
      <div className="h-full rounded-full bg-[#08794F]" style={{ width: safeValue + "%" }} />
    </div>
  </div>;
}
