"use client";

import { useState } from "react";
import {
  AlertCircle,
  ArrowDownToLine,
  ArrowLeftRight,
  BookOpen,
  ClipboardList,
  Database,
  FileSpreadsheet,
  FileText,
  FileUp,
  GraduationCap,
  Library,
  ListChecks,
  School,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import { EmptyState, PageHead, SectionCard } from "@/components/raven-ui";

const modules = [
  { Icon: School, ar: "بيانات المدرسة", en: "School profile", descAr: "الهوية المدرسية، العام الدراسي، المراحل، الهيكل التنظيمي والفصول.", descEn: "School identity, academic year, stages, organization, and classes." },
  { Icon: UsersRound, ar: "بيانات المعلمين والموظفين", en: "Teachers & staff", descAr: "السجلات الوظيفية والتخصصات والارتباطات والتكليفات.", descEn: "Staff records, specialties, memberships, and assignments." },
  { Icon: GraduationCap, ar: "بيانات الطلاب والفصول", en: "Students & classes", descAr: "السجلات الأساسية وعضويات الفصول وحركة النقل والتحديث.", descEn: "Master records, class memberships, transfers, and updates." },
  { Icon: ClipboardList, ar: "التكليفات والمهام", en: "Assignments & tasks", descAr: "إدخال التكليفات والمهام والمسؤوليات ومواعيدها وحالاتها.", descEn: "Enter assignments, tasks, owners, due dates, and statuses." },
  { Icon: ListChecks, ar: "البيانات التشغيلية", en: "Operational data", descAr: "مصادر الخطط والبرامج والمبادرات واللجان والإجراءات.", descEn: "Source data for plans, programs, initiatives, committees, and procedures." },
  { Icon: FileUp, ar: "رفع الملفات والمرفقات", en: "File uploads", descAr: "رفع ملفات المدرسة الموجودة وربطها بالسجلات ذات العلاقة.", descEn: "Upload existing school files and link them to relevant records." },
  { Icon: ShieldCheck, ar: "جودة البيانات ومراجعتها", en: "Data quality & review", descAr: "متابعة الاكتمال والصحة والتكرار والتعارض والبيانات القديمة.", descEn: "Track completeness, validity, duplicates, conflicts, and stale records." },
  { Icon: ArrowLeftRight, ar: "توزيع البيانات والتكامل", en: "Distribution & integration", descAr: "متابعة وصول البيانات المصرح بها إلى المراكز المستفيدة.", descEn: "Track delivery of authorized data to consuming centers." },
];

const moduleFields = [
  { id: "school", ar: "بيانات المدرسة", en: "School profile", fieldsAr: ["الاسم الرسمي للمدرسة", "الرمز المدرسي", "المرحلة ونوع المدرسة", "الإدارة التعليمية", "العام الدراسي", "المراحل والصفوف والفصول"], fieldsEn: ["Official school name", "School code", "School stage and type", "Education administration", "Academic year", "Stages, grades, and classes"], noteAr: "تبدأ البنية المدرسية قبل إدخال سجلات الأفراد.", noteEn: "Establish the school structure before entering people records." },
  { id: "staff", ar: "المعلمون والموظفون", en: "Teachers & staff", fieldsAr: ["الاسم وبيانات العرض", "الرقم الوظيفي (عند اعتماده)", "المسمى والتخصص", "حالة الارتباط بالمدرسة", "التكليفات والارتباطات", "فترة سريان الارتباط"], fieldsEn: ["Name and display details", "Staff number (when approved)", "Job title and specialty", "School membership status", "Assignments and memberships", "Membership effective dates"], noteAr: "الشخص سجل مستقل؛ والمهام والارتباطات علاقات مؤرخة.", noteEn: "A person is a canonical record; duties and memberships are dated relationships." },
  { id: "students", ar: "الطلاب والفصول", en: "Students & classes", fieldsAr: ["الاسم الرسمي وحالة التحقق", "رقم الطالب وفق المصدر المعتمد", "المرحلة والصف والعام الدراسي", "عضوية الفصل وتاريخ السريان", "حالة القيد وحركات النقل", "ولي الأمر وعلاقة الربط الموثقة"], fieldsEn: ["Official name and verification state", "Student number from approved source", "Stage, grade, and academic year", "Class membership and effective dates", "Enrollment status and transfer events", "Guardian and verified relationship"], noteAr: "ملف طالب مركزي واحد؛ التسجيل والعضوية والنقل أحداث مستقلة تحفظ التاريخ.", noteEn: "One canonical student profile; enrollment, membership, and transfer are distinct historical events." },
  { id: "tasks", ar: "التكليفات والمهام", en: "Assignments & tasks", fieldsAr: ["عنوان المهمة وتصنيفها", "المسؤول والمشاركون", "تاريخ البداية والاستحقاق", "الأولوية والحالة", "الشواهد المرتبطة", "مصدر الطلب وسجل المراجعة"], fieldsEn: ["Task title and category", "Owner and participants", "Start and due dates", "Priority and status", "Linked evidence", "Request source and review history"], noteAr: "مركز التكليفات يعرض ويرسل أوامر معتمدة؛ والمصدر المركزي يحفظ السجل.", noteEn: "The operational center displays and submits governed commands; the central service persists the record." },
  { id: "operations", ar: "البيانات التشغيلية", en: "Operational data", fieldsAr: ["الخطط وبنودها", "البرامج والمبادرات", "اللجان والأعضاء", "الإجراءات ومواعيدها", "المسؤولون والارتباطات", "الحالة والشواهد"], fieldsEn: ["Plans and plan items", "Programs and initiatives", "Committees and members", "Procedures and due dates", "Owners and relationships", "Status and evidence"], noteAr: "تُربط عناصر التنفيذ بالتكليفات المركزية بدل تكرارها.", noteEn: "Execution items link to canonical tasks instead of duplicating them." },
  { id: "files", ar: "الملفات والمرفقات", en: "Files & attachments", fieldsAr: ["اسم الملف ونوعه المكتشف", "الحجم وتاريخ الرفع", "الرافع وحالة الفحص", "القسم والسجل المرتبط", "العام الدراسي والتصنيف", "الإصدار والأرشفة"], fieldsEn: ["Filename and detected type", "Size and upload date", "Uploader and scan status", "Related module and record", "Academic year and category", "Version and archive state"], noteAr: "الرفع غير مفعل حتى اكتمال الفحص والتخزين الآمن والتحقق من الصلاحية.", noteEn: "Uploads remain disabled until scanning, secure storage, and authorization are implemented." },
  { id: "quality", ar: "جودة البيانات ومراجعتها", en: "Data quality & review", fieldsAr: ["نوع السجل والحقل المتأثر", "قاعدة التحقق وإصدارها", "درجة الخطورة", "حالة الملاحظة", "المعالجة المقترحة", "المراجع وتاريخ الإغلاق"], fieldsEn: ["Entity type and affected field", "Validation rule and version", "Severity", "Finding status", "Proposed remediation", "Reviewer and resolution date"], noteAr: "لا تُدمج السجلات المتشابهة آليًا دون سياسة ومراجعة معتمدتين.", noteEn: "Potential duplicates are never auto-merged without an approved policy and review." },
  { id: "distribution", ar: "توزيع البيانات والتكامل", en: "Distribution & integration", fieldsAr: ["المركز المستفيد", "السجل وإصداره", "نطاق البيانات المصرح", "وقت الطلب والتسليم", "نتيجة التوزيع", "سبب التعثر وإعادة المحاولة"], fieldsEn: ["Consuming center", "Record and version", "Authorized data scope", "Request and delivery times", "Delivery outcome", "Failure category and retry"], noteAr: "يُرسل الحد الأدنى المصرح به فقط لكل مركز مستفيد.", noteEn: "Each consumer receives only its minimum authorized data projection." },
];

const detailedScreens = {
  school: [
    { groupAr: "هوية المدرسة", groupEn: "School identity", fields: [
      { ar: "الاسم الرسمي بالعربية", en: "Official Arabic name", typeAr: "نص إلزامي", typeEn: "Required text", ruleAr: "يطابق المصدر الرسمي المعتمد.", ruleEn: "Matches the approved official source." },
      { ar: "الاسم الرسمي بالإنجليزية", en: "Official English name", typeAr: "نص مشروط", typeEn: "Conditional text", ruleAr: "يطلب عند تفعيل المحتوى الإنجليزي.", ruleEn: "Required when English content is enabled." },
      { ar: "الرمز المدرسي", en: "School code", typeAr: "معرّف إلزامي", typeEn: "Required identifier", ruleAr: "فريد حسب نطاق الجهة المصدرة ولا يُخمن.", ruleEn: "Unique within issuing authority; never guessed." },
      { ar: "نوع المدرسة والمرحلة", en: "School type and stage", typeAr: "قائمة مرجعية", typeEn: "Reference list", ruleAr: "اختيار من قيم معتمدة.", ruleEn: "Select from approved values." },
      { ar: "الإدارة التعليمية والمنطقة", en: "Education administration and region", typeAr: "ارتباط مرجعي", typeEn: "Reference relation", ruleAr: "يرتبط بدليل الجهات المعتمد.", ruleEn: "References the approved administration directory." },
    ]},
    { groupAr: "العام الدراسي", groupEn: "Academic year", fields: [
      { ar: "اسم العام الدراسي", en: "Academic-year label", typeAr: "نص إلزامي", typeEn: "Required text", ruleAr: "فريد داخل المدرسة.", ruleEn: "Unique within the school." },
      { ar: "تاريخ البداية", en: "Start date", typeAr: "تاريخ إلزامي", typeEn: "Required date", ruleAr: "يسبق تاريخ النهاية.", ruleEn: "Must precede the end date." },
      { ar: "تاريخ النهاية", en: "End date", typeAr: "تاريخ إلزامي", typeEn: "Required date", ruleAr: "إغلاق العام يحفظ السجلات التاريخية.", ruleEn: "Closing preserves historical records." },
      { ar: "حالة العام", en: "Academic-year status", typeAr: "حالة نظامية", typeEn: "System state", ruleAr: "عام نشط واحد فقط لكل مدرسة.", ruleEn: "Only one active year per school." },
    ]},
    { groupAr: "الهيكل التعليمي", groupEn: "Academic structure", fields: [
      { ar: "المرحلة التعليمية", en: "Education stage", typeAr: "قائمة مرجعية", typeEn: "Reference list", ruleAr: "تتوافق مع نوع المدرسة.", ruleEn: "Must match school type." },
      { ar: "الصف الدراسي", en: "Grade", typeAr: "تابع للمرحلة", typeEn: "Stage-dependent", ruleAr: "لا ينشأ خارج المرحلة المحددة.", ruleEn: "Cannot exist outside its selected stage." },
      { ar: "اسم/رمز الفصل", en: "Class name/code", typeAr: "إلزامي", typeEn: "Required", ruleAr: "فريد ضمن المدرسة والعام والصف.", ruleEn: "Unique within school, year, and grade." },
      { ar: "السعة الاستيعابية", en: "Capacity", typeAr: "اختياري", typeEn: "Optional", ruleAr: "عدد صحيح غير سالب.", ruleEn: "Non-negative integer." },
      { ar: "حالة الفصل", en: "Class status", typeAr: "حالة نظامية", typeEn: "System state", ruleAr: "الأرشفة لا تمحو العضويات التاريخية.", ruleEn: "Archiving preserves historical memberships." },
    ]},
  ],
  staff: [
    { groupAr: "السجل الأساسي", groupEn: "Staff master record", fields: [
      { ar: "الاسم المعروض بالعربية", en: "Arabic display name", typeAr: "إلزامي", typeEn: "Required", ruleAr: "يحفظ مصدر الاسم وحالة التحقق.", ruleEn: "Record name source and verification state." },
      { ar: "الاسم المعروض بالإنجليزية", en: "English display name", typeAr: "مشروط", typeEn: "Conditional", ruleAr: "اختياري ما لم تتطلبه العملية.", ruleEn: "Optional unless required by workflow." },
      { ar: "الرقم الوظيفي", en: "Staff number", typeAr: "بحسب المصدر المعتمد", typeEn: "Source-dependent", ruleAr: "لا يعتمد قبل تحديد مصدره ونطاق تفرده.", ruleEn: "Requires approved source and uniqueness scope." },
      { ar: "المسمى الوظيفي", en: "Job title", typeAr: "قائمة مرجعية", typeEn: "Reference list", ruleAr: "قيمة معتمدة لا تنشئ شخصًا جديدًا عند تغييرها.", ruleEn: "Approved value; changes do not create a new person." },
      { ar: "التخصص/المادة", en: "Specialty/subject", typeAr: "ارتباط متعدد", typeEn: "Multi-value relation", ruleAr: "قد يرتبط الموظف بأكثر من تخصص.", ruleEn: "A staff member may have multiple specialties." },
    ]},
    { groupAr: "الارتباط بالمدرسة", groupEn: "School membership", fields: [
      { ar: "المدرسة", en: "School", typeAr: "نطاق خادمي", typeEn: "Server-resolved scope", ruleAr: "لا يقبل school_id من نموذج المستخدم.", ruleEn: "Never trust a client-supplied school_id." },
      { ar: "حالة الارتباط", en: "Membership status", typeAr: "حالة نظامية", typeEn: "System state", ruleAr: "مستقلة عن حالة حساب الدخول.", ruleEn: "Independent from login-account status." },
      { ar: "تاريخ بداية الارتباط", en: "Membership start date", typeAr: "تاريخ إلزامي", typeEn: "Required date", ruleAr: "ارتباط مستقل بتاريخ سريان.", ruleEn: "A distinct effective-dated membership." },
      { ar: "تاريخ نهاية الارتباط", en: "Membership end date", typeAr: "تاريخ مشروط", typeEn: "Conditional date", ruleAr: "يحفظ التاريخ الوظيفي السابق.", ruleEn: "Preserves prior membership history." },
    ]},
    { groupAr: "التكليفات والارتباطات", groupEn: "Duties and assignments", fields: [
      { ar: "الدور/المهمة", en: "Role/duty", typeAr: "ارتباط", typeEn: "Relationship", ruleAr: "يرتبط بسجل الشخص دون تكرار بياناته.", ruleEn: "References the person without duplicating their profile." },
      { ar: "الفصل/اللجنة/المهمة", en: "Class/committee/task", typeAr: "مرجع مرتبط", typeEn: "Linked reference", ruleAr: "يجب أن يكون ضمن المدرسة نفسها.", ruleEn: "Must belong to the same school." },
      { ar: "فترة السريان", en: "Effective period", typeAr: "بداية/نهاية", typeEn: "Start/end dates", ruleAr: "التغييرات قابلة للتدقيق زمنيًا.", ruleEn: "Changes remain auditable over time." },
    ]},
  ],
  students: [
    { groupAr: "الملف الأساسي للطالب", groupEn: "Student master profile", fields: [
      { ar: "الاسم الرسمي بالعربية", en: "Official Arabic name", typeAr: "إلزامي", typeEn: "Required", ruleAr: "يحفظ مصدر الاسم وحالة التحقق؛ لا ينشأ ملف ثانٍ عند اختلاف الكتابة.", ruleEn: "Keep source and verification state; spelling differences must not create duplicate profiles." },
      { ar: "الاسم بالإنجليزية", en: "English name", typeAr: "مشروط", typeEn: "Conditional", ruleAr: "يطلب عند الحاجة التشغيلية أو تفعيل المحتوى الإنجليزي.", ruleEn: "Required only when operationally needed or English content is enabled." },
      { ar: "رقم الطالب الرسمي", en: "Official student number", typeAr: "مصدر معتمد", typeEn: "Approved source", ruleAr: "لا يُخترع ولا يُعتمد قبل تحديد الجهة ونطاق التفرد.", ruleEn: "Never invent; authority and uniqueness scope must be approved." },
      { ar: "المعرف الداخلي", en: "Internal student ID", typeAr: "ينشأ خادميًا", typeEn: "Server-generated", ruleAr: "ثابت ولا يكشف بيانات شخصية.", ruleEn: "Stable and non-identifying." },
      { ar: "حالة التحقق ومصدر البيانات", en: "Verification state and data source", typeAr: "بيانات نظامية", typeEn: "System metadata", ruleAr: "مستورد، مدخل، قيد المراجعة، موثق؛ مع حفظ المصدر.", ruleEn: "Imported, entered, under review, verified; preserve provenance." },
    ]},
    { groupAr: "القيد والتسجيل", groupEn: "Enrollment", fields: [
      { ar: "العام الدراسي", en: "Academic year", typeAr: "ارتباط إلزامي", typeEn: "Required relation", ruleAr: "يجب أن يكون العام تابعًا للمدرسة نفسها.", ruleEn: "Must belong to the same school." },
      { ar: "المرحلة والصف", en: "Stage and grade", typeAr: "ارتباط مرجعي", typeEn: "Reference relation", ruleAr: "الصف تابع للمرحلة المعتمدة.", ruleEn: "Grade must belong to the approved stage." },
      { ar: "تاريخ بداية القيد", en: "Enrollment start date", typeAr: "تاريخ إلزامي", typeEn: "Required date", ruleAr: "يحدد بداية سريان التسجيل.", ruleEn: "Defines the enrollment effective date." },
      { ar: "حالة القيد", en: "Enrollment status", typeAr: "حالة نظامية", typeEn: "System state", ruleAr: "قيد المراجعة، نشط، منقول، منسحب، مكتمل؛ انتقالات مضبوطة.", ruleEn: "Pending, active, transferred, withdrawn, completed; governed transitions." },
      { ar: "حالة الاستحقاق/التحقق", en: "Eligibility/verification state", typeAr: "حسب السياسة", typeEn: "Policy-dependent", ruleAr: "لا تمنح حالة نشطة قبل اكتمال المتطلبات المعتمدة.", ruleEn: "Do not activate before approved requirements are met." },
    ]},
    { groupAr: "عضوية الفصل", groupEn: "Class membership", fields: [
      { ar: "الفصل الدراسي", en: "Class", typeAr: "مرجع إلزامي", typeEn: "Required reference", ruleAr: "يجب أن يتبع المدرسة والعام والصف المحددين.", ruleEn: "Must match school, academic year, and grade." },
      { ar: "تاريخ بداية العضوية", en: "Membership start date", typeAr: "تاريخ إلزامي", typeEn: "Required date", ruleAr: "تاريخ بداية مستقل عن تاريخ إنشاء الملف.", ruleEn: "Distinct from the profile creation date." },
      { ar: "تاريخ نهاية العضوية", en: "Membership end date", typeAr: "مشروط", typeEn: "Conditional", ruleAr: "لا يسبق تاريخ البداية؛ يحفظ العضوية السابقة.", ruleEn: "Cannot precede start; preserves prior membership." },
      { ar: "حالة العضوية", en: "Membership status", typeAr: "حالة نظامية", typeEn: "System state", ruleAr: "عضوية فعالة واحدة وفق سياسة التداخل المعتمدة.", ruleEn: "One active membership under approved overlap policy." },
    ]},
    { groupAr: "النقل والحركة الطلابية", groupEn: "Transfers and student movement", fields: [
      { ar: "نوع الحركة", en: "Movement type", typeAr: "قائمة مرجعية", typeEn: "Reference list", ruleAr: "نقل داخلي، نقل خارجي، انسحاب، عودة؛ وفق السياسة.", ruleEn: "Internal transfer, external transfer, withdrawal, return; policy-controlled." },
      { ar: "الفصل السابق والجديد", en: "Previous and new class", typeAr: "ارتباطان", typeEn: "Two relations", ruleAr: "إغلاق العضوية السابقة وفتح عضوية جديدة دون محو التاريخ.", ruleEn: "Close prior membership and create a new one without erasing history." },
      { ar: "تاريخ الحركة وسببها", en: "Movement date and reason", typeAr: "تاريخ وسبب", typeEn: "Date and reason", ruleAr: "السبب محدود الصلاحية ولا يظهر لكل الأدوار.", ruleEn: "Reason is restricted and not visible to every role." },
      { ar: "الجهة المنفذة والمعتمدة", en: "Performed and approving actors", typeAr: "سجل تدقيق", typeEn: "Audit record", ruleAr: "لا نفترض المعتمد؛ يحدد بمصفوفة الصلاحيات.", ruleEn: "Approver is not assumed; defined by the permission matrix." },
    ]},
    { groupAr: "ولي الأمر والخصوصية", groupEn: "Guardian relationship and privacy", fields: [
      { ar: "مرجع ولي الأمر", en: "Guardian reference", typeAr: "ملف مستقل", typeEn: "Separate profile", ruleAr: "لا تكرر بيانات الاتصال داخل ملف الطالب.", ruleEn: "Do not duplicate contact details in the student profile." },
      { ar: "صلة القرابة/الصفة", en: "Relationship type", typeAr: "قائمة مرجعية", typeEn: "Reference list", ruleAr: "قيمة مضبوطة وفق سياسة المدرسة.", ruleEn: "Controlled value under school policy." },
      { ar: "حالة التحقق من العلاقة", en: "Relationship verification", typeAr: "حالة نظامية", typeEn: "System state", ruleAr: "بوابة الأسرة لا ترى الطالب قبل تحقق العلاقة وصلاحية الخادم.", ruleEn: "Family portal cannot access the student before relationship verification and server authorization." },
      { ar: "فترة سريان العلاقة", en: "Relationship effective dates", typeAr: "تواريخ", typeEn: "Dates", ruleAr: "التغيير أو الإلغاء يحفظ في سجل تاريخي.", ruleEn: "Changes or revocation remain in history." },
    ]},
    { groupAr: "الاستيراد والمطابقة وجودة السجلات", groupEn: "Import, matching, and record quality", fields: [
      { ar: "مصدر الملف ودفعة الاستيراد", en: "Source file and import batch", typeAr: "بيانات نظامية", typeEn: "System metadata", ruleAr: "يحفظ الرافع والبصمة ونسخة خريطة الأعمدة.", ruleEn: "Preserve uploader, checksum, and mapping version." },
      { ar: "مطابقة الأعمدة", en: "Column mapping", typeAr: "معاينة إلزامية", typeEn: "Required preview", ruleAr: "لا يعتمد ترتيب الصفوف كمعرف للطالب.", ruleEn: "Row order is never treated as student identity." },
      { ar: "نتيجة التحقق", en: "Validation result", typeAr: "لكل سجل", typeEn: "Per record", ruleAr: "سليم، ناقص، غير صالح، مشتبه بالتكرار، متعارض.", ruleEn: "Valid, incomplete, invalid, duplicate-suspected, conflicting." },
      { ar: "قرار المطابقة", en: "Match decision", typeAr: "مراجعة بشرية", typeEn: "Human review", ruleAr: "لا دمج تلقائي ولا استبدال صامت للبيانات الأساسية.", ruleEn: "No automatic merge or silent overwrite of master records." },
    ]},
  ],
};

const fileTypes = [
  { Icon: FileText, ar: "Word", en: "Word", ext: ".doc · .docx" },
  { Icon: FileText, ar: "PDF", en: "PDF", ext: ".pdf" },
  { Icon: FileSpreadsheet, ar: "Excel", en: "Excel", ext: ".xls · .xlsx" },
  { Icon: BookOpen, ar: "PowerPoint", en: "PowerPoint", ext: ".ppt · .pptx" },
];

const importStages = [
  { ar: "استلام الملف وفحصه", en: "Receive and scan file", detailAr: "التحقق من النوع الفعلي والحجم وفحص السلامة وعزل الملف قبل القراءة.", detailEn: "Validate actual file type and size, scan it, and quarantine before parsing." },
  { ar: "اختيار نطاق البيانات", en: "Choose data domain", detailAr: "مدرسة، معلمون، طلاب، فصول، تكليفات أو بيانات تشغيلية ضمن مدرسة المستخدم.", detailEn: "School, staff, students, classes, assignments, or operational data within the actor's school scope." },
  { ar: "مطابقة الأعمدة", en: "Map columns", detailAr: "معاينة الأعمدة وربطها بالحقول المعتمدة وتحديد الأعمدة المستبعدة صراحة.", detailEn: "Preview columns, map approved fields, and explicitly exclude unused columns." },
  { ar: "التحقق وكشف التعارض", en: "Validate and detect conflicts", detailAr: "فحص الإلزاميات والتواريخ والعلاقات والتكرار والتعارض دون تعديل السجلات.", detailEn: "Check required values, dates, relationships, duplicates, and conflicts without mutating records." },
  { ar: "المعاينة وقرار المراجع", en: "Preview and reviewer decision", detailAr: "عرض ما سينشأ أو يتحدث أو يرفض؛ الحالات المشتبهة تحتاج مراجعة بشرية.", detailEn: "Show exact creates, updates, and rejections; suspected matches require human review." },
  { ar: "الاعتماد والإدخال", en: "Approve and commit", detailAr: "اعتماد مصرح به، تنفيذ قابل لإعادة المحاولة دون تكرار، وسجل تدقيق لكل نتيجة.", detailEn: "Authorized commit, idempotent retries, and an audit record for every outcome." },
  { ar: "المطابقة والتوزيع", en: "Reconcile and distribute", detailAr: "تحديث المراكز المستفيدة ومراقبة نجاح التسليم أو التعثر وإعادة المحاولة.", detailEn: "Refresh consuming centers and track delivery, failures, and retries." },
];

const indicators = [
  { ar: "إجمالي السجلات", en: "Total records" },
  { ar: "بيانات مكتملة", en: "Complete records" },
  { ar: "تحتاج إلى استكمال", en: "Needs completion" },
  { ar: "غير صحيحة أو متعارضة", en: "Invalid or conflicting" },
  { ar: "مؤرشفة أو محذوفة منطقيًا", en: "Archived or soft-deleted" },
  { ar: "توزيع ناجح أو متعثر", en: "Successful or failed deliveries" },
];

const consumers = [
  { ar: "الخطة التشغيلية ومركز القرار", en: "Operational Plan & Decision Center" },
  { ar: "شؤون المعلمين", en: "Teacher Affairs" },
  { ar: "شؤون الطلاب", en: "Student Affairs" },
  { ar: "صحة المدرسة", en: "School Health" },
  { ar: "مركز الفصول وأقسامه", en: "Class Operations and its sections" },
  { ar: "بقية مراكز مدير المدرسة", en: "Other Principal portal centers" },
  { ar: "مكتبة رافين", en: "Raven Library" },
];

export function PrincipalInfoCenter() {
  const { isAr } = useLang();
  const [activeModule, setActiveModule] = useState("school");
  const selectedModule = moduleFields.find((item) => item.id === activeModule) ?? moduleFields[0];
  const t = (ar: string, en: string) => isAr ? ar : en;

  return (
    <div className="space-y-5">
      <PageHead
        icon={Database}
        eyebrow="RAVEN OS · PRINCIPAL"
        title={t("مركز البيانات المدرسية الموحد", "Unified School Data Center")}
        description={t(
          "العصب المركزي لبيانات المدرسة: إدخال مرة واحدة، تحقق ومعالجة، ثم توزيع منضبط على مراكز المنصة.",
          "The school's central data backbone: enter once, validate and process, then distribute to platform centers under controlled permissions."
        )}
      />

      <div className="flex items-start gap-3 rounded-2xl border border-amber-300/70 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        <AlertCircle className="mt-1 shrink-0" size={18} />
        <p>{t(
          "هذه واجهة منظمة فقط في فرع الإنقاذ. لم تُربط بعد هوية المستخدم أو قاعدة البيانات أو صلاحيات الخادم أو خدمات الرفع والتوزيع؛ لذلك لا تعرض أرقامًا افتراضية ولا تتيح حفظًا أو رفعًا فعليًا.",
          "This is a structured interface in the rescue branch only. Identity, database, server permissions, upload, and distribution services are not connected; therefore no sample metrics are shown and real saving/upload is unavailable."
        )}</p>
      </div>

      <SectionCard
        title={t("مؤشرات صحة البيانات", "Data health indicators")}
        description={t(
          "ستُحسب المؤشرات من السجلات الفعلية وسجل المعالجة والتوزيع. عدم الاتصال يظهر كحالة غير متاحة، وليس صفرًا.",
          "Indicators will be calculated from persisted records and processing/distribution events. Disconnection is shown as unavailable, not zero."
        )}
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {indicators.map((item) => (
            <article key={item.en} className="rounded-xl border border-black/10 bg-[#F5F3EC] p-4">
              <p className="text-sm font-semibold text-[#26332e]">{t(item.ar, item.en)}</p>
              <p className="mt-2 text-lg font-extrabold text-[#66736e]">{t("غير متاح حتى ربط مصدر البيانات", "Unavailable until data source is connected")}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title={t("أقسام مركز البيانات", "Data center modules")}
        description={t(
          "أقسام وظيفية داخل مركز واحد؛ لا تنشئ مراكز رئيسية جديدة ولا قواعد بيانات متنافسة.",
          "Functional modules within one center; they do not create new top-level centers or competing data stores."
        )}
      >
        <div className="grid gap-3 md:grid-cols-2">
          {modules.map(({ Icon, ar, en, descAr, descEn }) => (
            <button
              key={en}
              type="button"
              onClick={() => setActiveModule(moduleFields.find((item) => item.ar === ar)?.id ?? "school")}
              aria-pressed={activeModule === moduleFields.find((item) => item.ar === ar)?.id}
              className="rounded-2xl border border-black/10 bg-white p-4 text-start transition-colors hover:border-[#08794F]/50 hover:bg-[#F5F3EC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#08794F]"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#08794F]/10 text-[#08794F]"><Icon size={19} /></div>
              <h2 className="font-extrabold text-[#111A18]">{t(ar, en)}</h2>
              <p className="mt-2 text-xs leading-6 text-[#66736e]">{t(descAr, descEn)}</p>
              <span className="mt-3 inline-flex text-xs font-bold text-[#08794F]">{t("فتح الوحدة واستعراض تفاصيلها", "Open module details")} ←</span>
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title={t("مساحة تفاصيل وحدات الإدخال", "Data-entry module workspace")}
        description={t(
          "اختر الوحدة لاستعراض حقولها الأساسية وضوابطها. هذا التنقل محلي للعرض فقط؛ لا يحفظ بيانات ولا ينشئ سجلات.",
          "Select a module to review its core fields and controls. This is local navigation only; it does not save data or create records."
        )}
      >
        <div className="flex flex-wrap gap-2" role="tablist" aria-label={t("وحدات مركز البيانات", "Data center modules")}>
          {moduleFields.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={activeModule === item.id}
              onClick={() => setActiveModule(item.id)}
              className={`rounded-xl border px-3 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#08794F] ${activeModule === item.id ? "border-[#08794F] bg-[#08794F] text-white" : "border-black/10 bg-white text-[#26332e] hover:bg-[#F5F3EC]"}`}
            >
              {t(item.ar, item.en)}
            </button>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-black/10 bg-[#F5F3EC] p-4" role="tabpanel">
          <h3 className="font-extrabold text-[#111A18]">{t(selectedModule.ar, selectedModule.en)}</h3>
          <p className="mt-1 text-xs leading-6 text-[#66736e]">{t(selectedModule.noteAr, selectedModule.noteEn)}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {(isAr ? selectedModule.fieldsAr : selectedModule.fieldsEn).map((field) => (
              <div key={field} className="flex items-start gap-2 rounded-xl border border-black/10 bg-white p-3 text-sm text-[#26332e]">
                <span className="mt-0.5 text-[#08794F]">•</span>
                <span>{field}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-xl border border-amber-300/70 bg-amber-50 p-3 text-xs leading-6 text-amber-900">
            {t("حقول العرض لا تعني اعتماد نموذج الإدخال النهائي. الحفظ والتعديل والأرشفة لا تُفعّل قبل ربط الخدمة المركزية والصلاحيات الخادمية.", "Displayed fields do not constitute approval of the final entry form. Create, update, and archive remain disabled until the central service and server-side permissions are connected.")}
          </p>
        </div>
      </SectionCard>

      {(activeModule === "school" || activeModule === "staff" || activeModule === "students") && (
        <SectionCard
          title={t(activeModule === "school" ? "تفاصيل شاشة بيانات المدرسة" : activeModule === "staff" ? "تفاصيل شاشة دليل المعلمين والموظفين" : "منظومة بيانات الطلاب والتسجيل", activeModule === "school" ? "School profile screen specification" : activeModule === "staff" ? "Teachers & staff directory screen specification" : "Student data and enrollment system")}
          description={t("مجموعات مترابطة مع نوع الحقل وقاعدة التحقق؛ هذه مواصفات عرض وليست نموذج حفظ نشطًا.", "Related field groups with types and validation rules; this is a specification view, not an active save form.")}
        >
          <div className="space-y-4">
            {detailedScreens[activeModule].map((group) => (
              <section key={group.groupEn} className="overflow-hidden rounded-2xl border border-black/10">
                <div className="border-b border-black/10 bg-[#F5F3EC] px-4 py-3">
                  <h3 className="font-extrabold text-[#111A18]">{t(group.groupAr, group.groupEn)}</h3>
                </div>
                <div className="divide-y divide-black/5">
                  {group.fields.map((field) => (
                    <div key={field.en} className="grid gap-2 p-4 md:grid-cols-[1fr_0.7fr_1.6fr] md:items-center">
                      <div>
                        <p className="text-sm font-bold text-[#26332e]">{t(field.ar, field.en)}</p>
                        <p className="mt-1 text-xs text-[#08794F]">{t(field.typeAr, field.typeEn)}</p>
                      </div>
                      <p className="text-xs font-semibold text-[#66736e]">{t("حقل محدد — غير قابل للتحرير الآن", "Defined field — editing unavailable")}</p>
                      <p className="text-xs leading-6 text-[#66736e]">{t(field.ruleAr, field.ruleEn)}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-amber-300/70 bg-amber-50 p-3 text-xs leading-6 text-amber-900">
            {t("قبل تفعيل الإدخال: اعتماد مصدر البيانات الرسمي، وتحديد مسؤوليات الإضافة والتعديل والأرشفة، وربط صلاحيات الخادم وسجل التدقيق. نطاق المدرسة يُحسم من سياق موثوق لا من قيمة يرسلها المتصفح.", "Before enabling entry: approve authoritative sources and create/update/archive responsibilities, then connect server authorization and audit logging. School scope must come from trusted context, never a browser-supplied value.")}
          </div>
        </SectionCard>
      )}


      <SectionCard
        title={t("مصادر إدخال البيانات المعتمدة", "Approved data-entry sources")}
        description={t("ثلاثة مسارات تصب في سجل مدرسي مركزي واحد؛ لا تُعتمد البيانات قبل التحقق والمراجعة والصلاحية.", "Three intake paths converge on one canonical school record; nothing is committed before validation, review, and authorization.")}
      >
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-black/10 bg-[#F5F3EC] p-4">
            <div className="flex items-center gap-2"><FileSpreadsheet size={19} className="text-[#08794F]" /><p className="text-sm font-extrabold text-[#26332e]">{t("الملفات المدرسية", "School files")}</p></div>
            <p className="mt-2 text-xs leading-6 text-[#66736e]">{t("Excel وWord وPDF وPowerPoint. يستخرج النظام البيانات الممكنة ويعرض الحقول ومصدرها للمراجعة. Excel هو الأفضل للجداول المنظمة.", "Excel, Word, PDF, and PowerPoint. Supported content is extracted with source references for review. Excel is preferred for structured tables.")}</p>
            <p className="mt-3 text-xs font-bold text-[#8a6b28]">{t("الاستخراج والرفع غير متصلين بعد", "Extraction and upload not connected")}</p>
          </div>
          <div className="rounded-xl border border-black/10 bg-[#F5F3EC] p-4">
            <div className="flex items-center gap-2"><ArrowLeftRight size={19} className="text-[#08794F]" /><p className="text-sm font-extrabold text-[#26332e]">{t("نظام نور", "Noor system")}</p></div>
            <p className="mt-2 text-xs leading-6 text-[#66736e]">{t("مصدر تكامل مستهدف لجلب بيانات الطلاب والمعلمين التي يتيحها مسار الربط الرسمي والمصرح به.", "Target integration source for student and teacher data exposed through an official, authorized access route.")}</p>
            <p className="mt-3 text-xs font-bold text-[#8a6b28]">{t("غير متصل — آلية الربط قيد التحقق", "Not connected — access method unverified")}</p>
          </div>
          <div className="rounded-xl border border-black/10 bg-[#F5F3EC] p-4">
            <div className="flex items-center gap-2"><ArrowLeftRight size={19} className="text-[#08794F]" /><p className="text-sm font-extrabold text-[#26332e]">{t("منصة مدرستي", "Madrasati platform")}</p></div>
            <p className="mt-2 text-xs leading-6 text-[#66736e]">{t("مصدر تكامل مستهدف لجلب بيانات الطلاب والمعلمين المتاحة والمصرح بها، مع حفظ مصدر كل قيمة وتاريخ المزامنة.", "Target integration source for permitted student and teacher data, preserving field provenance and sync history.")}</p>
            <p className="mt-3 text-xs font-bold text-[#8a6b28]">{t("غير متصل — آلية الربط قيد التحقق", "Not connected — access method unverified")}</p>
          </div>
        </div>
        <div className="mt-3 rounded-xl border border-emerald-700/20 bg-emerald-50/50 p-4">
          <div className="flex items-center gap-2"><ListChecks size={19} className="text-[#08794F]" /><p className="text-sm font-extrabold text-[#26332e]">{t("رفع خطة تشغيلية موجودة", "Import an existing operational plan")}</p></div>
          <p className="mt-2 text-xs leading-6 text-[#66736e]">{t("يرفع المدير ملف خطته الحالية من هنا، ويصنفه النظام كخطة تشغيلية، ثم يستخرج بنودها ومؤشراتها ومبادراتها وبرامجها ومسؤولياتها قدر الإمكان مع إظهار مصدر كل معلومة للمراجعة. بعد اعتماد الاستيراد تظهر الخطة نفسها في مركز الخطة التشغيلية الذكية لإدارتها ومتابعتها.", "The principal uploads an existing plan here. Raven classifies it, extracts its objectives, indicators, initiatives, programs, and ownership where possible, and shows source references for review. Once the import is approved, the same canonical plan appears in the Smart Operational Plan Center for management and follow-up.")}</p>
          <p className="mt-2 text-xs font-bold text-[#8a6b28]">{t("الرفع والاستخراج والاعتماد غير مفعلة بعد؛ الملف الأصلي سيبقى محفوظًا كمصدر للخطة عند تنفيذ الخدمة.", "Upload, extraction, and approval are not active yet; the original file will be retained as the plan's source when implemented.")}</p>
        </div>
        <div className="mt-3 rounded-xl border border-black/10 p-4">
          <p className="text-sm font-extrabold text-[#26332e]">{t("الإدخال الإداري المباشر", "Principal-managed entry")}</p>
          <p className="mt-2 text-xs leading-6 text-[#66736e]">{t("مدير المدرسة يدخل ويدير التكليفات والفرق واللجان وأعضاءها ومسؤولياتها وفترات سريانها من المركز نفسه، مع ربطها بسجلات المعلمين والفصول الموجودة دون تكرار.", "The principal enters and manages assignments, teams, committees, members, responsibilities, and effective dates here, linked to existing staff and class records without duplication.")}</p>
        </div>
        <p className="mt-3 rounded-xl border border-amber-300/70 bg-amber-50 p-3 text-xs leading-6 text-amber-900">{t("هذه المسارات معتمدة في التصميم. لا يوجد حاليًا رفع أو استخراج أو اتصال فعلي بنور أو مدرستي. لن يُستخدم كشط الصفحات أو جمع كلمات المرور؛ يلزم التحقق من قناة رسمية وصلاحياتها قبل تنفيذ التكامل.", "These paths are approved in the design. Upload/extraction and Noor/Madrasati connectors are not currently live. No scraping or password collection; an official authorized route must be verified first.")}</p>
      </SectionCard>

      <SectionCard
        title={t("مسار الاستيراد والتحقق الموحد", "Unified import & validation workflow")}
        description={t(
          "مسار واحد لجميع مجالات البيانات؛ الملف لا يغيّر السجلات المعتمدة قبل المعاينة والاعتماد المصرح به.",
          "One workflow for every data domain; a file cannot change canonical records before preview and authorized approval."
        )}
      >
        <div className="space-y-3">
          {importStages.map((stage, index) => (
            <div key={stage.en} className="flex gap-3 rounded-xl border border-black/10 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#08794F]/10 text-sm font-extrabold text-[#08794F]">{index + 1}</div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#111A18]">{t(stage.ar, stage.en)}</p>
                <p className="mt-1 text-xs leading-6 text-[#66736e]">{t(stage.detailAr, stage.detailEn)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-black/10 bg-[#F5F3EC] p-3">
            <p className="text-sm font-bold text-[#26332e]">{t("نتائج كل سجل", "Per-record outcomes")}</p>
            <p className="mt-1 text-xs leading-6 text-[#66736e]">{t("جاهز · ناقص · غير صالح · مشتبه بالتكرار · متعارض · مرفوض", "Ready · incomplete · invalid · duplicate candidate · conflict · rejected")}</p>
          </div>
          <div className="rounded-xl border border-black/10 bg-[#F5F3EC] p-3">
            <p className="text-sm font-bold text-[#26332e]">{t("حدود الاعتماد", "Commit safeguards")}</p>
            <p className="mt-1 text-xs leading-6 text-[#66736e]">{t("لا دمج تلقائي، لا استبدال صامت، لا اعتماد دون صلاحية وسجل تدقيق.", "No automatic merge, no silent overwrite, and no commit without authorization and audit.")}</p>
          </div>
        </div>
        <div className="mt-3 rounded-xl border border-amber-300/70 bg-amber-50 p-3 text-xs leading-6 text-amber-900">
          {t("المسار موثق كتصميم فقط؛ الاستيراد الفعلي ومعاينة الملفات والاعتماد غير متصلة حتى تنفيذ خدمات الخادم والأمان.", "This workflow is a design specification only; real parsing, preview, and commit remain disabled until server and security services are implemented.")}
        </div>
      </SectionCard>

      <SectionCard
        title={t("رفع الملفات الموجودة", "Upload existing files")}
        description={t(
          "المركز يرفع الملفات ويصنفها ويربطها بالبيانات؛ ولا ينشئ أو يصمم أو يصدر ملفات جديدة.",
          "The center receives files, extracts supported data for review, and links approved records; it does not generate documents."
        )}
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {fileTypes.map(({ Icon, ar, en, ext }) => (
            <div key={en} className="flex items-center gap-3 rounded-xl bg-[#F5F3EC] p-3">
              <Icon className="shrink-0 text-[#08794F]" size={22} />
              <div>
                <p className="text-sm font-bold text-[#111A18]">{t(ar, en)}</p>
                <p className="text-xs text-[#66736e]">{ext}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-dashed border-[#08794F]/40 bg-[#08794F]/5 p-5 text-center">
          <FileUp className="mx-auto mb-2 text-[#08794F]" size={26} />
          <p className="font-bold text-[#26332e]">{t("منطقة رفع الملفات", "File upload area")}</p>
          <p className="mt-1 text-xs leading-6 text-[#66736e]">{t(
            "سيُفعّل الرفع بعد ربط الهوية والصلاحيات والتحقق الآمن من نوع الملف وفحصه وتخزينه.",
            "Uploads will be enabled after identity, permissions, secure file-type validation, scanning, and storage are implemented."
          )}</p>
          <span className="mt-3 inline-flex rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
            {t("الرفع غير متصل حاليًا", "Upload not connected")}
          </span>
        </div>
      </SectionCard>

      <SectionCard
        title={t("مراجعة جودة البيانات ومعالجة الملاحظات", "Data quality review & issue management")}
        description={t("لوحة عمل موحدة للملاحظات الناتجة عن الإدخال والاستيراد والتحديث؛ لا تعرض أعدادًا حتى تتصل بسجل فعلي.", "A unified workbench for findings from entry, import, and updates; counts remain unavailable until connected to real records.")}
      >
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { ar: "اكتمال الحقول الأساسية", en: "Required-field completeness", detailAr: "الحقول الإلزامية والقيم المرجعية الناقصة.", detailEn: "Missing required fields and reference values." },
            { ar: "سلامة العلاقات", en: "Relationship integrity", detailAr: "التحقق من ارتباط الصفوف والفصول والموظفين بالمدرسة والعام الصحيحين.", detailEn: "Verify grades, classes, and staff belong to the correct school and year." },
            { ar: "التكرار والتعارض", en: "Duplicates & conflicts", detailAr: "تجميع المرشحين للمراجعة البشرية دون دمج آلي.", detailEn: "Queue candidates for human review; never auto-merge." },
            { ar: "حداثة البيانات", en: "Data freshness", detailAr: "تحديد السجلات التي تحتاج مراجعة بسبب قدم المصدر أو انتهاء الارتباط.", detailEn: "Identify records needing review due to stale sources or ended relationships." },
          ].map((item) => (
            <div key={item.en} className="rounded-xl border border-black/10 p-4">
              <div className="flex items-center gap-2"><ShieldCheck size={17} className="text-[#08794F]" /><p className="text-sm font-bold text-[#26332e]">{t(item.ar, item.en)}</p></div>
              <p className="mt-2 text-xs leading-6 text-[#66736e]">{t(item.detailAr, item.detailEn)}</p>
              <p className="mt-3 text-xs font-bold text-[#8a6b28]">{t("بانتظار نتائج التحقق الفعلية", "Awaiting live validation results")}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-black/10 bg-[#F5F3EC] p-4">
          <p className="text-sm font-extrabold text-[#26332e]">{t("دورة معالجة الملاحظة", "Finding resolution lifecycle")}</p>
          <p className="mt-2 text-xs leading-6 text-[#66736e]">{t("مكتشفة ← مصنفة حسب الخطورة ← مسندة لمراجع مخول ← تصحيح مقترح ← تحقق بعد التصحيح ← إغلاق موثق أو تصعيد.", "Detected → severity classified → assigned to an authorized reviewer → correction proposed → revalidated → documented closure or escalation.")}</p>
        </div>
      </SectionCard>

      <SectionCard
        title={t("سجل دفعات الاستيراد والمعالجة", "Import batches & processing history")}
        description={t("مرجع موحد لكل ملف ودفعة استيراد وقرار مراجعة ونتيجة اعتماد؛ لا توجد دفعات تجريبية معروضة.", "A unified record of each file, import batch, review decision, and commit outcome; no sample batches are displayed.")}
      >
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            { ar: "مسودات وملفات مستلمة", en: "Drafts & received files" },
            { ar: "قيد الفحص والمراجعة", en: "Scanning & review" },
            { ar: "معتمدة أو متعثرة", en: "Committed or failed" },
          ].map((item) => (
            <div key={item.en} className="rounded-xl border border-black/10 bg-white p-3">
              <p className="text-sm font-bold text-[#26332e]">{t(item.ar, item.en)}</p>
              <p className="mt-2 text-xs text-[#8a6b28]">{t("الحالة غير متاحة قبل ربط سجل الدفعات", "Unavailable until batch ledger is connected")}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-black/10 p-4">
          <p className="text-sm font-extrabold text-[#26332e]">{t("بيانات التتبع المطلوبة لكل دفعة", "Required traceability for every batch")}</p>
          <p className="mt-2 text-xs leading-6 text-[#66736e]">{t("معرف الدفعة، المدرسة، المجال، بصمة الملف، إصدار خريطة الأعمدة، إصدار قواعد التحقق، المنفذ والمراجع، أوقات المراحل، نتائج الصفوف، قرار الاعتماد، ومآل التوزيع.", "Batch ID, school, domain, file checksum, mapping and validation versions, actor and reviewer, stage timestamps, row outcomes, approval decision, and distribution result.")}</p>
        </div>
      </SectionCard>

      <SectionCard
        title={t("حوكمة البيانات وسجل التدقيق", "Data governance & audit trail")}
        description={t("كل تغيير على السجل المركزي يجب أن يكون قابلًا للتتبع وإعادة المراجعة، مع فصل صلاحية العرض عن صلاحية التعديل والاعتماد.", "Every canonical change must be traceable and reviewable, separating view, edit, and approval permissions.")}
      >
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { ar: "هوية ونطاق موثوق", en: "Trusted identity & scope", detailAr: "تحديد المستخدم ودوره ومدرسته على الخادم.", detailEn: "Resolve actor, role, and school on the server." },
            { ar: "صلاحيات حسب العملية", en: "Operation-level permissions", detailAr: "عرض، إدخال، تعديل، أرشفة، استيراد، اعتماد، وتصدير.", detailEn: "View, create, edit, archive, import, approve, and export." },
            { ar: "أثر تدقيقي واضح", en: "Clear audit history", detailAr: "الفاعل والتوقيت والسجل والتغيير والسبب والنتيجة.", detailEn: "Actor, time, record, change, reason, and outcome." },
          ].map((item) => (
            <div key={item.en} className="rounded-xl bg-[#F5F3EC] p-4">
              <p className="text-sm font-extrabold text-[#26332e]">{t(item.ar, item.en)}</p>
              <p className="mt-2 text-xs leading-6 text-[#66736e]">{t(item.detailAr, item.detailEn)}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 rounded-xl border border-amber-300/70 bg-amber-50 p-3 text-xs leading-6 text-amber-900">{t("متطلبات الحوكمة موثقة؛ لا يوجد حتى الآن محرك صلاحيات أو سجل تدقيق تشغيلي متصل بهذه الواجهة.", "Governance requirements are documented; no operational authorization engine or audit log is connected to this interface yet.")}</p>
      </SectionCard>

      <SectionCard
        title={t("المراكز المستفيدة من البيانات", "Data-consuming centers")}
        description={t(
          "تستقبل هذه المراكز البيانات المصرح بها من المصدر المركزي؛ ولا تنشئ نسخًا رئيسية مستقلة منها.",
          "These centers consume authorized data from the central source; they do not create independent master copies."
        )}
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {consumers.map((item) => (
            <div key={item.en} className="flex items-center gap-2 rounded-xl border border-black/10 p-3 text-sm font-semibold text-[#26332e]">
              <ArrowDownToLine className="shrink-0 text-[#08794F]" size={17} />
              <span>{t(item.ar, item.en)}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title={t("مكتبة رافين: جهة إنشاء الملفات", "Raven Library: document generation owner")}
        description={t(
          "مكتبة رافين تستهلك البيانات والملفات المرجعية المصرح بها من هذا المركز، وتتولى لاحقًا إنشاء النماذج والتقارير والملفات النهائية والشواهد.",
          "Raven Library consumes authorized data and source files from this center and will later create templates, reports, final documents, and evidence."
        )}
      >
        <div className="flex items-start gap-3 rounded-xl bg-[#F5F3EC] p-4">
          <Library className="mt-1 shrink-0 text-[#08794F]" size={23} />
          <div>
            <p className="font-bold text-[#111A18]">{t("فصل واضح للمسؤوليات", "Clear separation of responsibilities")}</p>
            <p className="mt-1 text-sm leading-6 text-[#66736e]">{t(
              "مركز البيانات: إدخال ورفع ومعالجة وتوزيع. مكتبة رافين: إنشاء وإصدار وأرشفة الملفات والشواهد.",
              "Data Center: enter, upload, process, distribute. Raven Library: create, issue, and archive documents and evidence."
            )}</p>
          </div>
        </div>
      </SectionCard>

      <EmptyState
        title={t("بانتظار ربط خدمات البيانات", "Waiting for connected data services")}
        description={t(
          "لن تظهر سجلات أو مؤشرات تجريبية. بعد اعتماد مصدر الهوية والبيانات والصلاحيات، تُفعّل الجداول وعمليات الإضافة والتعديل والأرشفة والرفع والتوزيع مع سجل تدقيق.",
          "No sample records or metrics will be displayed. Once identity, data sources, and permissions are approved, tables and create/edit/archive/upload/distribution operations can be enabled with audit history."
        )}
      />

      <p className="flex items-center gap-2 text-xs text-[#66736e]">
        <ShieldCheck size={15} />
        {t(
          "حوكمة المنصة: عزل بيانات كل مدرسة، وصلاحيات خادمية، وسجل تدقيق لكل عملية.",
          "Platform governance: tenant isolation, server-side authorization, and an audit trail for every operation."
        )}
      </p>
    </div>
  );
}
