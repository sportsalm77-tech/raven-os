import {
  LayoutDashboard, Building2, Users, ShieldCheck, HeartPulse, Settings,
  BarChart3, Info, ClipboardCheck, ListChecks, Target, Landmark, DoorOpen,
  UsersRound, GraduationCap, PenLine, ClipboardList, Mic, ShieldAlert, Sparkles,
  Library, CalendarDays, Stethoscope, Trophy, Star, Accessibility, MonitorPlay,
  Plug, Bot, KeyRound, SlidersHorizontal, FileBarChart2, BookOpenCheck, Cpu,
  BellRing, UserRound, Activity, Workflow, type LucideIcon,
} from "lucide-react";

export type PortalId = "platform" | "principal" | "teacher" | "family";
export type NavItem = { to: string; ar: string; en: string; icon: LucideIcon; end?: boolean };
export type NavGroup = { ar: string; en: string; items: NavItem[] };

export const PORTAL_META: Record<PortalId, { ar: string; en: string; roleAr: string; roleEn: string; icon: LucideIcon }> = {
  platform: { ar: "إدارة المنصة", en: "Platform Management", roleAr: "إدارة المنظومة", roleEn: "Platform administration", icon: LayoutDashboard },
  principal: { ar: "بوابة مدير المدرسة", en: "Principal Portal", roleAr: "مدير المدرسة", roleEn: "School principal", icon: Landmark },
  teacher: { ar: "بوابة المعلم", en: "Teacher Portal", roleAr: "المعلم", roleEn: "Teacher", icon: BookOpenCheck },
  family: { ar: "بوابة الأسرة", en: "Family Portal", roleAr: "ولي الأمر", roleEn: "Parent / Guardian", icon: UserRound },
};

export const PLATFORM_NAV: NavGroup[] = [
 { ar:"الإدارة العامة", en:"Administration", items:[
  {to:"/platform",ar:"نظرة عامة",en:"Overview",icon:LayoutDashboard,end:true},
  {to:"/platform/schools",ar:"إدارة المدارس",en:"Schools",icon:Building2},
  {to:"/platform/users",ar:"إدارة المستخدمين",en:"Users",icon:Users},
  {to:"/platform/roles",ar:"الأدوار والصلاحيات",en:"Roles & Permissions",icon:ShieldCheck},
 ]},
 { ar:"الحوكمة والنظام", en:"Governance", items:[
  {to:"/platform/security",ar:"الأمان والصحة التقنية",en:"Security & System Health",icon:HeartPulse},
  {to:"/platform/settings",ar:"الإعدادات العامة",en:"Global Settings",icon:Settings},
  {to:"/platform/engines",ar:"مركز المحركات الذكية",en:"Intelligent Engines",icon:Cpu},
 ]}
];

