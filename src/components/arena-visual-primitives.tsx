import { useEffect, useId, type ReactNode } from "react";
import { Inbox, Search, X, type LucideIcon } from "lucide-react";

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

export function ArenaTable({ headers, children, minWidth = 640 }: {
  headers: ReactNode; children: ReactNode; minWidth?: number;
}) {
  return <div className="overflow-x-auto">
    <table className="w-full text-start text-sm" style={{ minWidth }}>
      <thead className="bg-[#F5F3EC] text-xs font-extrabold text-[#66736e]">{headers}</thead>
      <tbody className="divide-y divide-black/5">{children}</tbody>
    </table>
  </div>;
}

export function ArenaDonut({ value, size = 104, stroke = 11, color = "#08794F", track = "#EDE9DC" }: {
  value: number; size?: number; stroke?: number; color?: string; track?: string;
}) {
  const safeValue = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - safeValue / 100 * circumference;
  return <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={radius} stroke={track} strokeWidth={stroke} fill="none"/>
      <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={stroke} fill="none"
        strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}/>
    </svg>
    <span className="absolute text-lg font-black text-[#111A18]">{safeValue}%</span>
  </div>;
}

export function ArenaTrendChart({ data, labels, height = 150 }: {
  data: number[]; labels: string[]; height?: number;
}) {
  if (data.length < 2 || data.length !== labels.length || !data.every(Number.isFinite)) {
    return <ArenaEmptyState title="لا تتوفر بيانات كافية للرسم" description="سيظهر الرسم عند اتصال مصدر موثوق وتوفر نقطتين على الأقل." />;
  }
  const width = 560, pad = 28;
  const low = Math.min(...data), high = Math.max(...data), range = high - low || 1;
  const x = (i: number) => pad + i * (width - pad * 2) / (data.length - 1);
  const y = (v: number) => height - 24 - (v - low) / range * (height - 48);
  const points = data.map((v, i) => `${x(i)},${y(v)}`);
  return <div className="w-full overflow-x-auto"><svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[320px]" role="img" aria-label="Trend chart">
    {[0.25,0.5,0.75].map(t => <line key={t} x1={pad} x2={width-pad} y1={height*t} y2={height*t} stroke="#E9E7DF" strokeDasharray="3 5"/>)}
    <path d={`M${points.join(" L")}`} fill="none" stroke="#08794F" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
    {data.map((v,i) => <g key={i}><circle cx={x(i)} cy={y(v)} r="3.5" fill="white" stroke="#08794F" strokeWidth="2"/>
      <text x={x(i)} y={height-3} textAnchor="middle" fontSize="10" fill="#66736e">{labels[i]}</text></g>)}
  </svg></div>;
}

