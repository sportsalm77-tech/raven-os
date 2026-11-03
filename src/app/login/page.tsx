import Link from "next/link";
export default function LoginPage() {
  return <main className="container" style={{ paddingBlock: 80 }}><div className="portal-panel" style={{ maxWidth: 620, marginInline: "auto" }}><span className="eyebrow">RAVEN OS</span><h1>تسجيل الدخول</h1><p className="section-intro">بوابة الدخول الموحدة قيد الربط بخدمة المصادقة المعتمدة.</p><div className="portal-notice">لا توجد مصادقة فعلية مفعّلة في نسخة الإنقاذ الحالية. لن يتم قبول بيانات دخول أو تخزينها هنا.</div><p style={{ marginTop: 24 }}><Link className="button" href="/">العودة إلى الصفحة الرئيسية</Link></p></div></main>;
}
