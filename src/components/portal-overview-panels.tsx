"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarDays, ClipboardCheck, FileCheck2, GraduationCap, HeartHandshake, ShieldCheck, UsersRound } from "lucide-react";
import { ArenaEmptyState, ArenaPanel } from "@/components/arena-visual-primitives";
import type { PortalId } from "@/lib/nav";
import { useLang } from "@/lib/i18n";

type PanelItem = { ar: string; en: string; to: string; icon: typeof CalendarDays; noteAr: string; noteEn: string };

const WORKSPACES: Partial<Record<Exclude<PortalId, "platform">, PanelItem[]>> = {
  principal: [
    { ar: "العمليات المدرسية", en: "School operations", to: "/principal/school-affairs", icon: ShieldCheck, noteAr: "مصدر بيانات العمليات غير متصل بعد.", noteEn: "School operations data is not connected yet." },
    { ar: "القرارات والتكليفات", en: "Decisions & assignments", to: "/principal/decision-center", icon: ClipboardCheck, noteAr: "لا توجد قرارات أو تكليفات تشغيلية معروضة في هذه النسخة.", noteEn: "No operational decisions or assignments are displayed in this build." },
    { ar: "الخطة التشغيلية", en: "Operational plan", to: "/principal/operational-plan", icon: CalendarDays, noteAr: "الخطة ومتابعتها تنتظران ربط مصادر البيانات المعتمدة.", noteEn: "The plan and its follow-up await approved data sources." },
    { ar: "الشواهد وقياس الأثر", en: "Evidence & impact", to: "/principal/impact", icon: FileCheck2, noteAr: "لا تُحتسب نتائج أو شواهد قبل ربط مصدر موثوق.", noteEn: "No outcomes or evidence are counted before a trusted source is connected." },
  ],
  teacher: [
    { ar: "جدولي وفصولي", en: "Timetable & classes", to: "/teacher/timetable", icon: CalendarDays, noteAr: "لا يوجد جدول أو فصول مرتبطة بحساب موثق بعد.", noteEn: "No timetable or classes are linked to a verified account yet." },
    { ar: "المهام والتكليفات", en: "Tasks & assignments", to: "/teacher/tasks", icon: ClipboardCheck, noteAr: "ستظهر المهام بعد ربط سجل التكليفات وصلاحيات المعلم.", noteEn: "Tasks will appear after the assignment service and teacher permissions are connected." },
    { ar: "الدرجات والتقييم", en: "Grades & assessment", to: "/teacher/grades", icon: GraduationCap, noteAr: "لا توجد درجات معروضة؛ يلزم مصدر معتمد ونطاق فصل مخوّل.", noteEn: "No grades are shown; an approved source and authorized class scope are required." },
    { ar: "الشواهد والإنجازات", en: "Evidence & achievements", to: "/teacher/achievements", icon: FileCheck2, noteAr: "رفع الشواهد غير متاح قبل تفعيل التخزين الآمن والمراجعة.", noteEn: "Evidence uploads remain unavailable until secure storage and review are enabled." },
  ],
  family: [
    { ar: "ملفات الأبناء", en: "Children profiles", to: "/family/children", icon: UsersRound, noteAr: "لا تظهر ملفات أبناء قبل التحقق الخادمي من علاقة ولي الأمر.", noteEn: "Children profiles remain hidden until guardian relationships are verified server-side." },
    { ar: "الحضور والغياب", en: "Attendance", to: "/family/attendance", icon: CalendarDays, noteAr: "بيانات الحضور لا تعرض دون ربط الطالب وولي الأمر والتحقق من النطاق.", noteEn: "Attendance stays hidden until the student, guardian, and access scope are verified." },
    { ar: "المستوى والواجبات", en: "Progress & homework", to: "/family/progress", icon: GraduationCap, noteAr: "لا توجد نتائج أو واجبات تجريبية في هذه الواجهة.", noteEn: "No sample results or homework are shown in this workspace." },
    { ar: "التواصل مع المدرسة", en: "School communication", to: "/family/contact", icon: HeartHandshake, noteAr: "قنوات التواصل تنتظر ربط خدمة الرسائل المعتمدة.", noteEn: "Communication channels await the approved messaging service." },
  ],
};

export function PortalOverviewPanels({ portal }: { portal: PortalId }) {
  const { isAr } = useLang();
  const [query, setQuery] = useState("");
  if (portal === "platform") return null;
  const items = WORKSPACES[portal] ?? [];
  const filtered = items.filter(item => `${item.ar} ${item.en} ${item.noteAr} ${item.noteEn}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  return (
    <section className="mb-8" aria-labelledby="portal-workspace-heading">
      <div className="mb-3">
        <h2 id="portal-workspace-heading" className="text-lg font-black text-[#111A18]">
          {isAr ? "مساحة العمل الرئيسية" : "Primary workspace"}
        </h2>
        <p className="mt-1 text-xs leading-6 text-[#66736e]">
          {isAr ? "أقسام العمل المرتبطة بدور البوابة، دون سجلات أو مؤشرات افتراضية." : "Role-aligned work areas without seeded records or fabricated metrics."}
        </p>
      </div>
      <label className="mb-4 block max-w-lg text-xs font-bold text-[#53615b]">
        <span className="mb-2 block">{isAr ? "البحث في مساحات العمل" : "Search workspaces"}</span>
        <input value={query} onChange={event => setQuery(event.target.value)} type="search" aria-label={isAr ? "البحث في مساحات العمل" : "Search workspaces"} placeholder={isAr ? "ابحث باسم القسم أو وصفه..." : "Search by section or description..."} className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#08794F]" />
      </label>
      {filtered.length === 0 && <p role="status" className="mb-4 rounded-xl border border-black/10 bg-white p-4 text-sm text-[#53615b]">{isAr ? "لا توجد مساحات عمل مطابقة للبحث." : "No workspaces match your search."}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map(({ ar, en, to, icon: Icon, noteAr, noteEn }) => (
          <ArenaPanel key={to} title={isAr ? ar : en} description={isAr ? noteAr : noteEn}>
            <div className="flex items-center justify-between gap-3">
              <ArenaEmptyState
                title={isAr ? "بانتظار اتصال المصدر" : "Awaiting source connection"}
                description={isAr ? "لم تُحمّل سجلات أو بيانات تجريبية." : "No records or demo data have been loaded."}
              />
            </div>
            <div className="mt-3 flex justify-end">
              <Link href={to} className="text-xs font-extrabold text-[#08794F] hover:underline">
                {isAr ? "فتح القسم" : "Open section"}
              </Link>
            </div>
          </ArenaPanel>
        ))}
      </div>
    </section>
  );
}
