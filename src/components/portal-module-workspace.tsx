"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, ArrowRight, CircleAlert, ClipboardCheck, Database, ShieldCheck } from "lucide-react";
import { PortalShell } from "@/components/portal-shell";
import { PageHead, SectionCard } from "@/components/raven-ui";
import { useLang } from "@/lib/i18n";
import { PORTAL_META, type PortalId } from "@/lib/nav";

type ModuleCopy = { ar: string; en: string; purposeAr: string; purposeEn: string; stepsAr: string[]; stepsEn: string[]; recordsAr: string; recordsEn: string };

const MODULES: Record<string, ModuleCopy> = {
  "/platform/schools": { ar:"إدارة المدارس",en:"School Management",purposeAr:"إدارة دورة حياة المدارس والجهات التابعة ضمن عزل مؤسسي واضح.",purposeEn:"Manage schools and their lifecycle within clear organizational isolation.",stepsAr:["ملف المدرسة وبياناتها الأساسية","حالة التفعيل والاشتراك","ربط مدير المدرسة والمستخدمين","مراجعة سلامة عزل بيانات المدرسة"],stepsEn:["School profile and core details","Activation and subscription status","Principal and user assignments","Review tenant data isolation"],recordsAr:"لن تظهر مدارس أو أرقام افتراضية. يلزم ربط مصدر المدارس والتحقق من school_id قبل عرض السجلات.",recordsEn:"No sample schools or counts are displayed. Connect the school source and verify school_id isolation before showing records." },
  "/platform/users": { ar:"إدارة المستخدمين",en:"User Management",purposeAr:"إدارة هويات المستخدمين وربطها بالمدارس والأدوار المصرح بها.",purposeEn:"Manage user identities and their school and authorized-role assignments.",stepsAr:["إنشاء دعوة مستخدم والتحقق منها","ربط المستخدم بمدرسة محددة","تعيين الدور وفق سياسة معتمدة","مراجعة حالة الحساب وسجل التغييرات"],stepsEn:["Create and verify a user invitation","Assign the user to a specific school","Grant a role under approved policy","Review account status and change history"],recordsAr:"إدارة المستخدمين لا تعني منح صلاحيات من الواجهة؛ يلزم مزود مصادقة وتفويض خادمي.",recordsEn:"A UI control must never grant access by itself; server-side authentication and authorization are required." },
  "/platform/roles": { ar:"الأدوار والصلاحيات",en:"Roles & Permissions",purposeAr:"حوكمة الوصول وفق مبدأ أقل صلاحية وفصل مسؤوليات المنصة والمدرسة.",purposeEn:"Govern access using least privilege and separation between platform and school responsibilities.",stepsAr:["تعريف الأدوار المعتمدة","ربط الصلاحيات بالموارد والإجراءات","اختبار المنع قبل السماح","توثيق تغييرات الصلاحيات"],stepsEn:["Define approved roles","Map permissions to resources and actions","Test deny-by-default behavior","Audit permission changes"],recordsAr:"القائمة الحالية وصف تنقلي فقط وليست نظام RBAC فعليًا.",recordsEn:"Current navigation is descriptive only; it is not an operational RBAC engine." },
  "/platform/security": { ar:"الأمان والصحة التقنية",en:"Security & System Health",purposeAr:"مراجعة أمن المنظومة وصحة الخدمات دون اختلاق مؤشرات تشغيلية.",purposeEn:"Review platform security and service health without fabricated operational metrics.",stepsAr:["حالة الخدمات والاعتماديات","مراجعة محاولات الدخول والأحداث","متابعة الثغرات والتحديثات","توثيق الحوادث والإجراءات"],stepsEn:["Service and dependency status","Review sign-in attempts and events","Track vulnerabilities and updates","Record incidents and remediation"],recordsAr:"لا توجد مراقبة أو سجلات أمنية متصلة في هذه النسخة.",recordsEn:"Monitoring and security event sources are not connected in this build." },
  "/platform/settings": { ar:"الإعدادات العامة",en:"Global Settings",purposeAr:"إدارة إعدادات المنصة العامة بعد اعتماد سياسة تغيير ومراجعة.",purposeEn:"Manage global platform settings under an approved change-control process.",stepsAr:["إعدادات الهوية واللغات","سياسات الجلسات والأمان","إعدادات الإشعارات","سجل اعتماد التغييرات"],stepsEn:["Brand and locale settings","Session and security policies","Notification settings","Change approval history"],recordsAr:"الإعدادات غير متصلة بخدمة حفظ خادمية؛ لا تُعرض عناصر توحي بتغيير دائم.",recordsEn:"Settings are not connected to persistent server storage; no controls imply durable changes." },
  "/principal/operational-plan": { ar:"مركز الخطة التشغيلية",en:"Operational Plan Center",purposeAr:"إدارة الخطة التشغيلية بوصفها قسمًا فرعيًا ضمن مركز القرار الإداري، لا مركزًا رئيسيًا مستقلًا.",purposeEn:"Manage the operational plan as a sub-center of the Administrative Decision Center, not as a separate top-level center.",stepsAr:["الأهداف ومؤشرات الأداء","المبادرات والإجراءات","المسؤولون والجداول الزمنية","الشواهد وقياس الإنجاز"],stepsEn:["Objectives and performance indicators","Initiatives and actions","Owners and timelines","Evidence and progress review"],recordsAr:"لا توجد خطة أو مؤشرات تجريبية معروضة. يلزم اعتماد نموذج الخطة ومصدر البيانات.",recordsEn:"No sample plans or metrics are shown. The plan model and data source must be approved." },
  "/teacher/attendance": { ar:"الحضور والغياب",en:"Attendance",purposeAr:"تمكين المعلم من رصد حضور طلاب فصوله وفق الجدول والصلاحيات المعتمدة.",purposeEn:"Let teachers record attendance for their assigned classes under approved schedules and permissions.",stepsAr:["اختيار الفصل والحصة","رصد الحالة لكل طالب","مراجعة السجل قبل الإرسال","إرسال الرصد إلى مسار اعتماد المدرسة"],stepsEn:["Select class and period","Record each student's status","Review the register","Submit through the school's approval flow"],recordsAr:"لا تظهر أسماء طلاب أو سجلات حضور قبل ربط الفصول والطلاب وصلاحية المعلم.",recordsEn:"Student names and attendance records remain hidden until classes, students, and teacher authorization are connected." },
  "/family/children": { ar:"أبنائي",en:"My Children",purposeAr:"عرض الأبناء المرتبطين بولي الأمر بعد تحقق خادمي موثوق من العلاقة.",purposeEn:"Show children linked to the guardian only after trusted server-side relationship verification.",stepsAr:["التحقق من هوية ولي الأمر","مطابقة علاقة الولاية","عرض الأبناء المصرح بهم فقط","حماية بيانات بقية الطلاب"],stepsEn:["Verify guardian identity","Validate the guardian relationship","Show only authorized children","Protect all other student records"],recordsAr:"لا يوجد ربط أسري متصل. لن نستخدم اختيار طفل تجريبي أو شارة تحقق شكلية.",recordsEn:"Guardian linking is not connected. No demo child selector or decorative verification badge is used." },
  "/family/attendance": { ar:"الحضور والغياب",en:"Attendance",purposeAr:"إتاحة سجل حضور الأبناء لولي الأمر المرتبط والمتحقق منه فقط.",purposeEn:"Provide attendance records only to a linked and verified guardian.",stepsAr:["التحقق من ارتباط ولي الأمر","اختيار الابن المصرح به","عرض سجل الحضور المعتمد","إظهار مصدر وتاريخ آخر تحديث"],stepsEn:["Verify guardian linkage","Select an authorized child","Show approved attendance history","Display source and last update"],recordsAr:"بيانات الحضور غير متصلة ولا توجد سجلات تجريبية.",recordsEn:"Attendance data is not connected and no sample records are shown." }
  "/teacher/tasks": workflow("المهام والتكليفات","Tasks & Assignments","متابعة التكليفات المسندة ومواعيدها وشواهد تنفيذها.","Track assigned tasks, deadlines, and completion evidence.",["مراجعة التكليفات المسندة","تأكيد المطلوب والموعد","تنفيذ المهمة وإرفاق الشواهد","الإرسال للمراجعة ومتابعة الملاحظات"],["Review assigned tasks","Confirm requirements and due dates","Complete work and attach evidence","Submit for review and track feedback"]),
  "/teacher/lesson-plans": workflow("التحضير والخطط الدراسية","Lesson Plans","تنظيم التحضير وفق المنهج والجدول الفعلي.","Organize lesson preparation against the actual curriculum and timetable.",["اختيار المقرر والوحدة والدرس","تحديد نواتج التعلم والاستراتيجيات","إعداد الأنشطة وأدوات التقويم","مراجعة التحضير"],["Select course, unit, and lesson","Define learning outcomes and strategies","Prepare activities and assessment tools","Review the lesson plan"]),
  "/teacher/classes": workflow("الفصول والطلاب","Classes & Students","عرض الفصول والطلاب المسندة للمعلم فقط بعد التحقق من التكليف.","Show only classes and students assigned to the teacher after verification.",["التحقق من إسناد الفصل","عرض قائمة الطلاب المصرح بها","فتح السجل وفق الصلاحية","حماية بيانات بقية الفصول"],["Verify class assignment","Show authorized student list","Open records according to permission","Protect other class data"]),
  "/teacher/grades": workflow("الدرجات والتقييم","Grades & Assessment","إدخال ومراجعة التقييمات ضمن صلاحية المعلم ومسار اعتماد المدرسة.","Enter and review assessments within teacher permissions and school approval flow.",["اختيار الفصل والمقرر والتقييم","إدخال الدرجات وفق سلم معتمد","مراجعة القيم والاكتمال","إرسال النتائج للمراجعة"],["Select class, course, and assessment","Enter grades using the approved scale","Review values and completeness","Submit results for review"]),
  "/teacher/homework": workflow("الواجبات والأنشطة","Homework & Activities","إعداد الواجبات ومتابعة التسليم والتغذية الراجعة.","Create homework and track submissions and feedback.",["إعداد المهمة وموعد التسليم","نشرها للفصل المسند","متابعة التسليم والتقييم","تقديم تغذية راجعة موثقة"],["Create task and due date","Publish to assigned class","Track submissions and assessment","Provide documented feedback"]),
  "/teacher/achievements": workflow("الشواهد والإنجازات","Evidence & Achievements","تنظيم شواهد أداء المعلم وربطها بالتكليف أو المؤشر.","Organize teacher evidence and link it to assignments or indicators.",["تحديد المجال أو المؤشر","إرفاق الشاهد مع وصف ومصدر","مراجعة الجودة والخصوصية","ربطه بملف الإنجاز"],["Select domain or indicator","Attach evidence with description and source","Review quality and privacy","Link it to the portfolio"]),
  "/family/progress": workflow("المستوى والتقدم الدراسي","Progress","عرض تقدم الابن بعد التحقق من علاقة ولي الأمر.","Show a child's progress only after guardian relationship verification.",["التحقق من هوية ولي الأمر","اختيار الابن المرتبط","عرض تقدم موثق للفترة","إظهار مصدر البيانات"],["Verify guardian identity","Select linked child","Show sourced progress for the period","Display data source"]),
  "/family/grades": workflow("الدرجات والتقييمات","Grades & Assessments","إطلاع ولي الأمر على النتائج المصرح بها بعد اعتمادها.","Let guardians view authorized results after approval.",["التحقق من العلاقة الأسرية","اختيار الابن المصرح به","عرض النتائج المعتمدة فقط","توضيح الفترة والمصدر"],["Verify guardian relationship","Select authorized child","Show approved results only","Identify period and source"]),
  "/family/homework": workflow("الواجبات والمهام","Homework & Tasks","متابعة الواجبات ومواعيدها للأبناء المرتبطين.","Track homework and deadlines for linked children.",["التحقق من علاقة ولي الأمر","عرض واجبات الابن","متابعة حالة التسليم","التواصل مع المدرسة عند الحاجة"],["Verify guardian relationship","Show the child's homework","Track submission status","Contact school when needed"]),
  "/family/notifications": workflow("الإشعارات والتنبيهات","Notifications & Alerts","عرض إشعارات المدرسة ذات الصلة بولي الأمر والابن المرتبط فقط.","Show school notices relevant only to the verified guardian and linked child.",["التحقق من هوية المستلم","تصنيف الإشعارات حسب الابن","عرض وقت ومصدر الإشعار","حفظ حالة القراءة خادميًا"],["Verify recipient identity","Group notices by child","Show notice time and source","Persist read status server-side"]),
  "/family/contact": workflow("التواصل مع المدرسة","Contact School","قناة تواصل تحفظ الخصوصية وتوثق الطلبات والردود.","A privacy-preserving channel that records requests and replies.",["تحديد موضوع الطلب والجهة","كتابة الرسالة دون بيانات غير لازمة","الإرسال عبر قناة موثقة","متابعة الرد وإغلاق الطلب"],["Choose topic and recipient","Write without unnecessary personal data","Send through an authenticated channel","Track reply and close request"])
};

