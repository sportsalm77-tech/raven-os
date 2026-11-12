import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { RavenPortal } from "@/lib/security/portal-authorization";

export const DEMO_COOKIE = "raven_demo_preview";
const portals: RavenPortal[] = ["platform", "principal", "teacher", "family"];
export function demoEnabled() {
  return process.env.VERCEL_ENV === "preview" &&
    process.env.RAVEN_DEMO_ENABLED === "true" &&
    typeof process.env.RAVEN_DEMO_SECRET === "string" &&
    process.env.RAVEN_DEMO_SECRET.length >= 32;
}
function signature(payload: string): string {
  return createHmac("sha256", process.env.RAVEN_DEMO_SECRET!).update(payload).digest("hex");
}
export function issueDemoSession(portal: RavenPortal): string {
  if (!demoEnabled() || !portals.includes(portal)) throw new Error("Demo unavailable");
  const payload = portal + ":" + (Math.floor(Date.now() / 1000) + 1800);
  return payload + "." + signature(payload);
}
export function verifyDemoSession(value: string | undefined, portal: RavenPortal): boolean {
  if (!demoEnabled() || !value || value.length > 200) return false;
  const i = value.lastIndexOf(".");
  if (i < 0) return false;
  const payload = value.slice(0, i), mac = value.slice(i + 1);
  const [role, expires, extra] = payload.split(":");
  if (extra !== undefined || role !== portal || !/^\\d{10}$/.test(expires)) return false;
  const exp = Number(expires), now = Math.floor(Date.now() / 1000);
  if (exp < now || exp > now + 1800) return false;
  const expected = signature(payload);
  if (!/^[a-f0-9]{64}$/.test(mac)) return false;
  return timingSafeEqual(Buffer.from(mac, "hex"), Buffer.from(expected, "hex"));
}
