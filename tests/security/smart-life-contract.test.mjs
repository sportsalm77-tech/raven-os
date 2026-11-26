import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const load=p=>readFileSync(p,"utf8");
const nav=load("src/lib/nav.ts");
const ui=load("src/components/raven-smart-life-workspace.tsx");
const api=load("src/app/api/smart-life/route.ts");
const sql=load("supabase/migrations/20261126190000_raven_smart_life.sql");
test("Smart Life and timetable are in all Raven main portal navigations",()=>{
 for(const path of ["/platform/smart-life","/principal/smart-life","/teacher/smart-life","/family/smart-life"])assert.ok(nav.includes(path),path);
 for(const path of ["/principal/timetable","/teacher/timetable","/family/timetable"])assert.ok(nav.includes(path),path);
 assert.match(nav,/Smart Life — أصل اليوم/);
 assert.match(nav,/الجدول الذكي/);
 const route=load("src/components/portal-section-page.tsx");
 assert.match(route,/RavenSmartLifeWorkspace/);
 assert.match(route,/path === "\/family\/timetable"/);
});
test("Native Raven dashboards have Smart Life previews without replacing their identity",()=>{
 for(const [file,role] of [
  ["src/components/principal-executive-dashboard.tsx","principal"],
  ["src/components/teacher-portal-workspace.tsx","teacher"],
  ["src/components/platform-command-center.tsx","platform"],
  ["src/components/portal-dashboard.tsx","family"]]){
  const s=load(file);assert.match(s,/RavenSmartLifeWorkspace/);
  assert.ok(s.includes('portal="'+role+'"'));
 }
 assert.match(ui,/rf-card/);assert.match(ui,/text-\[#064e3b\]/);
 assert.match(ui,/RAVEN SMART LIFE/);
 assert.match(ui,/displayTime\(remaining\)/);
 assert.match(ui,/toLocaleLowerCase|setSelectedDate|setShowWeek/);
});
test("Server enforces signed cookie identity, tenant membership and private data access",()=>{
 assert.match(api,/lookupIdentity\("Bearer "\+token\)/);
 assert.match(api,/canEnterPortal\(identity,selected,schoolId\)/);
 assert.match(api,/school_id:"eq\."\+schoolId/);
 assert.match(api,/school_id:"eq\."\+school_id/);
 assert.match(api,/raven_smart_life_class_roster/);
 assert.match(api,/invalid_origin/);
 assert.match(api,/preview_is_read_only/);
 assert.match(api,/family_read_only/);
 assert.match(api,/originalRequestToken|ctx\.token/);
 assert.doesNotMatch(api,/SERVICE_ROLE|service_role|SUPABASE_SECRET_KEY/);
});
test("RLS guards school isolation, teacher proposals, family verified relationship",()=>{
 for(const table of ["raven_smart_life_standards","raven_smart_life_sessions","raven_smart_life_tasks","raven_smart_life_class_roster"])assert.ok(sql.includes("alter table public."+table+" enable row level security"));
 assert.match(sql,/raven_school_memberships/);
 assert.match(sql,/school_id=raven_smart_life_sessions.school_id/);
 assert.match(sql,/g\.guardian_id=\(select auth\.uid\(\)\)/);
 assert.match(sql,/g\.status='active'/);
 assert.match(sql,/roster\.class_code=raven_smart_life_sessions\.class_code/);
 assert.match(sql,/origin='teacher_extra' and created_by=\(select auth\.uid\(\)\)/);
 assert.match(sql,/status='pending' and public\.raven_smart_life_is_teacher\(school_id\)/);
 assert.match(sql,/raven_sl_validate/);
 assert.match(sql,/raven_sl_sessions_audit/);
 assert.doesNotMatch(sql,/create policy.*(?:using\s*\(\s*true\s*\)|with check\s*\(\s*true\s*\))/i);
});
test("Raven Smart Life is intentionally isolated from the Nibras project",()=>{
 assert.doesNotMatch(ui,/\/app\/smart-life|nibras-smart-life|nibras_membership/);
 assert.doesNotMatch(api,/nursery_id|nibras/);
 assert.match(ui,/teacher_extra|طلب حصة إضافية/);
 assert.match(ui,/meet\.google\.com|teams\.microsoft\.com/);
});

test("Visual showcase is preview-only, mock-only, and cannot mutate school data",()=>{
 const route=load("src/app/preview/smart-life/page.tsx");
 assert.match(route,/process\.env\.VERCEL_ENV==="production"\)notFound\(\)/);
 assert.match(route,/RavenSmartLifeWorkspace key=\{role\} portal=\{role\} illustrative/);
 assert.match(route,/views\.map\(/);
 const ui=load("src/components/raven-smart-life-workspace.tsx");
 assert.match(ui,/if\(illustrative\)\{queueMicrotask/);
 assert.match(ui,/if\(data\?\.demo\)throw Error/);
 assert.match(ui,/معاينة مرئية ببيانات توضيحية فقط/);
 assert.match(ui,/disabled=\{busy\|\|data\?\.demo\}/);
});
