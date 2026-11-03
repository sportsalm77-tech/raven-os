import Link from "next/link";
import { notFound } from "next/navigation";
import { PortalShell } from "@/components/portal-shell";
import { EmptyState, PageHead, SectionCard } from "@/components/raven-ui";
import { PrincipalInfoCenter } from "@/components/principal-info-center";
import { PORTAL_NAVS, type PortalId } from "@/lib/nav";

export function PortalSectionPage({ portal, slug }: { portal: PortalId; slug: string[] }) {
  const path = "/" + portal + "/" + slug.join("/");
  const item = PORTAL_NAVS[portal].flatMap(group => group.items).find(entry => entry.to === path);
  if (!item || item.end) notFound();

  if (portal === "principal" && path === "/principal/info-center") {
    return <PortalShell portal="principal"><PrincipalInfoCenter /></PortalShell>;
  }

  return (
    <PortalShell portal={portal}>
      <PageHead
        icon={item.icon}
        eyebrow={`RAVEN OS · ${portal.toUpperCase()}`}
        title={item.ar}
        description={item.en}
      />
      <SectionCard title="مساحة القسم" description="تم ربط المسار بالتنقل الموحد.">
        <EmptyState
          title="القسم قيد الربط"
          description="واجهة هذا القسم لم تُربط بعد بمصدر بيانات تشغيلي أو صلاحيات خادمية. لن نعرض سجلات تجريبية أو نوهمك بحفظ أو اعتماد غير منفذ."
        />
        <Link href={"/" + portal} className="mt-5 inline-flex text-sm font-bold text-[#08794F]">العودة إلى البوابة ←</Link>
      </SectionCard>
    </PortalShell>
  );
}
