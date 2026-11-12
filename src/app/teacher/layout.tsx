import { requirePortalAccess } from "@/lib/security/require-portal-access";
export const dynamic = "force-dynamic";
export default async function TeacherLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requirePortalAccess("teacher");
  return <>{children}</>;
}
