import { requirePortalAccess } from "@/lib/security/require-portal-access";
export const dynamic = "force-dynamic";
export default async function PrincipalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requirePortalAccess("principal");
  return <>{children}</>;
}
