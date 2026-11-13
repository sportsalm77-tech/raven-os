import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type Lang = 'ar' | 'en';

const dict = {
  search: { ar: 'ابحث في رافين…', en: 'Search Raven OS…' },
  notifications: { ar: 'الإشعارات', en: 'Notifications' },
  markAllRead: { ar: 'تحديد الكل كمقروء', en: 'Mark all as read' },
  viewAll: { ar: 'عرض الكل', en: 'View all' },
  signOut: { ar: 'تسجيل الخروج', en: 'Sign out' },
  myProfile: { ar: 'ملفي الشخصي', en: 'My profile' },
  settings: { ar: 'الإعدادات', en: 'Settings' },
  sampleData: { ar: 'بيانات تجريبية لأغراض العرض', en: 'Sample data for demonstration' },
  save: { ar: 'حفظ', en: 'Save' },
  cancel: { ar: 'إلغاء', en: 'Cancel' },
  exportPdf: { ar: 'تصدير PDF', en: 'Export PDF' },
  exportExcel: { ar: 'تصدير Excel', en: 'Export Excel' },
  upload: { ar: 'رفع ملف', en: 'Upload file' },
  generate: { ar: 'توليد الملف', en: 'Generate document' },
  approve: { ar: 'اعتماد', en: 'Approve' },
  add: { ar: 'إضافة', en: 'Add' },
  edit: { ar: 'تعديل', en: 'Edit' },
  backToPortals: { ar: 'كل البوابات', en: 'All portals' },
  switchPortal: { ar: 'التبديل بين البوابات', en: 'Switch portals' },
  portalDemo: { ar: 'مبدّل بصري للعرض فقط — ليس صلاحيات', en: 'Visual demo switcher — not authorization' },
  verifiedAccess: { ar: 'وصول موثّق حسب الدور', en: 'Role-verified access' },
  weeklyReport: { ar: 'التقرير الأسبوعي', en: 'Weekly report' },
  signature: { ar: 'مؤسسة رافيين للخدمات التعليمية — نحن نصنع الفرق', en: 'Rafeeen Foundation for Educational Services — We Make the Difference' },
  home: { ar: 'الرئيسية', en: 'Home' },
} as const;

export type I18nKey = keyof typeof dict;

interface I18nCtx {
  lang: Lang;
  dir: 'rtl' | 'ltr';
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (k: I18nKey) => string;
  isAr: boolean;
}
const Ctx = createContext<I18nCtx>({
  lang: 'ar', dir: 'rtl', setLang: () => {}, toggleLang: () => {}, t: (k) => dict[k].ar, isAr: true,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem('raven-lang') as Lang) || 'ar');
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('raven-lang', lang);
  }, [lang]);
  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleLang = useCallback(() => setLangState((p) => (p === 'ar' ? 'en' : 'ar')), []);
  const t = useCallback((k: I18nKey) => dict[k][lang], [lang]);
  return <Ctx.Provider value={{ lang, dir: lang === 'ar' ? 'rtl' : 'ltr', setLang, toggleLang, t, isAr: lang === 'ar' }}>{children}</Ctx.Provider>;
}
export const useLang = () => useContext(Ctx);

/** Dual-field helper: picks ar/en from {ar, en} objects */
export const L = (isAr: boolean, ar: string, en: string) => (isAr ? ar : en);
