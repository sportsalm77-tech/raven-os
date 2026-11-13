import {
  LayoutDashboard, Building2, Users, ShieldCheck, HeartPulse, Settings,
  Compass, BarChart3, Info, ClipboardCheck, ListChecks, Target, GaugeCircle, Landmark, DoorOpen,
  UsersRound, GraduationCap, PenLine, ClipboardList, Mic, ShieldAlert, Sparkles, Library, CalendarDays,
  Stethoscope, Trophy, Star, Accessibility, MonitorPlay, Plug, Bot, KeyRound, SlidersHorizontal, FileBarChart2,
  BookOpenCheck, BellRing, UserRound, type LucideIcon,
} from 'lucide-react';

export type PortalId = 'platform' | 'principal' | 'teacher' | 'family';
export interface NavItem { to: string; ar: string; en: string; icon: LucideIcon; end?: boolean; desc?: string; }
export interface NavGroup { ar: string; en: string; items: NavItem[]; }
export interface PortalMeta {
  id: PortalId; to: string; ar: string; en: string; roleAr: string; roleEn: string;
  icon: LucideIcon; accent: string; userAr: string; userEn: string; userTitleAr: string; userTitleEn: string; scopeAr: string;
}

export const PORTALS: PortalMeta[] = [
  { id: 'platform', to: '/platform', ar: 'بوابة مدير المنصة', en: 'Platform Manager', roleAr: 'مالك المنصة', roleEn: 'Platform Owner', icon: LayoutDashboard, accent: '#D4AF37', userAr: 'م. فهد القحطاني', userEn: 'Eng. Fahad Al-Qahtani', userTitleAr: 'مالك المنصة — Platform Owner', userTitleEn: 'Platform Owner', scopeAr: 'مؤسسة رافيين — كل المستأجرين' },
  { id: 'principal', to: '/principal', ar: 'بوابة مدير المدرسة', en: 'School Principal', roleAr: 'مدير المدرسة', roleEn: 'Principal', icon: Landmark, accent: '#08794F', userAr: 'أ. خالد المطيري', userEn: 'Mr. Khalid Al-Mutairi', userTitleAr: 'مدير مدرسة المستقبل الأهلية', userTitleEn: 'Principal — Al-Mustaqbal National School', scopeAr: 'مدرسة المستقبل الأهلية — الرياض' },
  { id: 'teacher', to: '/teacher', ar: 'بوابة المعلم', en: 'Teacher', roleAr: 'معلمة رياضيات', roleEn: 'Teacher', icon: BookOpenCheck, accent: '#15445A', userAr: 'أ. سارة الحربي', userEn: 'Ms. Sarah Al-Harbi', userTitleAr: 'معلمة رياضيات — الصفوف الثانوية', userTitleEn: 'Mathematics Teacher — Secondary', scopeAr: 'مدرسة المستقبل الأهلية — 3 فصول' },
  { id: 'family', to: '/family', ar: 'بوابة الأسرة', en: 'Family', roleAr: 'ولي أمر', roleEn: 'Parent', icon: UserRound, accent: '#C1B489', userAr: 'أم ريان السبيعي', userEn: 'Mrs. Umm Rayan Al-Subaie', userTitleAr: 'ولية أمر ريان ولمى', userTitleEn: 'Parent of Rayan & Lama', scopeAr: 'ريان (3 متوسط أ) · لمى (1 ثانوي ب)' },
];
export const portalMeta = (id: PortalId) => PORTALS.find(p => p.id === id)!;

/* The four portal switcher is a VISUAL demo affordance, never authorization */
export const PLATFORM_NAV: NavGroup[] = [
  { ar: 'الإدارة العامة', en: 'Administration', items: [
    { to: '/platform', ar: 'نظرة عامة على المنصة', en: 'Platform Overview', icon: LayoutDashboard, end: true },
    { to: '/platform/schools', ar: 'إدارة المدارس والمؤسسات', en: 'Schools & Institutions', icon: Building2 },
    { to: '/platform/users', ar: 'إدارة المستخدمين', en: 'User Management', icon: Users },
    { to: '/platform/roles', ar: 'الأدوار والصلاحيات', en: 'Roles & Permissions', icon: ShieldCheck },
  ]},
  { ar: 'الحوكمة والنظام', en: 'Governance', items: [
    { to: '/platform/security', ar: 'الصحة التقنية والأمان', en: 'Tech Health & Security', icon: HeartPulse },
    { to: '/platform/settings', ar: 'الإعدادات العامة', en: 'Global Settings', icon: Settings },
  ]},
];

