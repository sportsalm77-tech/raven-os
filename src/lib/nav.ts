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
 { ar:"القيادة والتحكم", en:"Command & Control", items:[
  {to:"/platform",ar:"مركز القيادة التنفيذي",en:"Executive Command Center",icon:LayoutDashboard,end:true},
  {to:"/platform/security",ar:"مركز مراقبة التشغيل",en:"Operations Monitoring",icon:HeartPulse},
  {to:"/platform/communications",ar:"مركز الرسائل والتنبيهات",en:"Communications & Alerts",icon:BellRing},
  {to:"/platform/support",ar:"مركز الدعم الفني",en:"Technical Support",icon:Activity},
  {to:"/platform/subscriptions",ar:"مركز الاشتراكات والتفعيل",en:"Subscriptions & Activation",icon:ShieldAlert},
 ]},
 { ar:"قسم إدارة المدارس والمستخدمين", en:"Schools & Users Administration", items:[
  {to:"/platform/schools",ar:"ملفات المدارس ودورة حياتها",en:"School Profiles & Lifecycle",icon:Building2},
  {to:"/platform/users",ar:"حسابات المستخدمين والعضويات",en:"User Accounts & Memberships",icon:Users},
 ]},
 { ar:"الذكاء والأدلة", en:"Intelligence & Evidence", items:[
  {to:"/platform/engines",ar:"مركز الذكاء والتحليل",en:"Intelligence & Analytics",icon:Cpu},
  {to:"/platform/evidence",ar:"مركز الأدلة والاعتماد",en:"Evidence & Accreditation",icon:ClipboardCheck},
 ]},
 { ar:"الحوكمة والسجلات", en:"Governance & Records", items:[
  {to:"/platform/roles",ar:"مركز الحوكمة والسجلات",en:"Governance & Records",icon:ShieldCheck},
  {to:"/platform/settings",ar:"إعدادات المنصة العامة",en:"Global Platform Settings",icon:Settings},
 ]}
];

export const PRINCIPAL_NAV: NavGroup[] = [
 {ar:"1. القيادة المدرسية",en:"1. School Leadership",items:[
  {to:"/principal",ar:"المؤشرات التفاعلية",en:"Interactive Indicators",icon:BarChart3,end:true},
  {to:"/principal/info-center",ar:"مركز المعلومات المدرسية",en:"School Information Center",icon:Info},
  {to:"/principal/assignments",ar:"مركز التكليفات والمهام",en:"Assignments & Tasks Center",icon:ClipboardCheck},
  {to:"/principal/operational-plan",ar:"مركز الخطة التشغيلية",en:"Operational Plan Center",icon:ListChecks},
  {to:"/principal/impact",ar:"مركز قياس الأثر",en:"Impact Measurement Center",icon:Target},
  {to:"/principal/school-affairs",ar:"مركز الشؤون المدرسية",en:"School Affairs Center",icon:Landmark},
  {to:"/principal/classes",ar:"مركز الفصول المدرسية",en:"School Classes Center",icon:DoorOpen},
 ]},
 {ar:"2. شؤون المعلمين",en:"2. Teacher Affairs",items:[
  {to:"/principal/teachers",ar:"شؤون المعلمين",en:"Teacher Affairs",icon:UsersRound},
 ]},
 {ar:"3. شؤون الطلاب",en:"3. Student Affairs",items:[
  {to:"/principal/students",ar:"شؤون الطلاب",en:"Student Affairs",icon:GraduationCap},
 ]},
 {ar:"4. الاختبارات",en:"4. Examinations",items:[
  {to:"/principal/exams/grades",ar:"إدخال الدرجات وتحليلها",en:"Grade Entry & Analysis",icon:PenLine},
  {to:"/principal/exams/control",ar:"كنترول الاختبارات وإدارتها",en:"Examination Control & Management",icon:ClipboardList},
 ]},
 {ar:"5. السلوك والمواظبة",en:"5. Behavior & Attendance",items:[
  {to:"/principal/behavior/absence",ar:"تسجيل الغياب اليدوي والصوتي",en:"Manual & Voice Absence Recording",icon:Mic},
  {to:"/principal/behavior/violations",ar:"تسجيل المخالفات السلوكية",en:"Behavior Violation Recording",icon:ShieldAlert},
  {to:"/principal/behavior/positive",ar:"تسجيل السلوك المتميز",en:"Distinguished Behavior Recording",icon:Sparkles},
 ]},
 {ar:"6. التشغيل والدعم",en:"6. Operations & Support",items:[
  {to:"/principal/operations",ar:"التشغيل والدعم",en:"Operations & Support",icon:Workflow},
 ]},
 {ar:"7. مكتبة رافين",en:"7. Raven Library",items:[
  {to:"/principal/library",ar:"مكتبة رافين",en:"Raven Library",icon:Library},
 ]},
 {ar:"8. الجدول المدرسي",en:"8. School Timetable",items:[
  {to:"/principal/timetable",ar:"الجدول المدرسي",en:"School Timetable",icon:CalendarDays},
 ]},
 {ar:"9. الصحة المدرسية",en:"9. School Health",items:[
  {to:"/principal/health",ar:"الصحة المدرسية",en:"School Health",icon:Stethoscope},
 ]},
 {ar:"10. النشاط الطلابي",en:"10. Student Activities",items:[
  {to:"/principal/activities",ar:"النشاط الطلابي",en:"Student Activities",icon:Trophy},
 ]},
 {ar:"11. الموهوبون",en:"11. Gifted Students",items:[
  {to:"/principal/talented",ar:"الموهوبون",en:"Gifted Students",icon:Star},
 ]},
 {ar:"12. التربية الخاصة",en:"12. Special Education",items:[
  {to:"/principal/special-ed",ar:"التربية الخاصة",en:"Special Education",icon:Accessibility},
 ]},
 {ar:"13. مصادر التعلم",en:"13. Learning Resources",items:[
  {to:"/principal/resources",ar:"مصادر التعلم",en:"Learning Resources",icon:MonitorPlay},
 ]},
 {ar:"14. المختبرات",en:"14. Laboratories",items:[
  {to:"/principal/labs",ar:"المختبرات",en:"Laboratories",icon:Building2},
 ]},
 {ar:"14. التعلم الإلكتروني والدعم",en:"14. E-learning & Support",items:[
  {to:"/principal/integrations/noor",ar:"الربط مع نور",en:"Noor Integration",icon:Plug},
  {to:"/principal/integrations/madrasati",ar:"الربط مع منصة مدرستي",en:"Madrasati Platform Integration",icon:Plug},
  {to:"/principal/integrations/hudori",ar:"الربط مع برنامج حضوري",en:"Hudori Integration",icon:Plug},
 ]},
 {ar:"15. المساعد الذكي",en:"15. Smart Assistant",items:[
  {to:"/principal/assistant",ar:"المساعد الذكي",en:"Smart Assistant",icon:Bot},
 ]},
 {ar:"16. الصلاحيات",en:"16. Permissions",items:[
  {to:"/principal/permissions",ar:"الصلاحيات",en:"Permissions",icon:KeyRound},
 ]},
 {ar:"17. التقارير والمؤشرات",en:"17. Reports & Indicators",items:[
  {to:"/principal/reports",ar:"التقارير والمؤشرات",en:"Reports & Indicators",icon:FileBarChart2},
 ]},
 {ar:"18. إعدادات المنصة",en:"18. Platform Settings",items:[
  {to:"/principal/settings",ar:"إعدادات المنصة",en:"Platform Settings",icon:SlidersHorizontal},
 ]},
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
