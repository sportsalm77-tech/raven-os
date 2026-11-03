import Link from "next/link";

const services = [
  ["مركز القرار الإداري", "تحويل المؤشرات والبيانات إلى قرارات وإجراءات قابلة للمتابعة."],
  ["مركز العمليات المدرسية", "تنظيم الأعمال والتكليفات والمتابعة والتنفيذ."],
  ["مكتبة الملفات الذكية", "بناء الملفات والشواهد من بيانات منظمة تُدخل مرة واحدة."],
  ["المؤشرات والتحسين", "متابعة الأداء ورصد فرص التحسين بصورة مترابطة."]
];

const portals = [
  ["/platform", "إدارة المنصة", "إدارة المنظومة والإعدادات العامة."],
  ["/principal", "مدير المدرسة", "إدارة العمليات والملفات والمؤشرات المدرسية."],
  ["/teacher", "المعلم", "مساحة العمل والتكليفات والشواهد."],
  ["/family", "الأسرة", "بوابة التواصل والمتابعة الأسرية."]
];

export default function HomePage() {
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="brand"><span className="brand-mark">ر</span><span>رافين</span></Link>
          <nav className="nav-links" aria-label="التنقل الرئيسي">
            <a href="#platform">المنصة</a><a href="#services">الخدمات</a><a href="#audience">الفئات المستهدفة</a><a href="#portals">بوابات رافين</a>
          </nav>
          <div className="header-actions"><a className="button secondary" href="#portals">استكشاف البوابات</a><Link className="button" href="/login">تسجيل الدخول</Link></div>
        </div>
      </header>
      <main>
        <section className="hero" id="platform">
          <div className="container">
            <span className="eyebrow">RAVEN OS · منظومة تعليمية مترابطة</span>
            <h1>منصة رافين التعليمية</h1>
            <p>منظومة تنظّم العمل التعليمي والإداري في مسار واحد؛ من التخطيط والإجراءات إلى التكليف والمتابعة والتنفيذ، ثم الشواهد والأرشفة والمؤشرات والتحسين.</p>
            <div className="hero-actions"><a className="button" href="#services">اكتشف خدمات رافين</a><a className="button secondary" href="#portals">بوابات المنظومة</a></div>
            <div className="workflow" aria-label="دورة العمل في رافين">
              {["التخطيط","الإجراءات","التكليف","المتابعة","التنفيذ","الشواهد والأرشفة","المؤشرات والتحسين"].map(item => <span key={item}>{item}</span>)}
            </div>
          </div>
        </section>
        <section className="section" id="services">
          <div className="container">
            <span className="eyebrow">خدمات المنظومة</span><h2>كل العمل في مسار مترابط</h2>
            <p className="section-intro">تجمع رافين أدوات العمل المدرسي في تجربة واحدة، وتقلل تكرار إدخال البيانات وتشتت الملفات.</p>
            <div className="cards">{services.map(([name, description]) => <article className="card" key={name}><h3>{name}</h3><p>{description}</p></article>)}</div>
          </div>
        </section>
        <section className="section" id="audience" style={{ background: "#eeeee5" }}>
          <div className="container"><span className="eyebrow">الفئات المستهدفة</span><h2>تجربة متصلة لكل مستخدم</h2><p className="section-intro">تُبنى البوابات وفق الدور والصلاحيات، مع الحفاظ على خصوصية بيانات كل مدرسة.</p></div>
        </section>
        <section className="section" id="portals">
          <div className="container"><span className="eyebrow">بوابات رافين</span><h2>مساحة مخصصة لكل دور</h2>
            <div className="cards">{portals.map(([href, name, description]) => <article className="card" key={href}><h3>{name}</h3><p>{description}</p><Link className="card-link" href={href}>فتح الواجهة ←</Link></article>)}</div>
          </div>
        </section>
        <section className="section" style={{ paddingTop: 12 }}>
          <div className="container"><div className="portal-panel"><span className="eyebrow">هوية رافين</span><h2>مؤسسة رافيين للخدمات التعليمية</h2><p className="section-intro">نحن نصنع الفرق</p></div></div>
        </section>
      </main>
      <footer className="site-footer"><div className="container"><p><strong>مؤسسة رافيين للخدمات التعليمية</strong></p><p>نحن نصنع الفرق</p><p style={{ marginTop: 18, fontSize: ".85rem" }}>© رافين — جميع الحقوق محفوظة</p></div></footer>
    </>
  );
}