export const PRINCIPAL_NAV: NavGroup[] = [
  { ar: '1 · القيادة المدرسية', en: '1 · School Leadership', items: [
    { to: '/principal', ar: 'المؤشرات التفاعلية', en: 'Interactive Indicators', icon: BarChart3, end: true },
    { to: '/principal/info-center', ar: 'مركز المعلومات المدرسية', en: 'School Information Center', icon: Info },
    { to: '/principal/assignments', ar: 'مركز التكليفات والمهام', en: 'Assignments & Tasks Center', icon: ClipboardCheck },
    { to: '/principal/operational-plan', ar: 'مركز الخطة التشغيلية', en: 'Operational Plan Center', icon: ListChecks },
    { to: '/principal/impact', ar: 'مركز قياس الأثر', en: 'Impact Measurement Center', icon: Target },
    { to: '/principal/school-affairs', ar: 'مركز الشؤون المدرسية', en: 'School Affairs Center', icon: Landmark },
    { to: '/principal/classes', ar: 'مركز الفصول المدرسية', en: 'Classes Center', icon: DoorOpen },
  ]},
  { ar: '2 · شؤون المعلمين و3 · شؤون الطلاب', en: '2 · Teachers · 3 · Students', items: [
    { to: '/principal/teachers', ar: '2 · شؤون المعلمين', en: '2 · Teacher Affairs', icon: UsersRound },
    { to: '/principal/students', ar: '3 · شؤون الطلاب', en: '3 · Student Affairs', icon: GraduationCap },
  ]},
  { ar: '4 · الاختبارات', en: '4 · Exams', items: [
    { to: '/principal/exams/grades', ar: 'إدخال الدرجات وتحليلها', en: 'Grades Entry & Analysis', icon: PenLine },
    { to: '/principal/exams/control', ar: 'كنترول الاختبارات وإدارتها', en: 'Exam Control & Management', icon: ClipboardList },
  ]},
  { ar: '5 · السلوك والمواظبة', en: '5 · Behavior & Attendance', items: [
    { to: '/principal/behavior/absence', ar: 'تسجيل الغياب اليدوي والصوتي', en: 'Manual & Voice Absence', icon: Mic },
    { to: '/principal/behavior/violations', ar: 'تسجيل المخالفات السلوكية', en: 'Behavior Violations', icon: ShieldAlert },
    { to: '/principal/behavior/positive', ar: 'تسجيل السلوك المتميز', en: 'Positive Behavior', icon: Sparkles },
  ]},
  { ar: '6 – 18 · التشغيل والدعم', en: '6 – 18 · Operations & Support', items: [
    { to: '/principal/library', ar: '6 · مكتبة رافين', en: '6 · Raven Library', icon: Library },
    { to: '/principal/timetable', ar: '7 · الجدول المدرسي', en: '7 · School Timetable', icon: CalendarDays },
    { to: '/principal/health', ar: '8 · الصحة المدرسية', en: '8 · School Health', icon: Stethoscope },
    { to: '/principal/activities', ar: '9 · النشاط الطلابي', en: '9 · Student Activities', icon: Trophy },
    { to: '/principal/talented', ar: '10 · الموهوبون', en: '10 · Gifted Students', icon: Star },
    { to: '/principal/special-ed', ar: '11 · التربية الخاصة', en: '11 · Special Education', icon: Accessibility },
    { to: '/principal/resources', ar: '12 · مصادر التعلم', en: '12 · Learning Resources', icon: MonitorPlay },
    { to: '/principal/labs', ar: '13 · المختبرات', en: '13 · Laboratories', icon: Compass },
  ]},
  { ar: 'التعلم الإلكتروني والدعم', en: 'E-Learning & Support', items: [
    { to: '/principal/integrations/noor', ar: '14 · الربط مع نور', en: '14 · Noor Integration', icon: Plug },
    { to: '/principal/integrations/madrasati', ar: '14 · الربط مع منصة مدرستي', en: '14 · Madrasati Integration', icon: Plug },
    { to: '/principal/integrations/hudori', ar: '14 · الربط مع برنامج حضوري', en: '14 · Hudori Integration', icon: Plug },
    { to: '/principal/assistant', ar: '15 · المساعد الذكي', en: '15 · Smart Assistant', icon: Bot },
    { to: '/principal/permissions', ar: '16 · الصلاحيات', en: '16 · Permissions', icon: KeyRound },
    { to: '/principal/settings', ar: '17 · إعدادات المنصة', en: '17 · Platform Settings', icon: SlidersHorizontal },
    { to: '/principal/reports', ar: '18 · التقارير والمؤشرات', en: '18 · Reports & Indicators', icon: FileBarChart2 },
  ]},
];

