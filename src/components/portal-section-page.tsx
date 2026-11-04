import { notFound } from "next/navigation";
import { PortalShell } from "@/components/portal-shell";
import { PrincipalInfoCenter } from "@/components/principal-info-center";
import { PrincipalAssignmentsCenter } from "@/components/principal-assignments-center";
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

  return <PortalModuleWorkspace portal={portal} item={item} path={path} />;
}
