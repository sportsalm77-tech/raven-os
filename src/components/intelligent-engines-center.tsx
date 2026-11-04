"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CircleDot, Cpu, LockKeyhole, Search } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { RAVEN_ENGINE_GROUPS, RAVEN_ENGINE_REGISTRY, type EngineDomain } from "@/lib/raven-engines";

const STATUS_AR: Record<string,string> = { architecture:"تصميم معماري", ui_scaffold:"هيكل واجهة", backend_pending:"بانتظار الخدمات الخلفية", connected:"متصل", verified:"تم التحقق" };
const STATUS_EN: Record<string,string> = { architecture:"Architecture", ui_scaffold:"UI scaffold", backend_pending:"Backend pending", connected:"Connected", verified:"Verified" };

export function IntelligentEnginesCenter() {
  const { isAr } = useLang();
  const [query,setQuery] = useState("");
  const [selected,setSelected] = useState<EngineDomain | "all">("all");
  const engines = useMemo(() => RAVEN_ENGINE_REGISTRY.filter(engine => {
    const text = [engine.nameAr,engine.nameEn,engine.purposeAr,engine.purposeEn,...engine.capabilitiesAr,...engine.capabilitiesEn].join(" ").toLowerCase();
    return (selected === "all" || engine.domain === selected) && (!query.trim() || text.includes(query.trim().toLowerCase()));
  }),[query,selected]);
  const ready = RAVEN_ENGINE_REGISTRY.filter(engine => engine.status === "connected" || engine.status === "verified").length;
  return <main className="space-y-6">
    <header className="rounded-3xl bg-[#111A18] p-6 text-white md:p-8">
      <div className="mb-3 flex items-center gap-2 text-xs font-extrabold tracking-widest text-[#D4AF37]"><Cpu size={16}/> RAVEN OS · ENGINE CONTROL</div>
      <h1 className="text-2xl font-black md:text-3xl">{isAr?"مركز المحركات الذكية":"Intelligent Engines Center"}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">{isAr?"السجل المركزي للمحركات الخمسة عشر في رافين. يعرض مسؤولية كل محرك ومصادره ومخرجاته ومتطلبات تفعيله، دون الإيحاء بأن الخدمات غير المنفذة تعمل.":"The central registry of Raven’s fifteen engines, their responsibilities, sources, outputs, and activation gates—without implying unimplemented services are live."}</p>
    </header>
    <section className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-2xl border border-black/10 bg-white p-4"><span className="text-xs text-[#66736e]">{isAr?"إجمالي المحركات":"Total engines"}</span><strong className="mt-2 block text-3xl font-black text-[#111A18] tabular-nums">{RAVEN_ENGINE_REGISTRY.length}</strong></div>
      <div className="rounded-2xl border border-black/10 bg-white p-4"><span className="text-xs text-[#66736e]">{isAr?"المجالات المعمارية":"Architecture domains"}</span><strong className="mt-2 block text-3xl font-black text-[#111A18] tabular-nums">{RAVEN_ENGINE_GROUPS.length}</strong></div>
      <div className="rounded-2xl border border-black/10 bg-white p-4"><span className="text-xs text-[#66736e]">{isAr?"متصل ومتحقق":"Connected & verified"}</span><strong className="mt-2 block text-3xl font-black text-[#111A18] tabular-nums">{ready}</strong><span className="mt-1 block text-[11px] text-[#66736e]">{isAr?"لا توجد اتصالات مثبتة بعد":"No verified connections yet"}</span></div>
    </section>
    <section className="rounded-2xl border border-amber-300/60 bg-amber-50 p-4 text-sm leading-7 text-amber-950">
      <div className="flex items-center gap-2 font-bold"><LockKeyhole size={17}/>{isAr?"حالة التنفيذ الحالية":"Current implementation state"}</div>
      <p className="mt-1">{isAr?"هذه لوحة سجل معماري. تعريف المحركات محفوظ في الكود، لكن لا توجد خدمات خلفية أو تكاملات خارجية مفعّلة أو مختبرة ضمن هذه الدفعة.":"This is an architecture registry UI. Engine definitions are stored in code; backend services and external integrations are not activated or tested in this delivery."}</p>
    </section>
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3"><h2 className="text-base font-black text-[#111A18]">{isAr?"طبقة الأساس المشتركة":"Shared foundation layer"}</h2><span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-900">{isAr?"تأسيس برمجي · بانتظار الربط":"Code foundation · integration pending"}</span></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-black/10 bg-white p-4"><LockKeyhole size={18} className="mb-2 text-[#08794F]"/><h3 className="text-sm font-bold text-[#111A18]">{isAr?"الحوكمة والصلاحيات":"Governance & access"}</h3><p className="mt-1 text-xs leading-5 text-[#66736e]">{isAr?"سياسات أدوار وعزل نطاق المدرسة مع الرفض الافتراضي.":"Role policy and school-scope checks with fail-closed defaults."}</p><span className="mt-3 inline-block text-[10px] font-bold text-amber-800">{isAr?"تحتاج مزود هوية":"Identity provider pending"}</span></article>
        <article className="rounded-xl border border-black/10 bg-white p-4"><CheckCircle2 size={18} className="mb-2 text-[#08794F]"/><h3 className="text-sm font-bold text-[#111A18]">{isAr?"عقود المحركات":"Engine contracts"}</h3><p className="mt-1 text-xs leading-5 text-[#66736e]">{isAr?"غلاف طلب ونتيجة موحد بإصدار 1.0.0 والتحقق من المدخلات.":"Versioned 1.0.0 request/result envelopes and input validation."}</p><span className="mt-3 inline-block text-[10px] font-bold text-[#08794F]">{isAr?"تم حفظ الأساس":"Foundation saved"}</span></article>
        <article className="rounded-xl border border-black/10 bg-white p-4"><CircleDot size={18} className="mb-2 text-[#08794F]"/><h3 className="text-sm font-bold text-[#111A18]">{isAr?"سجل التدقيق":"Audit trail"}</h3><p className="mt-1 text-xs leading-5 text-[#66736e]">{isAr?"بنية أحداث موحدة وحدّ إلزامي لمخزن تدقيق دائم.":"Typed audit events with a required durable persistence boundary."}</p><span className="mt-3 inline-block text-[10px] font-bold text-amber-800">{isAr?"مخزن دائم غير موصول":"Durable sink pending"}</span></article>
        <article className="rounded-xl border border-black/10 bg-white p-4"><Cpu size={18} className="mb-2 text-[#08794F]"/><h3 className="text-sm font-bold text-[#111A18]">{isAr?"موجّه تنفيذ المحركات":"Engine dispatcher"}</h3><p className="mt-1 text-xs leading-5 text-[#66736e]">{isAr?"لا ينفذ عملية دون معالج خادمي مسجل وصلاحية صحيحة.":"No operation runs without a registered server handler and authorization."}</p><span className="mt-3 inline-block text-[10px] font-bold text-[#08794F]">{isAr?"رفض افتراضي":"Deny by default"}</span></article>
      </div>
    </section>
    <section className="rounded-2xl border border-[#08794F]/20 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-black text-[#111A18]">{isAr?"تقدم تأسيس المحركات التشغيلية الأولى":"First five operational engines foundation"}</h2><span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-800">{isAr?"عقود المجال محفوظة":"Domain contracts saved"}</span></div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {[
          {n:"01",ar:"البيانات المدرسية",en:"School data",dAr:"دفعات الاستيراد والمصدر والمراجعة",dEn:"Import batches, provenance, review"},
          {n:"02",ar:"القرارات والتكليفات",en:"Decisions & assignments",dAr:"دورة الاعتماد والإغلاق",dEn:"Approval and closure lifecycle"},
          {n:"03",ar:"سير العمل والمتابعة",en:"Workflow & follow-up",dAr:"المراحل والتعثر والتأخير",dEn:"Stages, blockers, overdue checks"},
          {n:"04",ar:"الأدلة والتوثيق والأثر",en:"Evidence & impact",dAr:"المصدر والمراجعة والربط",dEn:"Provenance, review, linkage"},
          {n:"05",ar:"الخطط التشغيلية",en:"Operational plans",dAr:"الإصدارات والنسخ المعتمدة",dEn:"Versioning and approved baselines"}
        ].map(item=><div key={item.n} className="rounded-xl border border-black/10 bg-[#F5F3EC]/60 p-3"><span className="text-xs font-black text-[#08794F]">{item.n}</span><h3 className="mt-1 text-xs font-bold text-[#111A18]">{isAr?item.ar:item.en}</h3><p className="mt-1 text-[10px] leading-5 text-[#66736e]">{isAr?item.dAr:item.dEn}</p></div>)}
      </div>
      <p className="mt-3 text-xs leading-6 text-[#66736e]">{isAr?"تم حفظ قواعد المجال وانتقالات الحالات وحدود المعاملات. مستودعات البيانات والهوية ومخزن التدقيق الدائم غير موصولة؛ لذلك لا توجد عمليات حفظ فعلية مفعّلة.":"Domain models, lifecycle transitions, and transaction boundaries are saved. Data repositories, identity, and durable audit storage are not connected, so live writes remain disabled."}</p>
    </section>
    <section className="flex flex-col gap-3 md:flex-row">
      <label className="relative flex-1"><Search size={17} className="absolute start-3 top-1/2 -translate-y-1/2 text-[#66736e]"/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder={isAr?"ابحث عن محرك أو وظيفة...":"Search engines or capabilities..."} className="w-full rounded-xl border border-black/10 bg-white py-3 pe-4 ps-10 text-sm outline-none focus:border-[#08794F]"/></label>
      <select value={selected} onChange={event=>setSelected(event.target.value as EngineDomain | "all")} className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#08794F]">
        <option value="all">{isAr?"كل المجالات":"All domains"}</option>
        {RAVEN_ENGINE_GROUPS.map(group=><option key={group.id} value={group.id}>{isAr?group.nameAr:group.nameEn}</option>)}
      </select>
    </section>
    <div className="space-y-8">
      {RAVEN_ENGINE_GROUPS.map(group=>{
        const items=engines.filter(engine=>engine.domain===group.id);
        if(!items.length) return null;
        return <section key={group.id}>
          <div className="mb-3 flex items-center gap-3"><h2 className="text-base font-black text-[#08794F]">{isAr?group.nameAr:group.nameEn}</h2><span className="h-px flex-1 bg-black/10"/><span className="text-xs text-[#66736e]">{items.length}</span></div>
          <div className="grid gap-3 xl:grid-cols-2">
            {items.map(engine=><article key={engine.id} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#08794F]/10 text-sm font-black text-[#08794F]">{String(engine.number).padStart(2,"0")}</span><div><h3 className="font-black leading-6 text-[#111A18]">{isAr?engine.nameAr:engine.nameEn}</h3><p className="mt-1 text-xs leading-6 text-[#66736e]">{isAr?engine.purposeAr:engine.purposeEn}</p></div></div>
                <span className="shrink-0 rounded-full border border-black/10 bg-[#F5F3EC] px-2.5 py-1 text-[10px] font-bold text-[#66736e]">{isAr?STATUS_AR[engine.status]:STATUS_EN[engine.status]}</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div><h4 className="mb-2 text-xs font-bold text-[#111A18]">{isAr?"المهام":"Capabilities"}</h4><ul className="space-y-1.5">{(isAr?engine.capabilitiesAr:engine.capabilitiesEn).map(item=><li key={item} className="flex gap-2 text-xs leading-5 text-[#53615b]"><CircleDot size={12} className="mt-1 shrink-0 text-[#08794F]"/>{item}</li>)}</ul></div>
                <div><h4 className="mb-2 text-xs font-bold text-[#111A18]">{isAr?"متطلبات التفعيل":"Activation gates"}</h4><ul className="space-y-1.5">{engine.activationGates.map(item=><li key={item} className="flex gap-2 text-xs leading-5 text-[#53615b]"><LockKeyhole size={12} className="mt-1 shrink-0 text-[#9A7A24]"/>{item}</li>)}</ul></div>
              </div>
              <div className="mt-4 border-t border-black/5 pt-3 text-[11px] leading-5 text-[#66736e]">
                <div><strong>{isAr?"المصادر: ":"Sources: "}</strong>{engine.dataSources.join(" · ")}</div>
                <div className="mt-1"><strong>{isAr?"المخرجات: ":"Outputs: "}</strong>{engine.outputs.join(" · ")}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {engine.externalConnection&&<span className="rounded-full bg-blue-50 px-2 py-1 text-blue-800">{isAr?"يتطلب تكاملًا خارجيًا":"External integration"}</span>}
                  {engine.humanApprovalRequired&&<span className="rounded-full bg-amber-50 px-2 py-1 text-amber-900">{isAr?"اعتماد بشري مطلوب":"Human approval required"}</span>}
                </div>
              </div>
            </article>)}
          </div>
        </section>;
      })}
      {!engines.length&&<div className="rounded-2xl border border-dashed border-black/20 bg-white p-8 text-center text-sm text-[#66736e]">{isAr?"لا توجد نتائج مطابقة.":"No matching engines."}</div>}
    </div>
    <footer className="flex items-center justify-between gap-3 rounded-2xl bg-[#F5F3EC] p-4 text-xs text-[#66736e]"><span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-[#08794F]"/>{isAr?"مصدر البيانات: سجل المحركات المركزي":"Source: central engine registry"}</span><span>{isAr?"الإصدار":"Version"} { "1.0.0" }</span></footer>
  </main>;
}
