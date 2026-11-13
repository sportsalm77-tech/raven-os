/* ─────────────────────────────────────────────────────────────
   RAVEN OS — Sample data layer (clearly labelled demo content)
   الفلسفة: أدخل بياناتك مرة، ودع رافين يبني ملفاتك
   ───────────────────────────────────────────────────────────── */

export const SCHOOLS = [
  { id: 'SCH-01', nameAr: 'مدرسة المستقبل الأهلية', nameEn: 'Al-Mustaqbal National School', city: 'الرياض', cityEn: 'Riyadh', students: 842, teachers: 68, health: 96, attendance: 96.2, status: 'active' as const, plan: 'الخطة الذهبية', lastSync: 'منذ 4 دقائق', platform: 'v4.2.1' },
  { id: 'SCH-02', nameAr: 'مدرسة النور النموذجية', nameEn: 'Al-Noor Model School', city: 'جدة', cityEn: 'Jeddah', students: 1210, teachers: 94, health: 91, attendance: 94.8, status: 'active' as const, plan: 'الخطة الذهبية', lastSync: 'منذ 12 دقيقة', platform: 'v4.2.1' },
  { id: 'SCH-03', nameAr: 'مدارس المعرفة الأهلية', nameEn: 'Al-Maarefa National Schools', city: 'الدمام', cityEn: 'Dammam', students: 654, teachers: 51, health: 84, attendance: 91.3, status: 'attention' as const, plan: 'الخطة الفضية', lastSync: 'منذ 38 دقيقة', platform: 'v4.2.0' },
  { id: 'SCH-04', nameAr: 'مدرسة الرواد العالمية', nameEn: 'Al-Rowad International School', city: 'الخبر', cityEn: 'Khobar', students: 980, teachers: 77, health: 93, attendance: 95.1, status: 'active' as const, plan: 'الخطة الذهبية', lastSync: 'منذ 9 دقائق', platform: 'v4.2.1' },
  { id: 'SCH-05', nameAr: 'مدرسة القمم للتميز', nameEn: 'Al-Qimam Distinction School', city: 'المدينة المنورة', cityEn: 'Madinah', students: 430, teachers: 36, health: 72, attendance: 88.6, status: 'attention' as const, plan: 'الخطة البرونزية', lastSync: 'منذ ساعة', platform: 'v4.1.8' },
  { id: 'SCH-06', nameAr: 'مدرسة الإبداع النموذجية', nameEn: 'Al-Ibdaa Model School', city: 'الطائف', cityEn: 'Taif', students: 512, teachers: 42, health: 88, attendance: 93.4, status: 'active' as const, plan: 'الخطة الفضية', lastSync: 'منذ 21 دقيقة', platform: 'v4.2.1' },
];

export const PLATFORM_USERS = [
  { id: 'U-001', name: 'م. فهد القحطاني', email: 'f.qahtani@raven.sa', role: 'Platform Owner', roleAr: 'مالك المنصة', scope: 'المنصة بالكامل', status: 'active' as const, last: 'الآن' },
  { id: 'U-002', name: 'أ. سارة الشمري', email: 's.shammari@raven.sa', role: 'Platform Admin', roleAr: 'مدير المنصة', scope: 'التشغيل والدعم', status: 'active' as const, last: 'منذ 6 دقائق' },
  { id: 'U-003', name: 'أ. خالد المطيري', email: 'k.mutairi@mustaqbal.edu.sa', role: 'Principal', roleAr: 'مدير المدرسة', scope: 'مدرسة المستقبل الأهلية', status: 'active' as const, last: 'منذ 2 دقيقة' },
  { id: 'U-004', name: 'أ. سارة الحربي', email: 's.harbi@mustaqbal.edu.sa', role: 'Teacher', roleAr: 'معلمة رياضيات', scope: 'مدرسة المستقبل الأهلية', status: 'active' as const, last: 'منذ 14 دقيقة' },
  { id: 'U-005', name: 'أ. منى العتيبي', email: 'm.otaibi@alnoor.edu.sa', role: 'School Admin', roleAr: 'مديرة شؤون المدرسة', scope: 'مدرسة النور النموذجية', status: 'active' as const, last: 'منذ 31 دقيقة' },
  { id: 'U-006', name: 'أم ريان السبيعي', email: 'family@alrowad.example', role: 'Family', roleAr: 'ولي أمر', scope: 'طالبين مرتبطين', status: 'active' as const, last: 'أمس' },
  { id: 'U-007', name: 'أ. عبدالله الزامل', email: 'a.zamil@maarefa.edu.sa', role: 'Principal', roleAr: 'مدير المدرسة', scope: 'مدارس المعرفة الأهلية', status: 'invited' as const, last: 'دعوة معلقة — 3 أيام' },
  { id: 'U-008', name: 'أ. ريم الدوسري', email: 'r.dosari@qimam.edu.sa', role: 'Teacher', roleAr: 'معلمة لغة عربية', scope: 'مدرسة القمم للتميز', status: 'suspended' as const, last: 'موقوف منذ 12 يوم' },
];

