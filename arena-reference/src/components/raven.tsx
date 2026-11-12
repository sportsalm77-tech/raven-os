import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  X, CheckCircle2, AlertTriangle, Info, FileText, Download, Search, Inbox,
  TrendingUp, TrendingDown, Loader2, type LucideIcon,
} from 'lucide-react';
import { useLang } from '../lib/i18n';

/* ─────── Logo ─────── */
export function RavenMark({ size = 40, dark = false }: { size?: number; dark?: boolean }) {
  const gold = '#D4AF37';
  const body = dark ? '#F5F3EC' : '#111A18';
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="60" height="60" rx="16" fill={body} />
      <circle cx="32" cy="32" r="21.5" stroke={gold} strokeWidth="2.6" />
      {/* stylized angular raven head */}
      <path d="M41.5 20.5 L29 27.5 L22.5 25 L27 34.5 L21 42.5 L33.5 41 L39 46.5 L38.5 34 L45.5 28.5 L36.5 27.5 Z"
        fill={gold} fillOpacity="0.16" stroke={gold} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="33.5" cy="30.2" r="1.35" fill={gold} />
    </svg>
  );
}

/* ─────── Section header ─────── */
export function PageHead({ icon: Icon, eyebrow, title, desc, actions }: {
  icon?: LucideIcon; eyebrow?: string; title: string; desc?: string; actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
      <div className="flex items-start gap-3.5 min-w-0">
        {Icon && (
          <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-charcoal text-gold shadow-[0_8px_20px_-8px_rgba(17,26,24,0.5)]">
            <Icon size={22} strokeWidth={1.8} />
          </div>
        )}
        <div className="min-w-0">
          {eyebrow && <div className="kpi-label mb-1 !text-green-deep">{eyebrow}</div>}
          <h1 className="text-[21px] md:text-[24px] leading-7 md:leading-8 font-black text-charcoal">{title}</h1>
          {desc && <p className="mt-1 text-[12px] text-charcoal/60 max-w-2xl leading-6">{desc}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ─────── Cards & KPIs ─────── */
export function KpiCard({ label, value, unit, delta, tone = 'default', icon: Icon, foot }: {
  label: string; value: string | number; unit?: string; delta?: number;
  tone?: 'default' | 'green' | 'gold' | 'red' | 'blue' | 'charcoal'; icon?: LucideIcon; foot?: ReactNode;
}) {
  const tones: Record<string, string> = {
    default: 'border-sand-soft', green: 'border-green/25 bg-gradient-to-br from-white to-green-mist',
    gold: 'border-gold/40 bg-gradient-to-br from-white to-gold-soft/50', red: 'border-red-200 bg-gradient-to-br from-white to-red-50/60',
    blue: 'border-deepblue/20 bg-gradient-to-br from-white to-blue-soft/50', charcoal: 'border-charcoal/15 bg-charcoal text-ivory',
  };
  const iconTones: Record<string, string> = {
    default: 'bg-sand-soft text-charcoal/70', green: 'bg-green-soft text-green-deep', gold: 'bg-gold-soft text-gold-deep',
    red: 'bg-red-100 text-red-600', blue: 'bg-blue-soft text-deepblue', charcoal: 'bg-gold text-charcoal',
  };
  const dark = tone === 'charcoal';
  return (
    <div className={`raven-card ${tones[tone]} p-4 flex flex-col gap-2 min-w-0`}>
      <div className="flex items-center justify-between gap-2">
        <span className={`kpi-label ${dark ? '!text-ivory/50' : ''}`}>{label}</span>
        {Icon && <span className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${iconTones[tone]}`}><Icon size={16} /></span>}
      </div>
      <div className="flex items-end gap-2 flex-wrap">
        <span className={`text-[26px] leading-7 font-black tracking-tight ${dark ? 'text-gold' : 'text-charcoal'}`}>{value}</span>
        {unit && <span className={`text-[11px] font-bold pb-0.5 ${dark ? 'text-ivory/60' : 'text-charcoal/50'}`}>{unit}</span>}
        {delta !== undefined && (
          <span className={`chip mb-0.5 ${delta >= 0 ? 'chip-green' : 'chip-red'}`}>
            {delta >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {delta >= 0 ? '+' : ''}{delta}%
          </span>
        )}
      </div>
      {foot && <div className={`text-[10.5px] leading-5 ${dark ? 'text-ivory/60' : 'text-charcoal/55'}`}>{foot}</div>}
    </div>
  );
}

export function CardTitle({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-3 border-b border-sand-soft/80">
      <div className="min-w-0">
        <h3 className="text-[13.5px] font-extrabold text-charcoal">{title}</h3>
        {sub && <p className="text-[10.5px] text-charcoal/55 mt-0.5">{sub}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function ProgressBar({ value, tone = 'green' }: { value: number; tone?: 'green' | 'gold' | 'blue' | 'red' }) {
  const c = { green: 'bg-green', gold: 'bg-gold', blue: 'bg-deepblue', red: 'bg-red-500' }[tone];
  return (
    <div className="h-1.5 w-full rounded-full bg-sand-soft overflow-hidden">
      <div className={`h-full rounded-full ${c} transition-all duration-700`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

/* ─────── Donut chart ─────── */
export function Donut({ value, size = 104, stroke = 12, color = '#08794F', track = '#EDE9DC', label }: {
  value: number; size?: number; stroke?: number; color?: string; track?: string; label?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (Math.min(100, Math.max(0, value)) / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[17px] font-black text-charcoal leading-5">{value}%</span>
        {label && <span className="text-[9px] font-bold text-charcoal/50 mt-0.5">{label}</span>}
      </div>
    </div>
  );
}

/* ─────── Trend chart (SVG line + area) ─────── */
export function TrendChart({ data, labels, height = 150, color = '#08794F', format = (v:number)=>String(v) }: {
  data: number[]; labels: string[]; height?: number; color?: string; format?: (v: number) => string;
}) {
  const w = 560, pad = 26;
  const min = Math.min(...data) - 1.5, max = Math.max(...data) + 1.5;
  const x = (i: number) => pad + (i * (w - pad * 2)) / (data.length - 1);
  const y = (v: number) => height - 22 - ((v - min) / (max - min)) * (height - 38);
  const pts = data.map((v, i) => `${x(i)},${y(v)}`);
  const area = `M${x(0)},${y(data[0])} ${data.map((v, i) => `L${x(i)},${y(v)}`).join(' ')} L${x(data.length-1)},${height - 14} L${x(0)},${height - 14} Z`;
  const line = `M${pts.join(' L')}`;
  const gid = useMemo(() => 'g' + Math.random().toString(36).slice(2, 8), []);
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${height}`} className="w-full" role="img">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.32" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map(t => (
          <line key={t} x1={pad} x2={w - pad} y1={height * t} y2={height * t} stroke="#EDE9DC" strokeWidth="1" strokeDasharray="3 5" />
        ))}
        <path d={area} fill={`url(#${gid})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
        {data.map((v, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(v)} r="3.4" fill="#fff" stroke={color} strokeWidth="2.2" />
            <text x={x(i)} y={y(v) - 9} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#111A18" fontFamily="Manrope">{format(v)}</text>
            <text x={x(i)} y={height - 2} textAnchor="middle" fontSize="10" fontWeight="700" fill="#8a8570">{labels[i]}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ─────── Bar chart ─────── */
export function Bars({ data, labels, color = '#15445A', height = 150 }: { data: number[]; labels: string[]; color?: string; height?: number }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-2 sm:gap-3 w-full" style={{ height }}>
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
          <span className="text-[10px] font-extrabold text-charcoal/70 font-en">{v}</span>
          <div className="w-full max-w-[46px] rounded-t-lg transition-all duration-700" style={{ height: `${(v / max) * (height - 44)}px`, background: `linear-gradient(180deg, ${color}, ${color}CC)` }} />
          <span className="text-[9.5px] font-bold text-charcoal/55 text-center leading-3 truncate w-full">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

/* ─────── Modal ─────── */
export function Modal({ open, onClose, title, sub, children, footer, wide }: {
  open: boolean; onClose: () => void; title: string; sub?: string; children: ReactNode; footer?: ReactNode; wide?: boolean;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-charcoal/55 backdrop-blur-[3px]" onClick={onClose} />
      <div className={`relative bg-ivory w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} sm:rounded-3xl rounded-t-3xl max-h-[92vh] flex flex-col shadow-2xl border border-sand-soft animate-[fadeUp_.3s_ease]`}>
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-3 border-b border-sand-soft">
          <div>
            <h3 className="text-[16px] font-black text-charcoal">{title}</h3>
            {sub && <p className="text-[11px] text-charcoal/55 mt-0.5 leading-5">{sub}</p>}
          </div>
          <button className="icon-btn !h-9 !w-9" onClick={onClose} aria-label="close"><X size={18} /></button>
        </div>
        <div className="px-6 py-4 overflow-y-auto scrollbar-thin">{children}</div>
        {footer && <div className="px-6 py-3.5 border-t border-sand-soft flex flex-wrap justify-end gap-2 bg-ivory/60 sm:rounded-b-3xl">{footer}</div>}
      </div>
      <style>{'@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}'}</style>
    </div>
  );
}

/* ─────── Toaster ─────── */
export interface Toast { id: number; msg: string; kind: 'success' | 'info' | 'error'; }
export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = (msg: string, kind: Toast['kind'] = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, msg, kind }]);
    window.setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4200);
  };
  return { toasts, push };
}
export function Toaster({ toasts }: { toasts: Toast[] }) {
  const { dir } = useLang();
  return (
    <div className={`fixed bottom-5 z-[60] flex flex-col gap-2 ${dir === 'rtl' ? 'left-5' : 'right-5'}`}>
      {toasts.map(t => (
        <div key={t.id} className="flex items-center gap-2.5 bg-charcoal text-ivory ps-3 pe-4 h-11 rounded-2xl shadow-xl border border-white/10 text-[12px] font-bold max-w-sm animate-[fadeUp_.3s_ease]">
          {t.kind === 'success' && <CheckCircle2 size={17} className="text-gold shrink-0" />}
          {t.kind === 'info' && <Info size={17} className="text-sand shrink-0" />}
          {t.kind === 'error' && <AlertTriangle size={17} className="text-red-400 shrink-0" />}
          <span className="leading-5">{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

/* ─────── Empty state ─────── */
export function EmptyState({ icon: Icon = Inbox, title, hint, action }: { icon?: LucideIcon; title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <div className="h-16 w-16 rounded-2xl bg-sand-soft flex items-center justify-center text-charcoal/40 mb-4"><Icon size={28} strokeWidth={1.6} /></div>
      <h4 className="text-[13.5px] font-extrabold text-charcoal">{title}</h4>
      {hint && <p className="text-[11.5px] text-charcoal/55 mt-1 max-w-sm leading-6">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ─────── Sample-data ribbon ─────── */
export function SampleBadge() {
  const { t } = useLang();
  return (
    <span className="chip chip-sand !h-5 !text-[9px] opacity-80" title={t('sampleData')}>
      <FileText size={9} /> {t('sampleData')}
    </span>
  );
}

/* ─────── Simple table helpers ─────── */
export function TableShell({ head, children, minWidth = 720 }: { head: ReactNode; children: ReactNode; minWidth?: number }) {
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full" style={{ minWidth }}>
        <thead>{head}</thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
export function StatusDot({ tone }: { tone: 'green' | 'gold' | 'red' | 'sand' | 'blue' }) {
  const c = { green: 'bg-green', gold: 'bg-gold', red: 'bg-red-500', sand: 'bg-sand', blue: 'bg-deepblue' }[tone];
  return <span className={`inline-block h-2 w-2 rounded-full ${c}`} />;
}

/* ─────── Fake "generating" button flow ─────── */
export function useAsyncAction(delay = 1400): [boolean, (fn?: () => void) => void] {
  const [busy, setBusy] = useState(false);
  const run = (fn?: () => void) => {
    if (busy) return;
    setBusy(true);
    window.setTimeout(() => { setBusy(false); fn?.(); }, delay);
  };
  return [busy, run];
}
export function BusyButton({ busy, onClick, className = 'btn btn-primary', children }: { busy: boolean; onClick: () => void; className?: string; children: ReactNode }) {
  return (
    <button className={className} onClick={onClick} disabled={busy}>
      {busy ? <Loader2 size={15} className="animate-spin" /> : null}
      {children}
    </button>
  );
}

export function ExportButton({ label }: { label: string }) {
  return <button className="btn btn-outline !h-8 !px-3 !text-[11px]"><Download size={13} /> {label}</button>;
}
export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <Search size={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-charcoal/40 pointer-events-none" />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="raven-input !ps-9 !h-9 !w-52 md:!w-64" aria-label={placeholder} />
    </div>
  );
}
