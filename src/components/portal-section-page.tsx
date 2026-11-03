import Link from "next/link";
import { notFound } from "next/navigation";
import { PortalShell } from "@/components/portal-shell";
import { PORTAL_NAVS, type PortalId } from "@/lib/nav";

export function PortalSectionPage({ portal, slug }: { portal: PortalId; slug: string[] }) {
 const path = "/" + portal + "/" + slug.join("/");
 const item = PORTAL_NAVS[portal].flatMap(group => group.items).find(entry => entry.to === path);
 if (!item || item.end) notFound();
 const Icon = item.icon;
 return <PortalShell portal={portal}>
  <div className="mb-7 flex items-start gap-4">
   <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#08794F]/10 text-[#08794F]"><Icon size={23}/></div>
   <div><div className="text-xs font-bold text-[#08794F]">RAVEN OS · {portal.toUpperCase()}</div><h1 className="mt-1 text-2xl font-black text-[#111A18]">{item.ar}</h1><p className="mt-1 text-sm text-[#66736e]">{item.en}</p></div>
  </div>
  <section className="rounded-2xl border border-black/10 bg-white p-6">
   <h2 className="font-extrabold text-[#111A18]">مساحة القسم</h2>
   <p className="mt-2 text-sm leading-7 text-[#66736e]">تم إنشاء مسار هذا القسم وربطه بالتنقل. نقل مكونات Arena التشغيلية وربط البيانات والتحقق من الصلاحيات ما زال ضمن مراحل الدمج التالية.</p>
   <div className="mt-5 rounded-xl bg-[#F5F3EC] p-4 text-xs leading-6 text-[#66736e]">هذه مساحة هيكلية وليست نموذج إدخال أو اعتماد فعليًا. لا تحفظ بيانات ولا تنفذ إجراءات مدرسية حاليًا.</div>
   <Link href={"/"+portal} className="mt-5 inline-flex text-sm font-bold text-[#08794F]">العودة إلى البوابة ←</Link>
  </section>
 </PortalShell>;
}
