"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ar" | "en";
type DictionaryKey = "home" | "notifications" | "save" | "cancel" | "upload" | "approve" | "signature" | "sampleData";
const dictionary: Record<DictionaryKey, Record<Lang, string>> = {
 home:{ar:"الرئيسية",en:"Home"},
 notifications:{ar:"الإشعارات",en:"Notifications"},
 save:{ar:"حفظ",en:"Save"},
 cancel:{ar:"إلغاء",en:"Cancel"},
 upload:{ar:"رفع ملف",en:"Upload file"},
 approve:{ar:"اعتماد",en:"Approve"},
 signature:{ar:"مؤسسة رافيين للخدمات التعليمية — نحن نصنع الفرق",en:"Rafeeen Foundation for Educational Services — We Make the Difference"},
 sampleData:{ar:"بيانات تجريبية لأغراض العرض",en:"Sample data for demonstration"},
};
type LanguageContextValue = { lang:Lang; dir:"rtl"|"ltr"; isAr:boolean; setLang:(lang:Lang)=>void; toggleLang:()=>void; t:(key:DictionaryKey)=>string };
const Context = createContext<LanguageContextValue>({
 lang:"ar",dir:"rtl",isAr:true,setLang:()=>{},toggleLang:()=>{},t:key=>dictionary[key].ar
});
const STORAGE_KEY="raven-lang";

export function LanguageProvider({children}:{children:ReactNode}) {
 const [lang,setLangState]=useState<Lang>("ar");
 useEffect(()=>{
  try {
   const saved=window.localStorage.getItem(STORAGE_KEY);
   if(saved==="ar"||saved==="en") setLangState(saved);
  } catch { /* language remains available for this session */ }
 },[]);
 useEffect(()=>{
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==="ar"?"rtl":"ltr";
  try { window.localStorage.setItem(STORAGE_KEY,lang); } catch { /* optional persistence */ }
 },[lang]);
 const setLang=useCallback((value:Lang)=>setLangState(value),[]);
 const toggleLang=useCallback(()=>setLangState(value=>value==="ar"?"en":"ar"),[]);
 const t=useCallback((key:DictionaryKey)=>dictionary[key][lang],[lang]);
 return <Context.Provider value={{lang,dir:lang==="ar"?"rtl":"ltr",isAr:lang==="ar",setLang,toggleLang,t}}>{children}</Context.Provider>;
}
export const useLang=()=>useContext(Context);
export const L=(isAr:boolean,ar:string,en:string)=>isAr?ar:en;