export const AUDIT_LOGS = [
  { id: 'AL-9241', time: '09:41:12', actor: 'f.qahtani@raven.sa', action: 'تعديل صلاحيات الدور «School Admin»', target: 'مصفوفة الصلاحيات v2.4', severity: 'high' as const },
  { id: 'AL-9240', time: '09:33:48', actor: 's.shammari@raven.sa', action: 'تفعيل مدرسة «الإبداع النموذجية»', target: 'SCH-06', severity: 'medium' as const },
  { id: 'AL-9239', time: '09:12:03', actor: 'system', action: 'نسخ احتياطي مشفّر مكتمل (AES-256)', target: 'us-east / riyadh-1', severity: 'info' as const },
  { id: 'AL-9238', time: '08:58:27', actor: 'k.mutairi@mustaqbal.edu.sa', action: 'تصدير تقرير الدرجات — الفصل الثاني', target: 'مدرسة المستقبل الأهلية', severity: 'medium' as const },
  { id: 'AL-9237', time: '08:31:15', actor: 'system', action: 'حظر محاولة دخول فاشلة (5 محاولات)', target: 'IP 185.220.xx.xx — جدة', severity: 'high' as const },
  { id: 'AL-9236', time: '08:02:44', actor: 'm.otaibi@alnoor.edu.sa', action: 'تحديث بيانات تواصل أولياء الأمور (دفعة 214)', target: 'SCH-02', severity: 'info' as const },
];

export const HEALTH_STATS = [
  { label: 'التوفرية Uptime — 90 يوم', value: '99.98%', tone: 'green' as const },
  { label: 'زمن الاستجابة p95', value: '184 ms', tone: 'green' as const },
  { label: 'أخطاء API — 24 ساعة', value: '0.012%', tone: 'green' as const },
  { label: 'نسخ احتياطية ناجحة', value: '128 / 128', tone: 'green' as const },
];

export const CLASSES = [
  { id: 'C-1A', name: '1-أ', grade: 'الصف الأول ثانوي', gradeEn: 'Grade 10', students: 32, avg: 88.4, attendance: 96.5, room: 'مبنى A · 204' },
  { id: 'C-2B', name: '2-ب', grade: 'الصف الثاني ثانوي', gradeEn: 'Grade 11', students: 29, avg: 84.1, attendance: 94.1, room: 'مبنى A · 301' },
  { id: 'C-3A', name: '3-أ', grade: 'الصف الثالث متوسط', gradeEn: 'Grade 9', students: 31, avg: 91.2, attendance: 97.8, room: 'مبنى B · 112' },
  { id: 'C-1B', name: '1-ب', grade: 'الصف الأول ثانوي', gradeEn: 'Grade 10', students: 30, avg: 79.6, attendance: 92.4, room: 'مبنى A · 205' },
  { id: 'C-2A', name: '2-أ', grade: 'الصف الثاني ثانوي', gradeEn: 'Grade 11', students: 28, avg: 86.9, attendance: 95.6, room: 'مبنى A · 302' },
  { id: 'C-3B', name: '3-ب', grade: 'الصف الثالث متوسط', gradeEn: 'Grade 9', students: 33, avg: 74.3, attendance: 89.7, room: 'مبنى B · 113' },
];

