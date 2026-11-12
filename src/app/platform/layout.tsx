import { requirePortalAccess } from "@/lib/security/require-portal-access";
export const dynamic = "force-dynamic";
export default async function PlatformLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requirePortalAccess("platform");
  return <>{children}</>;
}