export const TEACHER_NAV: NavGroup[] = [
  { ar: 'مساحتي اليومية', en: 'My Day', items: [
    { to: '/teacher', ar: 'الرئيسية ومساحة العمل', en: 'Home & Workspace', icon: LayoutDashboard, end: true },
    { to: '/teacher/timetable', ar: 'جدول المعلم والحصص', en: 'Timetable & Classes', icon: CalendarDays },
    { to: '/teacher/tasks', ar: 'المهام والتكليفات', en: 'Tasks & Assignments', icon: ClipboardCheck },
    { to: '/teacher/lesson-plans', ar: 'التحضير والخطط الدراسية', en: 'Lesson Plans', icon: BookOpenCheck },
  ]},
  { ar: 'فصولي وطلابي', en: 'My Classes', items: [
    { to: '/teacher/classes', ar: 'الفصول والطلاب', en: 'Classes & Students', icon: GraduationCap },
    { to: '/teacher/attendance', ar: 'الحضور والغياب', en: 'Attendance', icon: ClipboardList },
    { to: '/teacher/grades', ar: 'إدخال الدرجات والتقييم', en: 'Grades & Assessment', icon: PenLine },
    { to: '/teacher/exams', ar: 'الاختبارات', en: 'Exams', icon: ClipboardList },
    { to: '/teacher/homework', ar: 'الواجبات والأنشطة', en: 'Homework & Activities', icon: ListChecks },
    { to: '/teacher/behavior', ar: 'السلوك والمواظبة', en: 'Behavior & Conduct', icon: Sparkles },
  ]},
  { ar: 'ملفي والتواصل', en: 'Portfolio & Contact', items: [
    { to: '/teacher/achievements', ar: 'الشواهد والإنجازات', en: 'Evidence & Achievements', icon: Trophy },
    { to: '/teacher/library', ar: 'مكتبة رافين', en: 'Raven Library', icon: Library },
    { to: '/teacher/notices', ar: 'الإشعارات والتواصل', en: 'Notifications & Messages', icon: BellRing },
    { to: '/teacher/profile', ar: 'الملف الشخصي والإعدادات', en: 'Profile & Settings', icon: UserRound },
  ]},
];

export const FAMILY_NAV: NavGroup[] = [
  { ar: 'متابعة أبنائي', en: 'Follow My Children', items: [
    { to: '/family', ar: 'الرئيسية', en: 'Home', icon: LayoutDashboard, end: true },
    { to: '/family/children', ar: 'أبنائي', en: 'My Children', icon: UsersRound },
    { to: '/family/attendance', ar: 'الحضور والغياب', en: 'Attendance', icon: ClipboardList },
    { to: '/family/progress', ar: 'المستوى والتقدم الدراسي', en: 'Progress & Level', icon: GaugeCircle },
  ]},
  { ar: 'الدراسة', en: 'Academics', items: [
    { to: '/family/grades', ar: 'الدرجات والتقييمات', en: 'Grades & Assessments', icon: PenLine },
    { to: '/family/homework', ar: 'الواجبات والمهام', en: 'Homework & Tasks', icon: ListChecks },
    { to: '/family/behavior', ar: 'السلوك والمواظبة', en: 'Behavior & Conduct', icon: Sparkles },
    { to: '/family/timetable', ar: 'الجدول المدرسي', en: 'School Timetable', icon: CalendarDays },
  ]},
  { ar: 'التواصل والملفات', en: 'Contact & Files', items: [
    { to: '/family/notifications', ar: 'الإشعارات والتنبيهات', en: 'Notifications & Alerts', icon: BellRing },
    { to: '/family/contact', ar: 'التواصل مع المدرسة', en: 'Contact School', icon: Landmark },
    { to: '/family/reports', ar: 'التقارير والملفات', en: 'Reports & Files', icon: FileBarChart2 },
    { to: '/family/profile', ar: 'الملف الشخصي والإعدادات', en: 'Profile & Settings', icon: UserRound },
  ]},
];

export const PORTAL_NAVS: Record<PortalId, NavGroup[]> = {
  platform: PLATFORM_NAV, principal: PRINCIPAL_NAV, teacher: TEACHER_NAV, family: FAMILY_NAV,
};