export const STUDENTS = [
  { id: 'ST-3001', name: 'سارة القحطاني', classId: 'C-3A', avg: 96.2, attendance: 99.1, behavior: 'ممتاز', trend: +2.4 },
  { id: 'ST-3002', name: 'عبدالله الشمري', classId: 'C-3A', avg: 88.7, attendance: 97.2, behavior: 'ممتاز', trend: +1.1 },
  { id: 'ST-3003', name: 'ليان العتيبي', classId: 'C-1A', avg: 91.5, attendance: 98.3, behavior: 'جيد جداً', trend: +3.8 },
  { id: 'ST-3004', name: 'محمد الزامل', classId: 'C-2B', avg: 72.4, attendance: 88.0, behavior: 'جيد', trend: -1.6 },
  { id: 'ST-3005', name: 'جنى الدوسري', classId: 'C-1B', avg: 84.0, attendance: 95.5, behavior: 'ممتاز', trend: +0.8 },
  { id: 'ST-3006', name: 'فهد الغامدي', classId: 'C-3B', avg: 61.8, attendance: 82.3, behavior: 'يحتاج متابعة', trend: -4.2 },
  { id: 'ST-3007', name: 'ريم المطيري', classId: 'C-2A', avg: 93.3, attendance: 98.9, behavior: 'ممتاز', trend: +2.0 },
  { id: 'ST-3008', name: 'ريان السبيعي', classId: 'C-3A', avg: 85.6, attendance: 96.0, behavior: 'جيد جداً', trend: +1.5 },
  { id: 'ST-3009', name: 'لمى الحربي', classId: 'C-1A', avg: 79.1, attendance: 90.4, behavior: 'جيد', trend: -0.7 },
  { id: 'ST-3010', name: 'تركي العنزي', classId: 'C-2B', avg: 90.8, attendance: 93.7, behavior: 'جيد جداً', trend: +1.9 },
  { id: 'ST-3011', name: 'دانا الشهري', classId: 'C-1B', avg: 67.5, attendance: 85.1, behavior: 'يحتاج متابعة', trend: -2.8 },
  { id: 'ST-3012', name: 'زياد القحطاني', classId: 'C-2A', avg: 82.2, attendance: 94.8, behavior: 'جيد جداً', trend: +0.4 },
];

export const TEACHERS = [
  { id: 'T-01', name: 'أ. سارة الحربي', subject: 'الرياضيات', subjectEn: 'Mathematics', classes: ['1-أ', '2-أ', '3-أ'], load: 18, status: 'active' as const, specialty: 'ماجستير تعليم رياضيات' },
  { id: 'T-02', name: 'أ. محمد القحطاني', subject: 'العلوم', subjectEn: 'Science', classes: ['2-ب', '3-ب'], load: 16, status: 'active' as const, specialty: 'دكتوراه كيمياء' },
  { id: 'T-03', name: 'أ. رنا العتيبي', subject: 'اللغة العربية', subjectEn: 'Arabic Language', classes: ['1-ب', '2-ب', '3-أ'], load: 17, status: 'active' as const, specialty: 'ماجستير أدب ونحو' },
  { id: 'T-04', name: 'أ. يوسف الغامدي', subject: 'الحاسب الآلي', subjectEn: 'Computer Science', classes: ['1-أ', '1-ب', '2-أ', '2-ب'], load: 19, status: 'active' as const, specialty: 'هندسة حاسب' },
  { id: 'T-05', name: 'أ. هند المطيري', subject: 'اللغة الإنجليزية', subjectEn: 'English Language', classes: ['3-ب', '2-أ'], load: 15, status: 'leave' as const, specialty: 'ماجستير TESOL' },
  { id: 'T-06', name: 'أ. عمر الدوسري', subject: 'الدراسات الاجتماعية', subjectEn: 'Social Studies', classes: ['3-أ', '3-ب'], load: 14, status: 'active' as const, specialty: 'بكالوريوس تاريخ' },
  { id: 'T-07', name: 'أ. لمى الزامل', subject: 'التربية البدنية', subjectEn: 'Physical Education', classes: ['الكل'], load: 20, status: 'active' as const, specialty: 'علوم رياضة' },
  { id: 'T-08', name: 'أ. فواز السبيعي', subject: 'الفيزياء', subjectEn: 'Physics', classes: ['2-أ', '2-ب'], load: 16, status: 'active' as const, specialty: 'ماجستير فيزياء' },
];