function workflow(ar:string,en:string,purposeAr:string,purposeEn:string,stepsAr:string[],stepsEn:string[]):ModuleCopy {
 return {ar,en,purposeAr,purposeEn,stepsAr,stepsEn,recordsAr:"لا توجد سجلات فعلية معروضة. يتطلب التشغيل ربط قاعدة البيانات والمصادقة والصلاحيات وسجل التدقيق.",recordsEn:"No live records are displayed. Activation requires a database, authentication, authorization, and audit logging."};
}

function fallback(item: { ar:string; en:string }, portal: PortalId): ModuleCopy {
  const common = {
    ar: item.ar, en: item.en,
    purposeAr: "مساحة عمل مخصصة لهذا القسم ضمن بوابة رافين، مع الحفاظ على الصلاحيات وسلامة البيانات.",
    purposeEn: "A dedicated workspace for this Raven portal section, preserving permissions and data integrity.",
    stepsAr: ["تحديد مصدر البيانات المعتمد","تحديد الأدوار والإجراءات المسموحة","تنفيذ مسار العمل ومراجعته","توثيق النتائج والشواهد"],
    stepsEn: ["Identify the approved data source","Define permitted roles and actions","Implement and review the workflow","Record outcomes and evidence"],
    recordsAr: "هذا القسم لم يُربط بعد بخدمة خلفية. لا تُعرض بيانات افتراضية ولا تُدّعى عمليات حفظ أو اعتماد.",
    recordsEn: "This section is not connected to a backend service. No sample data or simulated save/approval actions are shown."
  };
  if (portal === "family") return { ...common, purposeAr:"قناة آمنة للأسرة للاطلاع على المعلومات المصرح بها والتواصل مع المدرسة.", purposeEn:"A secure family channel for authorized information and school communication." };
  if (portal === "teacher") return { ...common, purposeAr:"مساحة تنفيذ ومتابعة لأعمال المعلم ضمن الفصول والتكليفات المسندة إليه.", purposeEn:"A workspace for teacher execution and follow-up within assigned classes and tasks." };
  if (portal === "platform") return { ...common, purposeAr:"إدارة مركزية للحوكمة والإشراف على المنظومة مع احترام عزل المدارس.", purposeEn:"Central governance and oversight while preserving school data isolation." };
  return common;
}

