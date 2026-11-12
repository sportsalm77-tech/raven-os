"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

type Destination = { portal: string; school_id?: string; href: string };
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setMessage(""); setDestinations([]);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), credentials: "same-origin",
        cache: "no-store",
      });
      const data = await response.json();
      setPassword("");
      if (!response.ok) {
        setMessage(data.error === "invalid_credentials" ? "بيانات الدخول غير صحيحة." :
          data.error === "no_active_membership" ? "لا توجد عضوية نشطة لهذا الحساب." :
          data.error === "service_unavailable" ? "خدمة الدخول غير مهيأة أو غير متاحة حاليًا." :
          "تعذر تسجيل الدخول. تحقق من البيانات وحاول مجددًا.");
        return;
      }
      const next = data.destinations as Destination[];
      if (!Array.isArray(next) || !next.length) { setMessage("تعذر تحديد البوابة."); return; }
      if (next.length === 1) { window.location.assign(next[0].href); return; }
      setDestinations(next);
    } catch { setMessage("تعذر الاتصال بخدمة الدخول."); }
    finally { setBusy(false); }
  }
  if (process.env.NEXT_PUBLIC_RAVEN_AUTH_ENABLED !== "true") return <main className="container" style={{ paddingBlock: 80 }}><div className="portal-panel" style={{ maxWidth: 620, marginInline: "auto" }}><h1>تسجيل الدخول</h1><p className="portal-notice">لا توجد مصادقة فعلية مفعّلة في نسخة المعاينة الحالية. لن يتم طلب كلمة المرور قبل استكمال التهيئة والاختبارات.</p><Link href="/">العودة إلى الصفحة الرئيسية</Link></div></main>;
  return <main className="container" style={{ paddingBlock: 80 }}>
    <div className="portal-panel" style={{ maxWidth: 620, marginInline: "auto" }}>
      <span className="eyebrow">RAVEN OS</span>
      <h1>تسجيل الدخول الآمن</h1>
      <p className="section-intro">استخدم حسابك المعتمد في منظومة رافين التعليمية.</p>
      <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
        <label>البريد الإلكتروني
          <input style={{ display: "block", width: "100%", padding: 12 }} type="email" required
            autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <label>كلمة المرور
          <input style={{ display: "block", width: "100%", padding: 12 }} type="password" required
            autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        <button className="button" type="submit" disabled={busy}>{busy ? "جارٍ التحقق..." : "تسجيل الدخول"}</button>
      </form>
      {message && <p role="alert" className="portal-notice" style={{ marginTop: 16 }}>{message}</p>}
      {destinations.length > 1 && <div style={{ marginTop: 24 }}>
        <h2>اختر بوابتك</h2>
        {destinations.map(d => <p key={d.href}><a className="button" href={d.href}>{d.portal} {d.school_id ? "— " + d.school_id : ""}</a></p>)}
      </div>}
      <p style={{ marginTop: 24 }}><Link href="/">العودة إلى الصفحة الرئيسية</Link></p>
    </div>
  </main>;
}