export const TASKS = [
  { id: 'TK-114', title: 'اعتماد خطط الأسبوع الرابع — المواد العلمية', due: 'اليوم 14:00', priority: 'عالية' as const, progress: 65, status: 'inprogress' as const, assignee: 'أ. محمد القحطاني' },
  { id: 'TK-113', title: 'مراجعة نتائج اختبار الرياضيات الموحّد', due: 'اليوم 12:30', priority: 'عالية' as const, progress: 80, status: 'inprogress' as const, assignee: 'أ. سارة الحربي' },
  { id: 'TK-112', title: 'رفع شواهد مبادرة «مدرستي صحية» للأرشفة', due: 'غداً', priority: 'متوسطة' as const, progress: 30, status: 'inprogress' as const, assignee: 'لجنة الصحة المدرسية' },
  { id: 'TK-111', title: 'اجتماع لجنة الموهوبين — قرارات الرعاية', due: 'غداً 10:00', priority: 'متوسطة' as const, progress: 0, status: 'pending' as const, assignee: 'لجنة الموهوبين' },
  { id: 'TK-110', title: 'استكمال توصيف لجان الفصل الدراسي', due: 'الخميس', priority: 'منخفضة' as const, progress: 100, status: 'done' as const, assignee: 'أ. رنا العتيبي' },
  { id: 'TK-109', title: 'اعتماد جدولة الحصص الاحتياطية', due: 'مكتمل', priority: 'متوسطة' as const, progress: 100, status: 'done' as const, assignee: 'وحدة الجدول' },
];

export const INITIATIVES = [
  { id: 'IN-21', name: 'مشروع «القارئ الصغير» — 10,000 صفحة', owner: 'وحدة مصادر التعلم', progress: 74, indicator: 'عدد الصفحات المقروءة', due: 'نهاية الفصل' },
  { id: 'IN-20', name: 'التعلم القائم على المشاريع في العلوم', owner: 'أ. محمد القحطاني', progress: 58, indicator: 'نسبة الطلاب المشاركين', due: 'ربيع 2027' },
  { id: 'IN-19', name: 'بوابة أولياء الأمور — نسبة التفعيل', owner: 'إدارة المدرسة', progress: 86, indicator: 'نسبة الأسر المفعلة ≥ 90%', due: 'نهاية الفصل' },
  { id: 'IN-18', name: 'المختبر الذكي — اعتماد معامل الفيزياء', owner: 'وحدة المختبرات', progress: 41, indicator: 'عدد المعامل المعتمدة', due: 'ربيع 2027' },
];

export const LIBRARY_DOCS = [
  { id: 'DOC-1042', title: 'محضر لجنة التميز المدرسي — أكتوبر 2026', category: 'المحاضر', type: 'PDF', updated: 'اليوم', status: 'معتمد' as const, pages: 6 },
  { id: 'DOC-1039', title: 'خطة الأداء الوظيفي — أ. سارة الحربي', category: 'شواهد الأداء', type: 'DOCX', updated: 'أمس', status: 'معتمد' as const, pages: 12 },
  { id: 'DOC-1036', title: 'تقرير زيارة المشرف العام للتربية الخاصة', category: 'التقارير', type: 'PDF', updated: 'أمس', status: 'قيد المراجعة' as const, pages: 9 },
  { id: 'DOC-1031', title: 'شواهد حصة نانو — فيزياء 2-أ', category: 'شواهد التدريس', type: 'MP4 · 4:12', updated: 'منذ 3 أيام', status: 'معتمد' as const, pages: 1 },
  { id: 'DOC-1027', title: 'خطة التحسين المدرسي 2026 — الفصل الثاني', category: 'الخطط', type: 'PDF', updated: 'منذ 5 أيام', status: 'معتمد' as const, pages: 24 },
  { id: 'DOC-1019', title: 'نموذج تكليف لجنة الأنشطة الطلابية', category: 'التكليفات', type: 'DOCX', updated: 'الأسبوع الماضي', status: 'مسودة' as const, pages: 2 },
  { id: 'DOC-1014', title: 'شهادة اعتماد المختبر العلمي — ISO 17025', category: 'الاعتمادات', type: 'PDF', updated: 'منذ أسبوعين', status: 'معتمد' as const, pages: 4 },
];

