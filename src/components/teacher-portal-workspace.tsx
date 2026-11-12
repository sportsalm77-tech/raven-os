"use client";

import Link from "next/link";
import {
  ArrowLeft, ArrowRight, BookOpenCheck, CalendarDays, CheckCircle2, ClipboardCheck,
  FileText, GraduationCap, LockKeyhole, ShieldCheck, CircleAlert,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import { PORTAL_NAVS } from "@/lib/nav";
import { TeacherLocalDraft } from "@/components/teacher-local-draft";

type SectionDetail = {
  purposeAr: string;
  purposeEn: string;
  stepsAr: string[];
  stepsEn: string[];
  inputsAr: string[];
  inputsEn: string[];
  boundaryAr: string;
  boundaryEn: string;
};

const SECTION_DETAILS: Record<string, SectionDetail> = {
  timetable: {
    purposeAr: "عرض الجدول المعتمد للمعلم وحصصه ومواقعه وتعديلاته بعد ورودها من مصدر المدرسة.",
    purposeEn: "Show the teacher's approved timetable, periods, locations, and changes from the school source.",
    stepsAr: ["التحقق من هوية المعلم والعضوية المدرسية", "جلب الجدول المعتمد للفترة الدراسية", "عرض اليوم والأسبوع والحصة والفصل والموقع", "إظهار مصدر التحديث وتعارضات الجدول عند ورودها"],
    stepsEn: ["Verify teacher identity and school membership", "Retrieve the approved timetable for the term", "Show day, week, period, class, and location", "Display update source and timetable conflicts when supplied"],
    inputsAr: ["هوية المعلم الموثقة", "الجدول المدرسي المعتمد", "إسناد الحصص والفصول والمرافق"],
    inputsEn: ["Verified teacher identity", "Approved school timetable", "Assigned periods, classes, and rooms"],
    boundaryAr: "لا يُنشأ جدول أو توقيت افتراضي، ولا يُعد اختيار المعلم في الواجهة إثباتًا لهويته أو إسناده.",
    boundaryEn: "No sample timetable or times are created. A UI selection does not prove identity or assignment.",
  },
  tasks: {
    purposeAr: "تجميع التكليفات المسندة للمعلم ومواعيدها ومتطلباتها وشواهد تنفيذها وملاحظات المراجعة.",
    purposeEn: "Organize teacher assignments, deadlines, requirements, execution evidence, and review feedback.",
    stepsAr: ["جلب التكليفات المسندة للمعلم فقط", "مراجعة الجهة المالكة والمتطلبات والموعد", "تنفيذ العمل وربط الشواهد ذات الصلة", "إرسال الإنجاز لمسار المراجعة بعد تفعيل الخدمة"],
    stepsEn: ["Retrieve only assignments addressed to the teacher", "Review owner, requirements, and due date", "Complete the work and link relevant evidence", "Submit for review when the service is enabled"],
    inputsAr: ["التكليف المعتمد", "الجهة المسندة والموعد", "متطلبات الإنجاز والشواهد"],
    inputsEn: ["Approved assignment", "Assigning authority and due date", "Completion requirements and evidence"],
    boundaryAr: "لا توجد مهام أو مواعيد افتراضية، ولا يمكن تغيير حالة التكليف أو إشعار الإدارة قبل اتصال خدمة التكليفات.",
    boundaryEn: "No sample tasks or deadlines are shown. Assignment state and notifications cannot change before the assignment service is connected.",
  },
  "lesson-plans": {
    purposeAr: "إعداد التحضير والخطط الدراسية وفق المنهج والصف والفصل الدراسي والجدول المعتمد.",
    purposeEn: "Prepare lesson plans against the approved curriculum, grade, term, and timetable.",
    stepsAr: ["اختيار المقرر والوحدة والدرس من المنهج المعتمد", "تحديد نواتج التعلم والاستراتيجيات", "إعداد الأنشطة وأدوات التقويم ومراعاة الفروق", "مراجعة التحضير وإحالته للاعتماد عند تفعيل المسار"],
    stepsEn: ["Select course, unit, and lesson from the approved curriculum", "Define learning outcomes and strategies", "Prepare activities and assessment tools with differentiation", "Review and submit for approval when the workflow is enabled"],
    inputsAr: ["المنهج والخطة الزمنية", "المقرر والصف والفصل", "قوالب التحضير المعتمدة"],
    inputsEn: ["Curriculum and pacing plan", "Course, grade, and class", "Approved lesson-plan templates"],
    boundaryAr: "لا تُعرض خطط دروس أو حالات اعتماد تجريبية، ولا يُدّعى حفظ المسودة دون مخزن دائم متصل.",
    boundaryEn: "No sample lesson plans or approval states are shown. Drafts are not claimed as saved without connected persistent storage.",
  },
  classes: {
    purposeAr: "عرض الفصول والطلاب المسندة للمعلم فقط، مع إظهار المعلومات اللازمة لأداء مهامه التعليمية.",
    purposeEn: "Show only classes and students assigned to the teacher, limited to information needed for teaching duties.",
    stepsAr: ["التحقق الخادمي من عضوية المدرسة وإسناد الفصل", "جلب الفصول الواقعة ضمن نطاق المعلم", "عرض بيانات الفصل المصرح بها", "منع الوصول إلى أي فصل أو طالب خارج نطاق الإسناد"],
    stepsEn: ["Verify school membership and class assignment server-side", "Retrieve classes within the teacher's scope", "Show authorized class information", "Deny access to every class or student outside the assignment scope"],
    inputsAr: ["هوية المعلم", "عضوية المدرسة وschool_id", "سجل إسناد الفصول"],
    inputsEn: ["Teacher identity", "School membership and school_id", "Class assignment records"],
    boundaryAr: "لا تُعرض أسماء طلاب أو أعداد فصول قبل التحقق الخادمي من الإسناد. عزل المدرسة والفصل شرط في كل طلب.",
    boundaryEn: "Student names and class counts remain hidden until assignments are verified server-side. School and class isolation apply to every request.",
  },
  attendance: {
    purposeAr: "رصد حضور وغياب طلاب الفصول المسندة وفق اليوم والحصة والجدول وصلاحية المعلم.",
    purposeEn: "Record attendance for assigned classes by date and period under the teacher's approved scope.",
    stepsAr: ["التحقق من المعلم والفصل والحصة", "جلب قائمة الطلاب المصرح بها", "تحديد حالات الحضور والغياب والتأخر", "مراجعة الرصد وإرساله لمسار اعتماد المدرسة"],
    stepsEn: ["Verify teacher, class, and period", "Retrieve the authorized student roster", "Record present, absent, and late states", "Review and submit through the school's approval workflow"],
    inputsAr: ["قائمة طلاب موثوقة", "الجدول والحصة", "سياسة الحضور والصلاحيات"],
    inputsEn: ["Trusted student roster", "Timetable and period", "Attendance policy and permissions"],
    boundaryAr: "لا تظهر أسماء أو سجلات حضور قبل الربط والتحقق. لا إرسال تلقائي للأسرة ولا اعتماد شكلي.",
    boundaryEn: "Names and attendance records remain hidden until connected and verified. No automatic family dispatch or decorative approval state.",
  },
  grades: {
    purposeAr: "إدخال ومراجعة درجات التقييمات ضمن المقرر والفصل المسند ومسار اعتماد المدرسة.",
    purposeEn: "Enter and review assessment grades within assigned courses, classes, and school approval rules.",
    stepsAr: ["اختيار الفصل والمقرر والتقييم المعتمد", "جلب سجل الطلاب المصرح به", "إدخال الدرجات والتحقق من الحدود والاكتمال", "مراجعة السجل وإحالته للاعتماد مع حفظ الأثر"],
    stepsEn: ["Select the approved class, course, and assessment", "Retrieve the authorized student register", "Enter grades and validate limits and completeness", "Review and submit for approval with an audit trail"],
    inputsAr: ["سلم التقييم المعتمد", "قائمة الطلاب", "المقرر والفصل والتقييم"],
    inputsEn: ["Approved assessment scale", "Student roster", "Course, class, and assessment"],
    boundaryAr: "لا تُعرض درجات أو متوسطات افتراضية. لا تُقفل النتائج أو تُرسل للاعتماد دون خدمة حفظ وصلاحيات خادمية.",
    boundaryEn: "No sample grades or averages are displayed. Results are not locked or submitted without persistent storage and server-side authorization.",
  },
  exams: {
    purposeAr: "تنظيم مهام المعلم المتعلقة بالاختبارات وفق جدول المدرسة وتكليفات اللجان وضوابط الرصد والتصحيح.",
    purposeEn: "Organize teacher exam duties under the school schedule, committee assignments, and grading controls.",
    stepsAr: ["عرض الاختبارات والفترات المعتمدة", "التحقق من مهام المعلم واللجان المسندة", "مراجعة ضوابط إعداد الأسئلة والرصد والتصحيح", "متابعة التسليم والملاحظات والاعتماد"],
    stepsEn: ["Show approved exams and periods", "Verify teacher and committee assignments", "Review question, grading, and marking controls", "Track submission, feedback, and approval"],
    inputsAr: ["جدول الاختبارات", "تكليفات اللجان", "سياسة الاختبارات وسلالم التصحيح"],
    inputsEn: ["Exam timetable", "Committee assignments", "Exam policy and marking rubrics"],
    boundaryAr: "لا تُعرض اختبارات أو أوراق أو مواعيد مصطنعة، ولا تُمنح صلاحية الكنترول من بوابة المعلم.",
    boundaryEn: "No fabricated exams, papers, or dates are shown. The teacher portal does not grant exam-control privileges.",
  },
  homework: {
    purposeAr: "إعداد الواجبات والأنشطة للفصول المسندة ومتابعة التسليم والتقييم والتغذية الراجعة.",
    purposeEn: "Prepare homework and activities for assigned classes and track submissions, assessment, and feedback.",
    stepsAr: ["إعداد وصف المهمة وأهدافها وموعدها", "التحقق من الفصل والجمهور المصرح", "نشر المهمة عبر قناة متصلة ومعتمدة", "متابعة التسليم والتقييم وإعادة التغذية الراجعة"],
    stepsEn: ["Prepare task description, objectives, and due date", "Verify class and authorized audience", "Publish through an approved connected channel", "Track submissions, assessment, and feedback"],
    inputsAr: ["الفصل والمقرر", "وصف المهمة وموعد التسليم", "قناة نشر وتكليف موثوقة"],
    inputsEn: ["Class and course", "Task description and due date", "Trusted assignment and publishing service"],
    boundaryAr: "لا قوائم تسليم أو نسب إنجاز افتراضية، ولا نشر أو إشعار للطلاب والأسرة قبل اتصال القناة.",
    boundaryEn: "No sample submissions or completion rates. No publishing or student/family notifications before the channel is connected.",
  },
  behavior: {
    purposeAr: "توثيق ملاحظات السلوك والمواظبة بموضوعية ضمن الفصول المسندة وسياسة المدرسة.",
    purposeEn: "Document behavior and conduct observations objectively within assigned classes and school policy.",
    stepsAr: ["التحقق من الفصل وصلاحية المعلم", "تحديد نوع الملاحظة ومصدرها وتاريخها", "صياغة وصف موضوعي بأقل قدر من البيانات", "إحالة الحالة للمسار المخول ومتابعة الإجراء"],
    stepsEn: ["Verify class and teacher permission", "Select observation type, source, and date", "Write an objective description with minimal data", "Refer the case to the authorized workflow and track action"],
    inputsAr: ["سياسة السلوك والمواظبة", "الفصل والطالب المصرح به", "مصدر الملاحظة وتاريخها"],
    inputsEn: ["Behavior and conduct policy", "Authorized class and student", "Observation source and date"],
    boundaryAr: "تُحمى بيانات الطلاب الحساسة، ولا تُعرض حالات أو مخالفات افتراضية أو تسمح الواجهة بتجاوز صلاحية الإحالة.",
    boundaryEn: "Sensitive student information is protected. No sample incidents are shown and the UI cannot bypass referral permissions.",
  },
  achievements: {
    purposeAr: "تنظيم شواهد أداء المعلم وربط كل شاهد بالمجال أو التكليف أو المؤشر ذي الصلة.",
    purposeEn: "Organize teacher evidence and link each item to its relevant domain, assignment, or indicator.",
    stepsAr: ["تحديد المجال أو المؤشر المستهدف", "إرفاق الشاهد ووصفه ومصدره وتاريخه", "مراجعة الجودة والخصوصية وحقوق النشر", "ربطه بملف الإنجاز بعد حفظه واعتماده"],
    stepsEn: ["Select the target domain or indicator", "Attach evidence with description, source, and date", "Review quality, privacy, and usage rights", "Link it to the portfolio after persistence and approval"],
    inputsAr: ["ملف أو رابط الشاهد", "المجال أو المؤشر", "بيانات المصدر والتاريخ"],
    inputsEn: ["Evidence file or link", "Domain or indicator", "Source and date details"],
    boundaryAr: "لا يُدّعى رفع ملف أو أرشفته قبل وجود تخزين دائم وفحص نوع الملف وصلاحية الوصول.",
    boundaryEn: "No upload or archive is claimed before persistent storage, file validation, and access control exist.",
  },
  library: {
    purposeAr: "إتاحة ملفات ونماذج ومراجع رافين التي يسمح بها دور المعلم ونطاق مدرسته.",
    purposeEn: "Provide Raven files, templates, and references permitted by the teacher role and school scope.",
    stepsAr: ["التحقق من هوية المعلم ونطاق المدرسة", "استعراض الملفات المصرح بها وتصنيفها", "التحقق من صلاحية الملف وإصداره وحداثته", "فتح الملف أو إرفاقه وفق سياسة الوصول"],
    stepsEn: ["Verify teacher identity and school scope", "Browse authorized files and categories", "Validate file access, version, and freshness", "Open or attach files under the access policy"],
    inputsAr: ["فهرس مكتبة رافين", "تصنيفات الملفات وإصداراتها", "سياسة الوصول والتنزيل"],
    inputsEn: ["Raven Library index", "File categories and versions", "Access and download policy"],
    boundaryAr: "مكتبة رافين خدمة أصلية داخل المنصة؛ لا تُعرض ملفات أو روابط أو صلاحيات تنزيل افتراضية.",
    boundaryEn: "Raven Library is a native platform service. No sample files, links, or download permissions are displayed.",
  },
  notices: {
    purposeAr: "عرض الإشعارات والرسائل الموجهة للمعلم من مصادر معتمدة مع بيان المصدر والتاريخ والحالة.",
    purposeEn: "Show notices and messages addressed to the teacher with trusted source, date, and status.",
    stepsAr: ["جلب الرسائل المرتبطة بهوية المعلم", "تصنيفها حسب المصدر والأولوية", "عرض التاريخ والحالة ورابط الإجراء إن وجد", "تحديث حالة القراءة بعد الحفظ الخادمي"],
    stepsEn: ["Retrieve messages linked to the teacher identity", "Group by source and priority", "Show date, state, and action link when available", "Update read state only after server persistence"],
    inputsAr: ["هوية المعلم", "قنوات الرسائل المعتمدة", "سجل التسليم والقراءة"],
    inputsEn: ["Teacher identity", "Approved messaging channels", "Delivery and read receipts"],
    boundaryAr: "لا توجد إشعارات أو رسائل تجريبية، ولا يُدّعى الإرسال أو التسليم أو تحديث القراءة.",
    boundaryEn: "No sample notices or messages are shown. Sending, delivery, and read-state updates are not claimed.",
  },
  profile: {
    purposeAr: "عرض البيانات المهنية والتفضيلات المسموح بها دون تمكين تغيير الهوية أو الدور من الواجهة.",
    purposeEn: "Show professional account details and permitted preferences without allowing identity or role changes in the UI.",
    stepsAr: ["جلب بيانات الحساب من مصدر الهوية المعتمد", "عرض المدرسة والعضوية والتكليفات المرتبطة", "تعديل التفضيلات غير الحساسة بعد التحقق", "إحالة تغييرات الهوية أو الدور لمسار إداري مخول"],
    stepsEn: ["Load account data from the approved identity source", "Show linked school, membership, and assignments", "Update non-sensitive preferences after validation", "Route identity or role changes to an authorized administrator"],
    inputsAr: ["مصدر الهوية والجلسة", "عضوية المدرسة", "سياسة التفضيلات المسموح تعديلها"],
    inputsEn: ["Identity and session source", "School membership", "Policy for editable preferences"],
    boundaryAr: "لا تظهر بيانات شخصية تجريبية، ولا يستطيع المعلم تغيير الدور أو المدرسة أو صلاحياته من هذه الصفحة.",
    boundaryEn: "No sample personal data is shown. Teachers cannot change their role, school, or permissions from this page.",
  },
};

function StatusNotice({ isAr }: { isAr: boolean }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
      <CircleAlert className="mt-0.5 shrink-0" size={18} />
      <div>
        <strong className="block">{isAr ? "مصدر البيانات غير متصل" : "Data source not connected"}</strong>
        <span>{isAr
          ? "هذه مساحة عمل وهيكل إجراءات. لن نعرض بيانات معلمين أو طلاب أو درجات أو جداول افتراضية، ولن ندّعي حفظًا أو إرسالًا أو اعتمادًا غير منفذ."
          : "This is a workspace and workflow structure. No sample teacher, student, grade, or timetable data is shown, and no unperformed save, dispatch, or approval is claimed."}</span>
      </div>
    </div>
  );
}

