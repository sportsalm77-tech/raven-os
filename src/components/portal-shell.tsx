import Link from "next/link";

type PortalShellProps = {
  title: string;
  subtitle: string;
  sections: string[];
};

export function PortalShell({ title, subtitle, sections }: PortalShellProps) {
  return (
    <div className="portal-wrap">
      <header className="portal-top">
        <div className="container portal-top-inner">
          <Link href="/" className="brand"><span className="brand-mark">ر</span><span>رافين</span></Link>
          <Link href="/" className="button secondary" style={{ color: "white", borderColor: "rgba(255,255,255,.35)" }}>العودة للرئيسية</Link>
        </div>
      </header>
      <main className="container portal-main">
        <div className="portal-panel">
          <span className="eyebrow">RAVEN OS · بوابات رافين</span>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3rem)", margin: "12px 0" }}>{title}</h1>
          <p className="section-intro">{subtitle}</p>
          <div className="cards">
            {sections.map((section) => (
              <article className="card" key={section}>
                <h3>{section}</h3>
                <p>واجهة العمل المعتمدة لهذا القسم قيد الدمج والتحقق.</p>
              </article>
            ))}
          </div>
          <div className="portal-notice">
            هذه نسخة إنقاذ قيد التطوير. لم يتم ربط المصادقة أو الصلاحيات أو بيانات المدارس بعد؛ لذلك لا تُستخدم لإدارة بيانات حقيقية أو لاتخاذ إجراءات تشغيلية.
          </div>
        </div>
      </main>
    </div>
  );
}
