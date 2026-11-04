import { notFound } from "next/navigation";
import { PortalShell } from "@/components/portal-shell";
import { PrincipalInfoCenter } from "@/components/principal-info-center";
import { PrincipalAssignmentsCenter } from "@/components/principal-assignments-center";
import { PrincipalDecisionCenter, PrincipalOperationalPlan, PrincipalImpactCenter, PrincipalSchoolAffairsCenter } from "@/components/principal-management-centers";
import { PortalModuleWorkspace } from "@/components/portal-module-workspace";
import { PORTAL_NAVS, type PortalId } from "@/lib/nav";

export function PortalSectionPage({ portal, slug }: { portal: PortalId; slug: string[] }) {
  const path = "/" + portal + "/" + slug.join("/");
  const item = PORTAL_NAVS[portal].flatMap(group => group.items).find(entry => entry.to === path);
  if (!item || item.end) notFound();

  if (portal === "principal" && path === "/principal/info-center") {
    return <PortalShell portal="principal"><PrincipalInfoCenter /></PortalShell>;
  }
  if (portal === "principal" && path === "/principal/assignments") {
    return <PortalShell portal="principal"><PrincipalAssignmentsCenter /></PortalShell>;
  }
  if (portal === "principal" && path === "/principal/decision-center") {
    return <PortalShell portal="principal"><PrincipalDecisionCenter /></PortalShell>;
  }
  if (portal === "principal" && path === "/principal/operational-plan") {
    return <PortalShell portal="principal"><PrincipalOperationalPlan /></PortalShell>;
  }
  if (portal === "principal" && path === "/principal/impact") {
    return <PortalShell portal="principal"><PrincipalImpactCenter /></PortalShell>;
  }
  if (portal === "principal" && path === "/principal/school-affairs") {
    return <PortalShell portal="principal"><PrincipalSchoolAffairsCenter /></PortalShell>;
  }

  return <PortalModuleWorkspace portal={portal} item={item} path={path} />;
}