export function PortalModuleWorkspace({ portal, item, path }: { portal: PortalId; item: { ar:string; en:string; icon: LucideIcon }; path: string }) {
  const { isAr } = useLang();
  const meta = PORTAL_META[portal];
  const data = MODULES[path] ?? fallback(item, portal);
  const steps = isAr ? data.stepsAr : data.stepsEn;
  return <PortalShell portal={portal}>
    <div className="mb-5 flex items-center gap-2 text-xs text-[#66736e]">
      <span>{isAr ? meta.ar : meta.en}</span><span>/</span><span className="font-bold text-[#08794F]">{isAr ? item.ar : item.en}</span>
    </div>
    <PageHead icon={item.icon} eyebrow={`RAVEN OS · ${portal.toUpperCase()}`} title={isAr ? data.ar : data.en} description={isAr ? data.purposeAr : data.purposeEn} />
    <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
      <SectionCard title={isAr ? "مسار العمل المقترح" : "Workflow"} description={isAr ? "هيكل تشغيلي للقسم، وليس ادعاءً بأن الإجراءات الخلفية مفعلة." : "An operational structure, not a claim that backend actions are enabled."}>
        <ol className="space-y-3">
          {steps.map((step, index) => <li key={step} className="flex items-start gap-3 rounded-xl border border-black/5 bg-[#F5F3EC]/60 p-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#08794F]/10 text-xs font-black text-[#08794F]">{index+1}</span>
            <span className="pt-1 text-sm font-semibold text-[#26342f]">{step}</span>
          </li>)}
        </ol>
      </SectionCard>
      <div className="space-y-4">
        <SectionCard title={isAr ? "حالة الاتصال" : "Connection status"}>
          <div className="flex items-center gap-2 rounded-xl border border-amber-300/60 bg-amber-50 p-3 text-sm font-bold text-amber-900">
            <CircleAlert size={18}/>{isAr ? "غير متصل بخدمة خلفية" : "Backend not connected"}
          </div>
          <p className="mt-3 text-sm leading-7 text-[#66736e]">{isAr ? data.recordsAr : data.recordsEn}</p>
        </SectionCard>
        <SectionCard title={isAr ? "متطلبات التفعيل" : "Activation requirements"}>
          <ul className="space-y-3 text-sm text-[#43514b]">
            <li className="flex gap-2"><Database size={17} className="shrink-0 text-[#08794F]"/>{isAr ? "مصدر بيانات موثوق مع سجل تدقيق" : "Trusted data source with an audit trail"}</li>
            <li className="flex gap-2"><ShieldCheck size={17} className="shrink-0 text-[#08794F]"/>{isAr ? "تحقق خادمي من الهوية والصلاحيات" : "Server-side identity and permission checks"}</li>
            <li className="flex gap-2"><ClipboardCheck size={17} className="shrink-0 text-[#08794F]"/>{isAr ? "اختبار مسار العمل قبل التشغيل" : "Workflow testing before activation"}</li>
          </ul>
        </SectionCard>
      </div>
    </div>
    <div className="mt-5 flex justify-start">
      <Link href={`/${portal}`} className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-bold text-[#08794F] hover:bg-[#F5F3EC]">
        {isAr ? <><ArrowRight size={16}/> العودة إلى البوابة</> : <><ArrowLeft size={16}/> Back to portal</>}
      </Link>
    </div>
  </PortalShell>;
}
