"use client";

import { useState, type FormEvent } from "react";
import { CircleAlert, FileEdit, LockKeyhole } from "lucide-react";

type DraftKind = "lesson-plans" | "homework" | "achievements";

const COPY = {
  "lesson-plans": {
    title: "مسودة تحضير درس",
    titleEn: "Lesson preparation draft",
    fields: [
      ["عنوان الدرس", "Lesson title", "text"],
      ["نواتج التعلم", "Learning outcomes", "textarea"],
      ["الاستراتيجيات والأنشطة", "Strategies and activities", "textarea"],
      ["أداة التقويم", "Assessment method", "text"],
    ],
    submit: "معاينة المسودة محليًا",
    submitEn: "Preview local draft",
  },
  homework: {
    title: "مسودة واجب أو نشاط",
    titleEn: "Homework or activity draft",
    fields: [
      ["عنوان المهمة", "Task title", "text"],
      ["التعليمات والأهداف", "Instructions and objectives", "textarea"],
      ["الموعد المقترح (اختياري)", "Proposed due date (optional)", "text"],
      ["معايير التقييم", "Assessment criteria", "textarea"],
    ],
    submit: "معاينة المسودة محليًا",
    submitEn: "Preview local draft",
  },
  achievements: {
    title: "بطاقة وصف شاهد",
    titleEn: "Evidence description card",
    fields: [
      ["عنوان الشاهد", "Evidence title", "text"],
      ["المجال أو المؤشر المرتبط", "Related domain or indicator", "text"],
      ["المصدر والتاريخ", "Source and date", "text"],
      ["وصف الشاهد", "Evidence description", "textarea"],
    ],
    submit: "معاينة بطاقة الشاهد",
    submitEn: "Preview evidence card",
  },
} as const;

export function TeacherLocalDraft({ kind, isAr }: { kind: DraftKind; isAr: boolean }) {
  const config = COPY[kind];
  const [values, setValues] = useState<string[]>(config.fields.map(() => ""));
  const [preview, setPreview] = useState<string[] | null>(null);
  const [error, setError] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!values[0].trim() || !values[1].trim()) {
      setError(true);
      setPreview(null);
      return;
    }
    setError(false);
    setPreview(values);
  }

  return (
    <section className="rounded-2xl border border-[#08794F]/20 bg-white p-5 md:p-6">
      <div className="mb-2 flex items-center gap-2">
        <FileEdit size={18} className="text-[#08794F]" />
        <h2 className="text-sm font-black text-[#111A18]">{isAr ? config.title : config.titleEn}</h2>
      </div>
      <p className="mb-4 text-xs leading-6 text-[#66736e]">
        {isAr
          ? "يمكنك إعداد مسودة عمل ومعاينتها داخل هذه الجلسة. لا تُرسل إلى المدرسة ولا تُحفظ في قاعدة بيانات أو مكتبة رافين، وتُفقد عند تحديث الصفحة."
          : "Prepare and preview a working draft in this browser session. It is not sent to the school or saved to a database or Raven Library, and is lost when the page reloads."}
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        {config.fields.map(([labelAr, labelEn, type], index) => (
          <label key={labelEn} className="block text-xs font-bold text-[#26342f]">
            {isAr ? labelAr : labelEn}
            {type === "textarea" ? (
              <textarea
                value={values[index]}
                onChange={(event) => {
                  setValues((current) => current.map((value, i) => i === index ? event.target.value : value));
                  setPreview(null);
                }}
                rows={3}
                className="mt-1.5 w-full rounded-xl border border-black/15 bg-[#FCFCFA] px-3 py-2 text-sm font-normal outline-none focus:border-[#08794F]"
              />
            ) : (
              <input
                value={values[index]}
                onChange={(event) => {
                  setValues((current) => current.map((value, i) => i === index ? event.target.value : value));
                  setPreview(null);
                }}
                className="mt-1.5 w-full rounded-xl border border-black/15 bg-[#FCFCFA] px-3 py-2 text-sm font-normal outline-none focus:border-[#08794F]"
              />
            )}
          </label>
        ))}
        {error && (
          <p role="alert" className="text-xs font-bold text-red-700">
            {isAr ? "أكمل الحقلين الأول والثاني قبل المعاينة." : "Complete the first two fields before previewing."}
          </p>
        )}
        <button type="submit" className="rounded-xl bg-[#08794F] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#066541]">
          {isAr ? config.submit : config.submitEn}
        </button>
      </form>
      {preview && (
        <div className="mt-4 rounded-xl border border-[#08794F]/20 bg-[#F5F3EC] p-4" aria-live="polite">
          <div className="mb-2 flex items-center gap-2 text-xs font-black text-[#08794F]">
            <CircleAlert size={15} />
            {isAr ? "معاينة مؤقتة — غير محفوظة" : "Temporary preview — not saved"}
          </div>
          <dl className="space-y-2">
            {config.fields.map(([labelAr, labelEn], index) => preview[index].trim() ? (
              <div key={labelEn}>
                <dt className="text-[11px] font-bold text-[#66736e]">{isAr ? labelAr : labelEn}</dt>
                <dd className="whitespace-pre-wrap text-sm leading-6 text-[#26342f]">{preview[index]}</dd>
              </div>
            ) : null)}
          </dl>
        </div>
      )}
      <div className="mt-4 flex items-start gap-2 border-t border-black/5 pt-3 text-[11px] leading-5 text-[#66736e]">
        <LockKeyhole size={14} className="mt-0.5 shrink-0" />
        <span>{isAr
          ? "لا يوجد حفظ دائم أو نشر أو اعتماد أو رفع ملفات في هذه المرحلة."
          : "Persistent save, publishing, approval, and file upload are not available in this phase."}</span>
      </div>
    </section>
  );
}