export const NOTIFICATIONS: Record<'platform' | 'principal' | 'teacher' | 'family', { id: number; kind: 'alert' | 'info' | 'success' | 'gold'; ar: string; en: string; time: string; timeEn: string }[]> = {
  platform: [
    { id: 1, kind: 'alert', ar: 'مدرسة القمم للتميز: انخفاض الحضور إلى 88.6% — تُوصي بـ«خطة تدخل»', en: 'Al-Qimam School: attendance dropped to 88.6% — intervention recommended', time: 'منذ 12 دقيقة', timeEn: '12m ago' },
    { id: 2, kind: 'gold', ar: 'تحديث أمني مجدول: رافين 4.3 — صيانة الأحد 02:00 ص (30 دقيقة)', en: 'Scheduled security update: Raven 4.3 — Sunday 02:00 (30 min)', time: 'منذ ساعة', timeEn: '1h ago' },
    { id: 3, kind: 'success', ar: 'اكتمل النسخ الاحتياطي المشفّر عبر جميع المستأجرين الـ6', en: 'Encrypted backup completed across all 6 tenants', time: 'اليوم 08:00', timeEn: 'Today 08:00' },
    { id: 4, kind: 'info', ar: 'دعوتان معلقتان لم تفعّلا منذ أكثر من 3 أيام — إرسال تذكير؟', en: '2 pending invitations inactive for 3+ days — send reminder?', time: 'أمس', timeEn: 'Yesterday' },
  ],
  principal: [
    { id: 1, kind: 'alert', ar: 'فهد الغامدي (3-ب) — غاب 6 أيام متتالية، تم إشعار ولي الأمر', en: 'Fahad Al-Ghamdi (3-B) absent 6 days in a row — guardian notified', time: 'منذ 8 دقائق', timeEn: '8m ago' },
    { id: 2, kind: 'gold', ar: 'وردتك 3 شواهد جديدة من أ. سارة الحربي لاعتماد أرشفة «حصة نانو»', en: '3 new evidence files from Sarah Al-Harbi for “Nano Lesson” archive', time: 'منذ 25 دقيقة', timeEn: '25m ago' },
    { id: 3, kind: 'info', ar: 'اجتماع المشرف العام — الخميس 10:30، قاعة الاجتماعات (أرفق جدول الأعمال)', en: 'General supervisor meeting — Thu 10:30, meeting hall (agenda attached)', time: 'منذ ساعة', timeEn: '1h ago' },
    { id: 4, kind: 'success', ar: 'اعتماد مكتمل: تقرير مؤشرات الأداء المدرسي — أكتوبر 2026', en: 'Fully approved: School Performance Indicators Report — Oct 2026', time: 'اليوم 07:30', timeEn: 'Today 07:30' },
  ],
  teacher: [
    { id: 1, kind: 'alert', ar: '3 تسليمات متأخرة — واجب «المعادلات التربيعية» (1-أ)', en: '3 late submissions — “Quadratic Equations” homework (1-A)', time: 'منذ 15 دقيقة', timeEn: '15m ago' },
    { id: 2, kind: 'info', ar: 'تذكير: حصة 2-أ اليوم 10:15 — مختبر الحاسب، القاعة 204', en: 'Reminder: class 2-A today 10:15 — CS lab, Room 204', time: 'منذ 40 دقيقة', timeEn: '40m ago' },
    { id: 3, kind: 'gold', ar: 'أ. خالد المطيري أعاد لك خطة الدرس لإضافة «استراتيجية التمايز»', en: 'Khalid Al-Mutairi returned your lesson plan to add a differentiation strategy', time: 'أمس', timeEn: 'Yesterday' },
    { id: 4, kind: 'success', ar: 'تم رصد درجات اختبار الشهر — بانتظار اعتماد مدير المدرسة', en: 'Monthly exam grades recorded — awaiting principal approval', time: 'أمس', timeEn: 'Yesterday' },
  ],
  family: [
    { id: 1, kind: 'alert', ar: 'ريان تغيّب اليوم عن الحصة الثالثة — تم تسجيل عذر مسبق؟', en: 'Rayan was absent from period 3 today — was an excuse submitted?', time: 'منذ 20 دقيقة', timeEn: '20m ago' },
    { id: 2, kind: 'gold', ar: 'لمى: واجب «كتابة الفقرة التعريفية» سيحل غداً — يمكن المساعدة', en: 'Lama: “Introductory Paragraph” homework is due tomorrow — support available', time: 'منذ ساعة', timeEn: '1h ago' },
    { id: 3, kind: 'success', ar: 'تم رصد درجة اختبار الرياضيات — ريان: 19/20 ممتاز', en: 'Math exam grade recorded — Rayan: 19/20 Excellent', time: 'أمس', timeEn: 'Yesterday' },
    { id: 4, kind: 'info', ar: 'اجتماع مجلس أولياء الأمور — الثلاثاء القادم، عبر منصة مدرستي', en: 'Parents Council meeting — next Tuesday, via Madrasati', time: 'أمس', timeEn: 'Yesterday' },
  ],
};

