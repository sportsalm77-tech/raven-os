import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";
import { PORTAL_NAVS, type PortalId } from "@/lib/nav";

const portal: PortalId = "teacher";
const title = "بوابة المعلم";
const description = "مساحة عمل المعلم لمتابعة التكليفات والخطط والتنفيذ والشواهد.";

export default function PortalPage() {
 const groups = PORTAL_NAVS[portal];
 return <PortalShell portal={portal}>
  <section className="mb-7">
   <div className="mb-2 text-xs font-extrabold tracking-wide text-[#08794F]">RAVEN OS · TEACHER</div>
   <h1 className="text-3xl font-black text-[#111A18]">{title}</h1>
   <p className="mt-3 max-w-3xl text-sm leading-7 text-[#66736e]">{description}</p>
  </section>
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
   {groups.flatMap(group => group.items).map(item => {
    const Icon = item.icon;
    return <Link key={item.to} href={item.to} className="group rounded-2xl border border-black/10 bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#08794F]/40 hover:shadow-lg">
     <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-[#08794F]/10 text-[#08794F]"><Icon size={19}/></div>
     <h2 className="font-extrabold text-[#111A18]">{item.ar}</h2>
     <p className="mt-1 text-xs text-[#66736e]">{item.en}</p>
     <span className="mt-4 inline-flex text-xs font-bold text-[#08794F]">فتح القسم ←</span>
    </Link>;
   })}
  </div>
 </PortalShell>;
}
