import Link from "next/link";
import { notFound } from "next/navigation";
import { PortalShell } from "@/components/portal-shell";
import { RavenSmartLifeWorkspace } from "@/components/raven-smart-life-workspace";
import type { PortalId } from "@/lib/nav";

export const dynamic = "force-dynamic";
export const metadata = {title:"RAVEN OS — Smart Life · معاينة غير تشغيلية",robots:{index:false,follow:false}};
const views:{role:PortalId;ar:string;en:string}[]=[
 {role:"platform",ar:"مدير المنصة",en:"Platform"},
 {role:"principal",ar:"مدير المدرسة",en:"Principal"},
 {role:"teacher",ar:"المعلم",en:"Teacher"},
 {role:"family",ar:"الأسرة",en:"Family"}
];

/** Preview-only, read-only and entirely independent of school auth/data. */
export default async function SmartLifePreview({searchParams}:{searchParams:Promise<{portal?:string}>}){
 if(process.env.VERCEL_ENV==="production")notFound();
 const selected=(await searchParams).portal??"teacher";
 const role=views.find(x=>x.role===selected)?.role??"teacher";
 return <PortalShell portal={role}>
  <div className="space-y-5">
   <section className="rounded-2xl border-2 border-[#D4AF37]/50 bg-[#faf8f3] p-4 text-right text-sm text-[#183b2d]" dir="rtl">
    <strong className="block text-lg">RAVEN SMART LIFE — معاينة الخدمات</strong>
    <p className="mt-2 leading-7">هذه معاينة معزولة ببيانات تعليمية خيالية. لا تتصل بقاعدة بيانات أي مدرسة، ولا تحفظ أو تنشر أو تعتمد الحصص.</p>
    <nav aria-label="اختيار البوابة للمعاينة" className="mt-4 flex flex-wrap gap-2">
     {views.map(v=><Link key={v.role} href={"/preview/smart-life?portal="+v.role}
       aria-current={role===v.role?"page":undefined}
       className={"rounded-xl border px-4 py-2 text-xs font-extrabold "+(role===v.role?"border-[#d4af37] bg-[#08794F] text-white":"border-[#bcd4c4] bg-white text-[#064e3b]")}>
       {v.ar} · {v.en}
     </Link>)}
    </nav>
   </section>
   <div className="rounded-2xl border border-[#d4af37]/30 bg-white p-4 md:p-6">
    <RavenSmartLifeWorkspace key={role} portal={role} illustrative />
   </div>
  </div>
 </PortalShell>;
}
