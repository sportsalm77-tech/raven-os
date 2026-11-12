import { requirePortalAccess } from "@/lib/security/require-portal-access";
export const dynamic = "force-dynamic";
export default async function FamilyLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requirePortalAccess("family");
  return <>{children}</>;
}