export function TeacherPortalHome() {
  const { isAr } = useLang();
  const groups = PORTAL_NAVS.teacher;
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-[#111A18] p-6 text-white md:p-8">
        <div className="mb-3 text-xs font-extrabold tracking-widest text-[#D4AF37]">RAVEN OS · TEACHER WORKSPACE</div>
        <h1 className="text-2xl font-black md:text-3xl">{isAr ? "مساحة المعلم اليومية" : "Teacher Daily Workspace"}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/75">
          {isAr
            ? "مساحة موحدة تربط الجدول والتحضير والتكليفات والفصول والتقييم والشواهد ضمن نطاق المدرسة وإسناد المعلم."
            : "A unified workspace connecting timetable, lesson preparation, assignments, classes, assessment, and evidence within the teacher's school and assignment scope."}
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5">{isAr ? "14 قسمًا ضمن البوابة" : "14 portal sections"}</span>
          <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5">{isAr ? "عربي / English" : "Arabic / English"}</span>
          <span className="rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-3 py-1.5 text-[#F0D98A]">{isAr ? "مصمم دون بيانات وهمية" : "Designed without fixture data"}</span>
        </div>
      </section>

      <StatusNotice isAr={isAr} />

      <section className="grid gap-3 md:grid-cols-3">
        {[
          { icon: CalendarDays, titleAr: "جدولي وحصصي", titleEn: "Timetable & periods", bodyAr: "عرض الحصص والمواقع والتعديلات من الجدول المدرسي المعتمد.", bodyEn: "Show periods, locations, and changes from the approved school timetable.", href: "/teacher/timetable" },
          { icon: ClipboardCheck, titleAr: "تكليفاتي", titleEn: "My assignments", bodyAr: "متابعة المطلوب والمواعيد والشواهد وملاحظات المراجعة.", bodyEn: "Track requirements, deadlines, evidence, and review feedback.", href: "/teacher/tasks" },
          { icon: GraduationCap, titleAr: "فصولي وطلابي", titleEn: "My classes & students", bodyAr: "الوصول إلى الفصول المسندة فقط بعد التحقق من الصلاحيات.", bodyEn: "Access assigned classes only after authorization checks.", href: "/teacher/classes" },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href} className="rf-card p-5 transition hover:border-[#08794F]/40 hover:shadow-sm">
              <span className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-[#08794F]/10 text-[#08794F]"><Icon size={19} /></span>
              <strong className="block text-sm text-[#111A18]">{isAr ? card.titleAr : card.titleEn}</strong>
              <p className="mt-2 text-xs leading-6 text-[#66736e]">{isAr ? card.bodyAr : card.bodyEn}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#08794F]">{isAr ? "فتح القسم" : "Open section"} <Arrow size={14} /></span>
            </Link>
          );
        })}
      </section>

      <section className="rf-card p-5 md:p-6">
        <div className="mb-4 flex items-center gap-2">
          <BookOpenCheck size={19} className="text-[#08794F]" />
          <h2 className="text-base font-black text-[#111A18]">{isAr ? "دورة عمل المعلم" : "Teacher work cycle"}</h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {[
            { ar: "التخطيط والتحضير", en: "Plan & prepare" },
            { ar: "استلام التكليف", en: "Receive assignment" },
            { ar: "التنفيذ داخل الفصل", en: "Teach & execute" },
            { ar: "التقييم والمتابعة", en: "Assess & follow up" },
            { ar: "الشواهد والأرشفة", en: "Evidence & archive" },
          ].map((step, index) => (
            <div key={step.en} className="flex items-center gap-3 rounded-xl bg-[#F5F3EC] p-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#08794F]/10 text-xs font-black text-[#08794F]">{index + 1}</span>
              <span className="text-xs font-bold leading-5 text-[#26342f]">{isAr ? step.ar : step.en}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-black text-[#111A18]">{isAr ? "أقسام بوابة المعلم" : "Teacher portal sections"}</h2>
          <p className="mt-1 text-xs text-[#66736e]">{isAr ? "14 قسمًا في ثلاث مجموعات مترابطة؛ اختر القسم للانتقال إلى مساحة العمل المتخصصة." : "14 sections in three connected groups. Open a section to view its dedicated workspace."}</p>
        </div>
        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.ar}>
              <h3 className="mb-3 text-sm font-extrabold text-[#08794F]">{isAr ? group.ar : group.en}</h3>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.to} href={item.to} className="flex min-h-28 items-start gap-3 rf-card p-4 transition hover:border-[#08794F]/40 hover:shadow-sm">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#08794F]/10 text-[#08794F]"><Icon size={18} /></span>
                      <span className="min-w-0">
                        <strong className="block text-sm text-[#111A18]">{isAr ? item.ar : item.en}</strong>
                        <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#08794F]">{isAr ? "فتح" : "Open"} <Arrow size={13} /></span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function TeacherSectionWorkspace({ slug }: { slug: string }) {
  const { isAr } = useLang();
  const item = PORTAL_NAVS.teacher.flatMap((group) => group.items).find((entry) => entry.to === "/teacher/" + slug);
  if (!item || item.end) return null;

  const detail = SECTION_DETAILS[slug];
  const Icon = item.icon;
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const steps = detail ? (isAr ? detail.stepsAr : detail.stepsEn) : [];
  const inputs = detail ? (isAr ? detail.inputsAr : detail.inputsEn) : [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2 text-xs text-[#66736e]">
        <Link href="/teacher" className="hover:text-[#08794F]">{isAr ? "بوابة المعلم" : "Teacher portal"}</Link>
        <span>/</span>
        <span className="font-bold text-[#08794F]">{isAr ? item.ar : item.en}</span>
      </div>

      <section className="rounded-3xl bg-[#111A18] p-6 text-white md:p-8">
        <div className="mb-3 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#08794F] text-white"><Icon size={21} /></span>
          <span className="text-xs font-extrabold tracking-widest text-[#D4AF37]">RAVEN OS · TEACHER</span>
        </div>
        <h1 className="text-2xl font-black">{isAr ? item.ar : item.en}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/75">
          {detail ? (isAr ? detail.purposeAr : detail.purposeEn) : (isAr ? "مساحة عمل مخصصة ضمن بوابة المعلم." : "A dedicated workspace within the Teacher Portal.")}
        </p>
      </section>

      <StatusNotice isAr={isAr} />

      <div className="grid gap-4 xl:grid-cols-[1.25fr_1fr]">
        <section className="rf-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-[#08794F]" />
            <h2 className="text-sm font-black text-[#111A18]">{isAr ? "مسار العمل المعتمد تصميميًا" : "Designed workflow"}</h2>
          </div>
          <ol className="space-y-3">
            {steps.map((step, index) => (
              <li key={step} className="flex items-start gap-3 rounded-xl border border-black/5 bg-[#F5F3EC]/70 p-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#08794F]/10 text-xs font-black text-[#08794F]">{index + 1}</span>
                <span className="pt-1 text-sm font-semibold leading-6 text-[#26342f]">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="space-y-4">
          <section className="rf-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <FileText size={18} className="text-[#08794F]" />
              <h2 className="text-sm font-black text-[#111A18]">{isAr ? "المدخلات المطلوبة من مصدر موثوق" : "Required trusted inputs"}</h2>
            </div>
            <ul className="space-y-2 text-sm leading-6 text-[#43514b]">
              {inputs.map((entry) => <li key={entry} className="flex items-start gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#08794F]" />{entry}</li>)}
            </ul>
          </section>

          <section className="rounded-2xl border border-amber-300/70 bg-amber-50 p-5">
            <div className="mb-3 flex items-center gap-2 text-amber-950">
              <LockKeyhole size={18} />
              <h2 className="text-sm font-black">{isAr ? "حدود الصلاحية وحماية البيانات" : "Authorization & data boundaries"}</h2>
            </div>
            <p className="text-sm leading-7 text-amber-950/90">
              {detail ? (isAr ? detail.boundaryAr : detail.boundaryEn) : (isAr ? "تخضع جميع البيانات لنطاق المدرسة وإسناد المعلم والتحقق الخادمي." : "All data is subject to school scope, teacher assignment, and server-side authorization.")}
            </p>
          </section>
        </div>
      </div>

      {(slug === "lesson-plans" || slug === "homework" || slug === "achievements") && (
        <TeacherLocalDraft kind={slug} isAr={isAr} />
      )}

      <section className="rf-card p-5">
        <div className="mb-2 flex items-center gap-2">
          <ShieldCheck size={18} className="text-[#08794F]" />
          <h2 className="text-sm font-black text-[#111A18]">{isAr ? "متطلبات التفعيل التشغيلي" : "Operational activation requirements"}</h2>
        </div>
        <p className="text-sm leading-7 text-[#66736e]">
          {isAr
            ? "يتطلب تشغيل هذا القسم مصدر بيانات موثوقًا، وهوية وجلسة خادمية، وتفويضًا مرتبطًا بالمدرسة والفصول المسندة، وحفظًا دائمًا وسجل تدقيق مناسبًا للعملية. لا تُعرض عناصر تنفيذية قبل توافر هذه المتطلبات واختبارها."
            : "Activation requires a trusted data source, server-issued identity and session, authorization scoped to the school and assigned classes, persistent storage, and an appropriate audit trail. No execution controls are shown before these requirements exist and are tested."}
        </p>
      </section>

      <div className="flex justify-start">
        <Link href="/teacher" className="inline-flex items-center gap-2 rf-card px-4 py-2 text-sm font-bold text-[#08794F] hover:bg-[#F5F3EC]">
          <Arrow size={16} /> {isAr ? "العودة إلى مساحة المعلم" : "Back to teacher workspace"}
        </Link>
      </div>
    </div>
  );
}