export function ArenaPageHeader({ icon: Icon, eyebrow, title, description, actions }: {
  icon?: LucideIcon; eyebrow?: string; title: string; description?: string; actions?: ReactNode;
}) {
  return <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div className="flex min-w-0 items-start gap-3">
      {Icon ? <span className="hidden h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#111A18] text-[#D4AF37] sm:grid"><Icon size={21}/></span> : null}
      <div className="min-w-0">{eyebrow ? <p className="mb-1 text-xs font-extrabold text-[#08794F]">{eyebrow}</p> : null}
        <h1 className="text-xl font-black leading-8 text-[#111A18] md:text-2xl">{title}</h1>
        {description ? <p className="mt-1 max-w-3xl text-sm leading-7 text-[#66736e]">{description}</p> : null}
      </div>
    </div>
    {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
  </header>;
}

export function ArenaDialog({ open, onClose, title, description, children, footer }: {
  open: boolean; onClose: () => void; title: string; description?: string; children: ReactNode; footer?: ReactNode;
}) {
  const titleId = useId();
  useEffect(() => {
    if (!open) return;
    const handle = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [open, onClose]);
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
    <button type="button" className="absolute inset-0 bg-[#111A18]/60" onClick={onClose} aria-label="إغلاق النافذة"/>
    <section role="dialog" aria-modal="true" aria-labelledby={titleId}
      className="relative flex max-h-[92vh] w-full max-w-2xl flex-col rounded-t-3xl border border-black/10 bg-[#F5F3EC] shadow-2xl sm:rounded-3xl">
      <header className="flex items-start justify-between gap-4 border-b border-black/10 px-6 py-5">
        <div><h2 id={titleId} className="font-black text-[#111A18]">{title}</h2>
          {description ? <p className="mt-1 text-xs leading-6 text-[#66736e]">{description}</p> : null}</div>
        <button type="button" onClick={onClose} className="rounded-lg p-2 text-[#66736e] hover:bg-black/5" aria-label="إغلاق"><X size={18}/></button>
      </header>
      <div className="overflow-y-auto px-6 py-5">{children}</div>
      {footer ? <footer className="flex flex-wrap justify-end gap-2 border-t border-black/10 px-6 py-4">{footer}</footer> : null}
    </section>
  </div>;
}


/** KPI presentation only. Values must come from a verified source. */
export function ArenaKpiCard({ label, value, description, icon: Icon }: {
  label: string; value: string | number; description?: string; icon?: LucideIcon;
}) {
  return <section className="min-w-0 rounded-2xl border border-black/10 bg-white p-4">
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-bold text-[#66736e]">{label}</span>
      {Icon ? <Icon size={18} className="text-[#08794F]"/> : null}
    </div>
    <div className="mt-3 text-2xl font-black tabular-nums text-[#111A18]">{value}</div>
    {description ? <p className="mt-2 text-xs leading-5 text-[#66736e]">{description}</p> : null}
  </section>;
}

export function ArenaCardTitle({ title, description, action }: {
  title: string; description?: string; action?: ReactNode;
}) {
  return <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 px-5 py-4">
    <div><h3 className="font-extrabold text-[#111A18]">{title}</h3>
      {description ? <p className="mt-1 text-xs leading-5 text-[#66736e]">{description}</p> : null}</div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </div>;
}

export function ArenaBars({ data, labels, color = "#15445A", height = 150 }: {
  data: number[]; labels: string[]; color?: string; height?: number;
}) {
  if (!data.length || data.length !== labels.length || !data.every(Number.isFinite)) {
    return <ArenaEmptyState title="لا تتوفر بيانات كافية للرسم" description="سيظهر الرسم عند اتصال مصدر موثوق وتطابق القيم مع التسميات." />;
  }
  const max = Math.max(1, ...data);
  return <div className="flex w-full items-end gap-2 sm:gap-3" style={{ height }}>
    {data.map((value, index) => <div key={index} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
      <span className="text-[10px] font-bold tabular-nums text-[#66736e]">{value}</span>
      <div className="w-full max-w-[46px] rounded-t-lg" style={{ height: Math.max(2, value / max * (height - 44)), background: color }} />
      <span className="w-full truncate text-center text-[10px] font-bold text-[#66736e]">{labels[index]}</span>
    </div>)}
  </div>;
}

export function ArenaStatusDot({ tone, label }: {
  tone: "green" | "gold" | "red" | "blue" | "neutral"; label?: string;
}) {
  const colors = { green: "bg-emerald-600", gold: "bg-amber-500", red: "bg-red-600", blue: "bg-sky-700", neutral: "bg-slate-400" };
  return <span className="inline-flex items-center gap-2">
    <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${colors[tone]}`} aria-hidden="true"/>
    {label ? <span className="text-xs text-[#66736e]">{label}</span> : null}
  </span>;
}

export function ArenaSearchInput({ value, onChange, placeholder, label }: {
  value: string; onChange: (value: string) => void; placeholder: string; label: string;
}) {
  return <label className="relative block min-w-0">
    <Search size={16} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[#66736e]" aria-hidden="true"/>
    <input value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} aria-label={label}
      className="h-10 w-full rounded-xl border border-black/10 bg-white ps-9 pe-3 text-sm text-[#111A18] outline-none placeholder:text-[#66736e]/70 focus:border-[#08794F]/50"/>
  </label>;
}