export const PRINCIPAL_NAV: NavGroup[] = [
 {ar:"1 · القيادة المدرسية",en:"1 · School Leadership",items:[
  {to:"/principal",ar:"المؤشرات التفاعلية",en:"Interactive Indicators",icon:BarChart3,end:true},
  {to:"/principal/info-center",ar:"مركز البيانات المدرسية الموحد",en:"Unified School Data Center",icon:Info},
  {to:"/principal/impact",ar:"مركز قياس الأثر",en:"Impact Measurement",icon:Target},
  {to:"/principal/school-affairs",ar:"مركز الشؤون المدرسية",en:"School Affairs",icon:Landmark},
  {to:"/principal/classes",ar:"مركز الفصول المدرسية",en:"Classes Center",icon:DoorOpen},
 ]},
 {ar:"مركز القرارات والتكليفات الإدارية",en:"Administrative Decisions & Assignments Center",items:[
  {to:"/principal/decision-center",ar:"مركز القرارات والتكليفات الإدارية",en:"Administrative Decisions & Assignments Center",icon:Landmark,end:true},
  {to:"/principal/assignments",ar:"سجل التكليفات ومتابعة تنفيذها",en:"Assignments Register & Follow-up",icon:ClipboardCheck},
 ]},
 {ar:"مركز الخطة التشغيلية الذكية",en:"Smart Operational Plan Center",items:[
  {to:"/principal/operational-plan",ar:"نظرة عامة على الخطة التشغيلية",en:"Operational Plan Overview",icon:ListChecks,end:true},
  {to:"/principal/operational-plan/management",ar:"إدارة الخطة التشغيلية",en:"Operational Plan Management",icon:Target},
  {to:"/principal/operational-plan/follow-up",ar:"متابعة الخطة التشغيلية",en:"Operational Plan Follow-up",icon:ClipboardCheck},
  {to:"/principal/operational-plan/development",ar:"الخطة التطويرية",en:"Development Plan",icon:Activity},
  {to:"/principal/operational-plan/alternatives",ar:"الخطط البديلة",en:"Contingency Plans",icon:Workflow},
  {to:"/principal/operational-plan/initiatives",ar:"مبادرات الخطة التشغيلية",en:"Operational Plan Initiatives",icon:Sparkles},
  {to:"/principal/operational-plan/programs",ar:"برامج الخطة التشغيلية",en:"Operational Plan Programs",icon:BookOpenCheck},
 ]},
 {ar:"2 · شؤون المعلمين و3 · شؤون الطلاب",en:"2 · Teachers & Students",items:[
  {to:"/principal/teachers",ar:"شؤون المعلمين",en:"Teacher Affairs",icon:UsersRound},
  {to:"/principal/students",ar:"شؤون الطلاب",en:"Student Affairs",icon:GraduationCap},
 ]},
 {ar:"4 · الاختبارات",en:"4 · Exams",items:[
  {to:"/principal/exams/grades",ar:"إدخال الدرجات وتحليلها",en:"Grades & Analysis",icon:PenLine},
  {to:"/principal/exams/control",ar:"كنترول الاختبارات",en:"Exam Control",icon:ClipboardList},
 ]},
 {ar:"5 · السلوك والمواظبة",en:"5 · Behavior & Attendance",items:[
  {to:"/principal/behavior/absence",ar:"تسجيل الغياب اليدوي والصوتي",en:"Manual & Voice Absence",icon:Mic},
  {to:"/principal/behavior/violations",ar:"المخالفات السلوكية",en:"Behavior Violations",icon:ShieldAlert},
  {to:"/principal/behavior/positive",ar:"السلوك المتميز",en:"Positive Behavior",icon:Sparkles},
 ]},
 {ar:"6 – 18 · التشغيل والدعم",en:"6 – 18 · Operations & Support",items:[
  {to:"/principal/library",ar:"مكتبة رافين",en:"Raven Library",icon:Library},
  {to:"/principal/timetable",ar:"الجدول المدرسي",en:"School Timetable",icon:CalendarDays},
  {to:"/principal/health",ar:"الصحة المدرسية",en:"School Health",icon:Stethoscope},
  {to:"/principal/activities",ar:"النشاط الطلابي",en:"Student Activities",icon:Trophy},
  {to:"/principal/talented",ar:"الموهوبون",en:"Gifted Students",icon:Star},
  {to:"/principal/special-ed",ar:"التربية الخاصة",en:"Special Education",icon:Accessibility},
  {to:"/principal/resources",ar:"مصادر التعلم",en:"Learning Resources",icon:MonitorPlay},
  {to:"/principal/labs",ar:"المختبرات",en:"Laboratories",icon:Building2},
  {to:"/principal/integrations/noor",ar:"الربط مع نور",en:"Noor Integration",icon:Plug},
  {to:"/principal/integrations/madrasati",ar:"الربط مع مدرستي",en:"Madrasati Integration",icon:Plug},
  {to:"/principal/integrations/hudori",ar:"الربط مع حضوري",en:"Hudori Integration",icon:Plug},
  {to:"/principal/assistant",ar:"المساعد الذكي",en:"Smart Assistant",icon:Bot},
  {to:"/principal/permissions",ar:"الصلاحيات",en:"Permissions",icon:KeyRound},
  {to:"/principal/settings",ar:"إعدادات المنصة",en:"Settings",icon:SlidersHorizontal},
  {to:"/principal/reports",ar:"التقارير والمؤشرات",en:"Reports & Indicators",icon:FileBarChart2},
 ]}
];

