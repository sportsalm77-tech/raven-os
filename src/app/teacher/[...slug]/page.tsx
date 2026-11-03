import { PortalSectionPage } from "@/components/portal-section-page";
import type { PortalId } from "@/lib/nav";

export default async function SectionPage({ params }: { params: Promise<{ slug: string[] }> }) {
 const { slug } = await params;
 return <PortalSectionPage portal={"teacher" as PortalId} slug={slug} />;
}
