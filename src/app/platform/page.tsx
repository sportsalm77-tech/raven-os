import { PortalShell } from "@/components/portal-shell";
export default function PlatformPage() {
  return <PortalShell title="إدارة المنصة" subtitle="الإدارة المركزية لمنظومة رافين وإعداداتها، مع فصل بيانات المدارس وصلاحياتها." sections={["إدارة المدارس","إدارة الحسابات والأدوار","إعدادات المنصة","مراقبة سلامة النظام"]} />;
}