export const TEACHER_NAV: NavGroup[] = [
 {ar:"مساحتي اليومية",en:"My Day",items:[
  {to:"/teacher",ar:"الرئيسية ومساحة العمل",en:"Home & Workspace",icon:LayoutDashboard,end:true},
  {to:"/teacher/timetable",ar:"جدول المعلم والحصص",en:"Timetable & Classes",icon:CalendarDays},
  {to:"/teacher/tasks",ar:"المهام والتكليفات",en:"Tasks & Assignments",icon:ClipboardCheck},
  {to:"/teacher/lesson-plans",ar:"التحضير والخطط الدراسية",en:"Lesson Plans",icon:BookOpenCheck},
 ]},
 {ar:"فصولي وطلابي",en:"My Classes",items:[
  {to:"/teacher/classes",ar:"الفصول والطلاب",en:"Classes & Students",icon:GraduationCap},
  {to:"/teacher/attendance",ar:"الحضور والغياب",en:"Attendance",icon:ClipboardList},
  {to:"/teacher/grades",ar:"الدرجات والتقييم",en:"Grades & Assessment",icon:PenLine},
  {to:"/teacher/exams",ar:"الاختبارات",en:"Exams",icon:ClipboardList},
  {to:"/teacher/homework",ar:"الواجبات والأنشطة",en:"Homework & Activities",icon:ListChecks},
  {to:"/teacher/behavior",ar:"السلوك والمواظبة",en:"Behavior & Conduct",icon:Sparkles},
 ]},
 {ar:"ملفي والتواصل",en:"Portfolio & Contact",items:[
  {to:"/teacher/achievements",ar:"الشواهد والإنجازات",en:"Evidence & Achievements",icon:Trophy},
  {to:"/teacher/library",ar:"مكتبة رافين",en:"Raven Library",icon:Library},
  {to:"/teacher/notices",ar:"الإشعارات والتواصل",en:"Notifications & Messages",icon:BellRing},
  {to:"/teacher/profile",ar:"الملف الشخصي والإعدادات",en:"Profile & Settings",icon:UserRound},
 ]}
];

export const FAMILY_NAV: NavGroup[] = [
 {ar:"متابعة أبنائي",en:"My Children",items:[
  {to:"/family",ar:"الرئيسية",en:"Home",icon:LayoutDashboard,end:true},
  {to:"/family/children",ar:"أبنائي",en:"My Children",icon:UsersRound},
  {to:"/family/attendance",ar:"الحضور والغياب",en:"Attendance",icon:ClipboardList},
  {to:"/family/progress",ar:"المستوى والتقدم الدراسي",en:"Progress",icon:Target},
 ]},
 {ar:"الدراسة",en:"Academics",items:[
  {to:"/family/grades",ar:"الدرجات والتقييمات",en:"Grades & Assessments",icon:PenLine},
  {to:"/family/homework",ar:"الواجبات والمهام",en:"Homework & Tasks",icon:ListChecks},
  {to:"/family/behavior",ar:"السلوك والمواظبة",en:"Behavior & Conduct",icon:Sparkles},
  {to:"/family/timetable",ar:"الجدول المدرسي",en:"School Timetable",icon:CalendarDays},
 ]},
 {ar:"التواصل والملفات",en:"Contact & Files",items:[
  {to:"/family/notifications",ar:"الإشعارات والتنبيهات",en:"Notifications & Alerts",icon:BellRing},
  {to:"/family/contact",ar:"التواصل مع المدرسة",en:"Contact School",icon:Landmark},
  {to:"/family/reports",ar:"التقارير والملفات",en:"Reports & Files",icon:FileBarChart2},
  {to:"/family/profile",ar:"الملف الشخصي والإعدادات",en:"Profile & Settings",icon:UserRound},
 ]}
];

export const PORTAL_NAVS: Record<PortalId, NavGroup[]> = {
 platform: PLATFORM_NAV, principal: PRINCIPAL_NAV, teacher: TEACHER_NAV, family: FAMILY_NAV
};