export const TIMETABLE_TODAY = [
  { period: 1, time: '07:30 – 08:15', subject: 'رياضيات', cls: '3-أ', room: '112', state: 'done' as const },
  { period: 2, time: '08:20 – 09:05', subject: 'رياضيات', cls: '1-أ', room: '204', state: 'done' as const },
  { period: 3, time: '09:25 – 10:10', subject: '— فراغ —', cls: 'فراغ مدرسي', room: '—', state: 'break' as const },
  { period: 4, time: '10:15 – 11:00', subject: 'رياضيات', cls: '2-أ', room: '204', state: 'now' as const },
  { period: 5, time: '11:05 – 11:50', subject: 'رياضيات', cls: '1-أ', room: '204', state: 'upcoming' as const },
  { period: 6, time: '12:10 – 12:55', subject: 'نشاط مدرسي', cls: 'إشراف', room: 'الملعب', state: 'upcoming' as const },
  { period: 7, time: '13:00 – 13:45', subject: 'رياضيات — تصحيح', cls: 'مكتب المعلمة', room: '—', state: 'upcoming' as const },
];

export const TEACHER_CLASSES = [
  { id: '1-أ', grade: 'الصف الأول ثانوي', gradeEn: 'Grade 10', students: 32, avg: 88.4, attendance: 96.5, room: '204' },
  { id: '2-أ', grade: 'الصف الثاني ثانوي', gradeEn: 'Grade 11', students: 28, avg: 86.9, attendance: 95.6, room: '302' },
  { id: '3-أ', grade: 'الصف الثالث متوسط', gradeEn: 'Grade 9', students: 31, avg: 91.2, attendance: 97.8, room: '112' },
];

export const TEACHER_GRADEBOOK = [
  { id: 'ST-3008', name: 'ريان السبيعي', quiz1: 9, quiz2: 10, mid: 18, work: 10 },
  { id: 'ST-3003', name: 'ليان العتيبي', quiz1: 10, quiz2: 9, mid: 19, work: 9 },
  { id: 'ST-3001', name: 'سارة القحطاني', quiz1: 10, quiz2: 10, mid: 20, work: 10 },
  { id: 'ST-3002', name: 'عبدالله الشمري', quiz1: 8, quiz2: 9, mid: 17, work: 9 },
  { id: 'ST-3007', name: 'ريم المطيري', quiz1: 9, quiz2: 10, mid: 19, work: 10 },
  { id: 'ST-3009', name: 'لمى الحربي', quiz1: 7, quiz2: 8, mid: 15, work: 8 },
];

export const HOMEWORK_ITEMS = [
  { id: 'HW-208', title: 'المعادلات التربيعية — التمرين 4 (صفحة 112)', cls: '1-أ', due: 'اليوم 14:00', submitted: 27, total: 32 },
  { id: 'HW-207', title: 'ورقة عمل: المسافة بين نقطتين', cls: '2-أ', due: 'غداً 07:30', submitted: 22, total: 28 },
  { id: 'HW-206', title: 'مشروع: الدوال التربيعية في الحياة اليومية', cls: '3-أ', due: 'الخميس', submitted: 18, total: 31 },
];

