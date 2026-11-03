import { PortalDashboard } from "@/components/portal-dashboard";
import type { PortalId } from "@/lib/nav";

export default function PortalPage() {
  return <PortalDashboard portal={"teacher" as PortalId} />;
}
