"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, X, ArrowUpLeft, LayoutGrid } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { PORTAL_NAVS, type PortalId } from "@/lib/nav";

function normalize(value:string) {
 return value.normalize("NFKC").replace(/[\u064B-\u065F\u0670]/g,"").replace(/[أإآ]/g,"ا").replace(/ى/g,"ي").toLocaleLowerCase().trim();
}
export function PortalCommandPalette({portal}:{portal:PortalId}) {
 const {isAr}=useLang();
 const [open,setOpen]=useState(false);
 const [query,setQuery]=useState("");
 const [center,setCenter]=useState<string|null>(null);
 const input=useRef<HTMLInputElement>(null);
 const groups=PORTAL_NAVS[portal];
 useEffect(()=>{
  function key(e:KeyboardEvent){
   if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();setOpen(v=>!v)}
   if(e.key==="Escape")setOpen(false);
  }
  function launch(){setCenter(null);setQuery("");setOpen(true)}
  window.addEventListener("keydown",key);
  window.addEventListener("raven:open-services",launch);
  return ()=>{window.removeEventListener("keydown",key);window.removeEventListener("raven:open-services",launch)};
 },[]);
 useEffect(()=>{if(open)input.current?.focus()},[open]);
 const matches=useMemo(()=>{
  const q=normalize(query);
  return groups.flatMap(group=>group.items.map(item=>({item,group})))
   .filter(({item,group})=>(!center||group.ar===center)&&(!q||normalize(`${item.ar} ${item.en} ${group.ar} ${group.en}`).includes(q)))
   .slice(0,q?40:80);
 },[groups,query,center]);
 const selected=groups.find(g=>g.ar===center);
 return <>
  <button type="button" onClick={()=>{setOpen(true);setCenter(null);setQuery("")}} aria-label={isAr?"البحث السريع في الخدمات":"Search services"} aria-keyshortcuts="Control+K Meta+K" className="inline-flex items-center gap-2 rounded-xl border border-[#08794F]/25 bg-white px-3 py-2 text-xs font-bold text-[#08794F] hover:border-[#08794F]">
   <Search size={17}/><span className="hidden sm:inline">{isAr?"الخدمات والبحث السريع":"Services & search"}</span><kbd className="hidden rounded bg-[#F5F3EC] px-1.5 py-0.5 text-[10px] text-[#53615b] md:inline">⌘K / Ctrl K</kbd>
  </button>
  {open&&<div className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-[#111A18]/70 p-3 pt-[7vh] backdrop-blur-sm" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}>
   <section role="dialog" aria-modal="true" aria-label={isAr?"دليل المراكز والخدمات":"Centers and services directory"} className="w-full max-w-4xl overflow-hidden rounded-3xl border border-[#D4AF37]/35 bg-[#F5F3EC] shadow-2xl">
    <div className="flex items-center gap-3 border-b border-[#08794F]/15 bg-white p-4 md:p-5">
     <Search size={21} className="shrink-0 text-[#08794F]"/>
     <input ref={input} type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={isAr?"ابحث عن مركز أو خدمة أو تقرير...":"Search centers, services or reports..."} aria-label={isAr?"البحث في الخدمات":"Search services"} className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#111A18] outline-none placeholder:text-[#66736e]"/>
     <button type="button" onClick={()=>setOpen(false)} className="rounded-lg p-2 text-[#111A18] hover:bg-[#F5F3EC]" aria-label={isAr?"إغلاق":"Close"}><X size={20}/></button>
    </div>
    <div className="max-h-[72vh] overflow-y-auto p-4 md:p-6">
     <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <div><h2 className="text-lg font-black text-[#111A18]">{selected?(isAr?selected.ar:selected.en):(isAr?"مراكز البوابة":"Portal centers")}</h2><p className="mt-1 text-xs text-[#66736e]">{isAr?"اختر المركز ثم الخدمة، أو ابحث مباشرة دون التنقل بين القوائم.":"Choose a center then a service, or search directly."}</p></div>
      {center&&<button type="button" onClick={()=>setCenter(null)} className="rounded-xl border border-[#08794F]/20 bg-white px-3 py-2 text-xs font-bold text-[#08794F]">{isAr?"جميع المراكز":"All centers"}</button>}
     </div>
     {!center&&!query.trim()&&<div className="mb-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{groups.map(group=><Link key={group.ar} href={`/${portal}/centers/${groups.indexOf(group)}`} onClick={()=>setOpen(false)} className="flex items-center justify-between gap-3 rounded-2xl border border-[#08794F]/15 bg-white p-4 text-start shadow-sm transition hover:border-[#08794F]/60"><span className="flex items-center gap-3"><LayoutGrid size={19} className="shrink-0 text-[#08794F]"/><strong className="text-sm text-[#111A18]">{isAr?group.ar:group.en}</strong></span><span className="rounded-full bg-[#F5F3EC] px-2 py-1 text-xs text-[#53615b]">{group.items.length}</span></Link>)}</div>}
     {(center||query.trim())&&<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{matches.map(({item,group})=>{const Icon=item.icon;return <Link key={item.to} href={item.to} onClick={()=>setOpen(false)} className="group flex min-h-32 flex-col rounded-2xl border border-[#08794F]/15 bg-white p-4 shadow-sm transition hover:border-[#08794F]/60 hover:shadow-md"><span className="mb-3 flex items-center justify-between"><Icon size={22} className="text-[#08794F]"/><ArrowUpLeft size={16} className="text-[#8b977f]"/></span><strong className="text-sm leading-6 text-[#111A18]">{isAr?item.ar:item.en}</strong><small className="mt-auto pt-2 text-[#66736e]">{isAr?group.ar:group.en}</small></Link>})}</div>}
     {(center||query.trim())&&matches.length===0&&<p role="status" className="rounded-xl border border-dashed border-[#C1B489] bg-white p-6 text-center text-sm text-[#53615b]">{isAr?"لا توجد خدمات مطابقة.":"No matching services."}</p>}
    </div>
    <div className="border-t border-[#08794F]/10 bg-white px-5 py-3 text-xs text-[#66736e]">{isAr?"تعرض هذه النافذة المسارات المسموحة للبوابة الحالية فقط. تفعيل الخدمات يتطلب ربط محركاتها وبياناتها.":"Only routes for the current portal are shown. Operational services require verified integrations."}</div>
   </section>
  </div>}
 </>;
}