export const FAMILY_CHILDREN = [
  { id: 'ST-3008', name: 'ريان السبيعي', gradeAr: 'الصف الثالث متوسط — فصل أ', gradeEn: 'Grade 9 — Section A', age: 15, avg: 85.6, attendance: 96.0, behaviorPts: 94, streak: 212, color: '#08794F' },
  { id: 'ST-3013', name: 'لمى السبيعي', gradeAr: 'الصف الأول ثانوي — فصل ب', gradeEn: 'Grade 10 — Section B', age: 16, avg: 91.8, attendance: 98.2, behaviorPts: 97, streak: 340, color: '#15445A' },
];

export const FAMILY_GRADES = [
  { subject: 'الرياضيات', subjectEn: 'Math', score: 19, max: 20, avg: 15.4, letter: 'ممتاز' },
  { subject: 'العلوم', subjectEn: 'Science', score: 17, max: 20, avg: 14.2, letter: 'جيد جداً' },
  { subject: 'اللغة العربية', subjectEn: 'Arabic', score: 16, max: 20, avg: 13.8, letter: 'جيد جداً' },
  { subject: 'اللغة الإنجليزية', subjectEn: 'English', score: 15, max: 20, avg: 13.1, letter: 'جيد جداً' },
  { subject: 'الحاسب الآلي', subjectEn: 'CS', score: 20, max: 20, avg: 15.9, letter: 'ممتاز' },
  { subject: 'الدراسات الاجتماعية', subjectEn: 'Social', score: 14, max: 20, avg: 12.6, letter: 'جيد' },
];

export const BEHAVIOR_RECORDS = [
  { id: 1, date: 'اليوم 09:05', type: 'متميز' as const, text: 'المشاركة الإيجابية في حصة الرياضيات — استراتيجية حل المسألة', by: 'أ. سارة الحربي', pts: +5 },
  { id: 2, date: 'أمس 11:20', type: 'متميز' as const, text: 'مساعدة زميل في الحصة العملية للمختبر', by: 'أ. محمد القحطاني', pts: +5 },
  { id: 3, date: 'الأحد 08:40', type: 'مخالفة' as const, text: 'تأخر عن الاصطفاف الصباحي (التكرار الأول هذا الفصل)', by: 'أ. رنا العتيبي', pts: -2 },
  { id: 4, date: 'الأسبوع الماضي', type: 'متميز' as const, text: 'الفوز بالمركز الأول في مسابقة المدرسة للقرآن الكريم (فردي)', by: 'إدارة النشاط الطلابي', pts: +15 },
];

export const ATTENDANCE_MONTH = [96, 100, 96, 100, 92, 96, 100, 88, 96, 100, 96, 100, 96, 100, 100, 96, 92, 100, 96, 100, 88, 96, 100, 96];

/* سلاسل شهرية للرسوم البيانية — بيانات تجريبية */
export const MONTHS = ['أبريل', 'مايو', 'يونيو', 'سبتمبر', 'أكتوبر'];
export const MONTHS_EN = ['Apr', 'May', 'Jun', 'Sep', 'Oct'];
export const ATTENDANCE_TREND = [91.2, 92.8, 93.5, 94.6, 96.2];
export const AVG_TREND = [82.1, 83.4, 84.0, 85.8, 88.4];
export const COMMITTEES = [
  { name: 'لجنة التميز المدرسي', chair: 'أ. رنا العتيبي', members: 7, meetings: 12, status: 'نشطة' as const },
  { name: 'لجنة الموهوبين', chair: 'أ. يوسف الغامدي', members: 5, meetings: 8, status: 'نشطة' as const },
  { name: 'لجنة التوجيه الطلابي', chair: 'أ. هند المطيري', members: 6, meetings: 10, status: 'نشطة' as const },
  { name: 'لجنة الصحة والسلامة', chair: 'أ. فواز السبيعي', members: 5, meetings: 6, status: 'نشطة' as const },
  { name: 'لجنة الأنشطة الطلابية', chair: 'أ. لمى الزامل', members: 8, meetings: 9, status: 'نشطة' as const },
];
