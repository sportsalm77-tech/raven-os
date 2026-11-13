import { notFound } from "next/navigation";
import { PortalCenterDashboard } from "@/components/portal-center-dashboard";
import { PlatformAdminRecords } from "@/components/platform-admin-records";
import { PortalShell } from "@/components/portal-shell";
import { PrincipalInfoCenter } from "@/components/principal-info-center";
import { PrincipalAssignmentsCenter } from "@/components/principal-assignments-center";
import { PrincipalDecisionCenter, PrincipalOperationalPlan, PrincipalImpactCenter, PrincipalSchoolAffairsCenter } from "@/components/principal-management-centers";
import { PrincipalClassesCenter } from "@/components/principal-classes-center";
import { PrincipalOperationsScreen, type PrincipalOperationsArea } from "@/components/principal-operations-screen";
import { PrincipalSupportServicesScreen, type PrincipalSupportArea } from "@/components/principal-support-services-screen";
import { PrincipalGovernanceScreen, type PrincipalGovernanceArea } from "@/components/principal-governance-screen";
import { PortalModuleWorkspace } from "@/components/portal-module-workspace";
import { TeacherSectionWorkspace } from "@/components/teacher-portal-workspace";
import { FamilySectionWorkspace } from "@/components/family-section-workspace";
import { PORTAL_NAVS, type PortalId } from "@/lib/nav";

export function PortalSectionPage({ portal, slug }: { portal: PortalId; slug: string[] }) {
  if(slug.length===2 && slug[0]==="centers" && /^\\d+$/.test(slug[1])) {
    const index=Number(slug[1]);
    if(index<0||index>=PORTAL_NAVS[portal].length)notFound();
    return <PortalShell portal={portal}><PortalCenterDashboard portal={portal} index={index}/></PortalShell>;
  }
  const path = "/" + portal + "/" + slug.join("/");
  const item = PORTAL_NAVS[portal].flatMap(group => group.items).find(entry => entry.to === path);
  // `end` marks an exact-match navigation entry, not a disabled route.
  // Reject only paths missing from the registered portal navigation.
  if (!item) notFound();

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
  if (portal === "principal" && path === "/principal/classes") {
    return <PortalShell portal="principal"><PrincipalClassesCenter /></PortalShell>;
  }

  const principalOperations: Record<string, PrincipalOperationsArea> = {
    "/principal/teachers": "teachers",
    "/principal/students": "students",
    "/principal/exams/grades": "grades",
    "/principal/exams/control": "exam-control",
    "/principal/behavior/absence": "absence",
    "/principal/behavior/violations": "violations",
    "/principal/behavior/positive": "positive",
  };
  const principalSupport: Record<string, PrincipalSupportArea> = {
    "/principal/library": "library",
    "/principal/timetable": "timetable",
    "/principal/health": "health",
    "/principal/activities": "activities",
    "/principal/talented": "talented",
    "/principal/special-ed": "special-ed",
    "/principal/resources": "resources",
    "/principal/labs": "labs",
    "/principal/integrations/noor": "noor",
    "/principal/integrations/madrasati": "madrasati",
    "/principal/integrations/hudori": "hudori",
    "/principal/assistant": "assistant",
  };
  const supportArea = portal === "principal" ? principalSupport[path] : undefined;
  if (supportArea) {
    return <PortalShell portal="principal"><PrincipalSupportServicesScreen area={supportArea} /></PortalShell>;
  }

  const principalGovernance: Record<string, PrincipalGovernanceArea> = {
    "/principal/permissions": "permissions",
    "/principal/settings": "settings",
    "/principal/reports": "reports",
  };
  const governanceArea = portal === "principal" ? principalGovernance[path] : undefined;
  if (governanceArea) {
    return <PortalShell portal="principal"><PrincipalGovernanceScreen area={governanceArea} /></PortalShell>;
  }

  const operationsArea = portal === "principal" ? principalOperations[path] : undefined;
  if (operationsArea) {
    return <PortalShell portal="principal"><PrincipalOperationsScreen area={operationsArea} /></PortalShell>;
  }

  if (portal === "family") {
    return <PortalShell portal="family"><FamilySectionWorkspace slug={slug[0] ?? ""} /></PortalShell>;
  }

  if (portal === "teacher") {
    return <PortalShell portal="teacher"><TeacherSectionWorkspace slug={slug[0] ?? ""} /></PortalShell>;
  }

  if (portal === "platform" && ["/platform/schools","/platform/subscriptions","/platform/communications","/platform/support","/platform/settings","/platform/roles"].includes(path)) {
    return <PortalShell portal="platform"><PlatformAdminRecords path={path}/></PortalShell>;
  }
  return <PortalModuleWorkspace portal={portal} item={{ ar: item.ar, en: item.en }} path={path} />;
}
