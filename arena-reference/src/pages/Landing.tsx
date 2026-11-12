import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Database, FileText, Workflow, Sparkles, ChevronDown,
} from 'lucide-react';
import { useLang } from '../lib/i18n';
import { PORTALS } from '../lib/nav';
import { RavenMark } from '../components/raven';
import EcosystemProducts from '../components/ecosystem-products';
import LandingNav, { scrollToSection } from '../components/landing-nav';
import { AudiencesSection, LibrarySection } from '../components/landing-sections';

export default function Landing() {
  const { isAr, dir, t } = useLang();
  const navigate = useNavigate();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const pillars = [
    { icon: Database, ar: 'بيانات موحّدة', en: 'Unified Data', descAr: 'مصدر واحد موثوق لكل البيانات المدرسية — لا إدخال مكرر، لا ملفات متعارضة.', descEn: 'One trusted source for all school data — no duplicate entry, no conflicting files.' },
    { icon: FileText, ar: 'وثائق دقيقة', en: 'Distinct Documents', descAr: 'ملفات ومحاضر وتقارير تتولّد تلقائياً من بياناتك — مكتملة ومنسقة دائماً.', descEn: 'Files, minutes and reports generated automatically from your data — always complete.' },
    { icon: Workflow, ar: 'سير عمل متكامل', en: 'Integrated Workflows', descAr: 'من الخطة إلى التنفيذ إلى الشواهد إلى المؤشرات — دورة واحدة بلا فجوات.', descEn: 'From plan to execution to evidence to indicators — one cycle, no gaps.' },
  ];

  return (
    <div dir={dir} className="min-h-screen bg-ivory text-charcoal overflow-x-hidden">
      <LandingNav />

      {/* ── HERO ── */}
      <section id="platform" className="relative min-h-[96vh] flex items-center pt-[68px]">
        <div className="absolute inset-0">
          <img src="/images/raven-hero.png" alt="" className="w-full h-full object-cover" style={{ objectPosition: dir === 'rtl' ? '18% center' : '82% center' }} />
          <div className={`absolute inset-0 ${dir === 'rtl' ? 'bg-gradient-to-r' : 'bg-gradient-to-l'} from-transparent via-charcoal/70 to-charcoal`} />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/40" />
        </div>

        <div className="relative max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-12 py-16">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-charcoal/60 backdrop-blur-md ps-1.5 pe-4 py-1.5 mb-6">
              <span className="h-6 w-6 rounded-full bg-gold flex items-center justify-center"><Sparkles size={13} className="text-charcoal" /></span>
              <span className="text-[10.5px] font-bold text-gold">{isAr ? 'الإصدار 4.2 — المنصة التعليمية الموحدة' : 'v4.2 — The Unified Educational OS'}</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.08 }}
              className="text-ivory font-black text-[38px] leading-[1.25] sm:text-5xl sm:leading-[1.18] lg:text-[56px] lg:leading-[1.16]">
              {isAr ? <>منظومة <span className="text-gold">واحدة</span>،<br />أربع بوابات،<br />مدرسة كاملة في <span className="text-gold">جيبك</span>.</> : <>One <span className="text-gold">OS</span>,<br />four portals,<br />a complete school in <span className="text-gold">your hands</span>.</>}
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.18 }}
              className="mt-5 text-ivory/80 text-[14px] sm:text-[15.5px] leading-8 max-w-xl">
              {isAr
                ? 'رافين OS ليس لوحة تحكم تقليدية — بل نظام تشغيل للمدرسة يربط القيادة والمعلمين والأسرة على بيانات واحدة، وسير عمل واحد، ووثائق تتولّد من بياناتك.'
                : 'Raven OS is not another dashboard — it is the school’s operating system uniting leadership, teachers and families on one data backbone, one workflow, and documents born from your data.'}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.28 }}
              className="mt-7 flex flex-wrap items-center gap-3">
              <button onClick={() => navigate('/principal')} className="btn btn-gold !h-12 !px-6 !text-[13.5px]">{isAr ? 'استكشف بوابة مدير المدرسة' : 'Explore the Principal Portal'} <Arrow size={17} /></button>
              <button type="button" onClick={() => scrollToSection('portals')} className="btn !h-12 !px-6 !text-[13.5px] border border-ivory/30 text-ivory hover:bg-ivory hover:text-charcoal">{isAr ? 'تعرّف على البوابات الأربع' : 'Meet the Four Portals'}</button>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="mt-6 text-[11px] font-bold text-gold/90 font-en tracking-wide">
              {isAr ? '«أدخل بياناتك مرة، ودع رافين يبني ملفاتك»' : '“Enter your data once — let Raven build your documents.”'}
            </motion.p>
          </div>
        </div>
        <button type="button" onClick={() => scrollToSection('portals')} className="absolute bottom-6 left-1/2 -translate-x-1/2 text-ivory/60 hover:text-gold transition-colors flex flex-col items-center gap-1.5">
          <span className="text-[9px] font-bold tracking-[0.2em] font-en">{isAr ? 'اكتشف' : 'DISCOVER'}</span>
          <ChevronDown size={20} className="animate-bounce" />
        </button>
      </section>

      {/* ── FOUR PORTALS ── */}
      <section id="portals" className="scroll-mt-[68px] relative bg-charcoal py-16 lg:py-20">
        <div aria-hidden className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 80% 10%, #D4AF37 0, transparent 45%), radial-gradient(circle at 12% 90%, #08794F 0, transparent 45%)' }} />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <div className="kpi-label !text-gold mb-2">{isAr ? 'بوابة واحدة لكل دور — منصة واحدة للجميع' : 'ONE WORKSPACE PER ROLE — ONE PLATFORM FOR ALL'}</div>
              <h2 className="text-ivory font-black text-3xl sm:text-4xl leading-snug">{isAr ? 'البوابات الأربع' : 'The Four Portals'}</h2>
            </div>
            <p className="text-ivory/60 text-[12px] max-w-sm leading-6">{isAr ? 'بدّل بين البوابات في المعاينة — البيانات تتدفق بين البوابات الأربع من مصدر موحّد واحد.' : 'Preview-switch between portals — data flows across all four from a single unified source.'}</p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {PORTALS.map((p, i) => (
              <motion.button key={p.id} onClick={() => navigate(p.to)}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.09, duration: 0.55 }}
                whileHover={{ y: -6 }}
                className="group relative text-start rounded-3xl border border-ivory/12 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-5 flex flex-col gap-3 overflow-hidden hover:border-gold/50 transition-colors">
                <div className="absolute -top-10 -end-10 h-36 w-36 rounded-full blur-3xl opacity-20 group-hover:opacity-35 transition-opacity" style={{ background: p.accent }} />
                <span className="relative h-12 w-12 rounded-2xl flex items-center justify-center" style={{ background: p.accent }}>
                  <p.icon size={22} strokeWidth={1.9} className="text-charcoal" />
                </span>
                <div className="relative">
                  <div className="text-ivory font-black text-[15px] leading-6">{isAr ? p.ar : p.en}</div>
                  <div className="text-[10px] text-ivory/55 font-bold mt-1 leading-5">{isAr ? p.userTitleAr : p.userTitleEn}</div>
                </div>
                <div className="relative flex items-center gap-1.5 text-[11px] font-extrabold text-gold mt-auto pt-2 border-t border-ivory/10">
                  {isAr ? 'دخول إلى البوابة' : 'Enter portal'} <Arrow size={13} className="group-hover:translate-x-[-4px] rtl:group-hover:translate-x-[4px] transition-transform" />
                </div>
              </motion.button>
            ))}
          </div>

        </div>
      </section>

      {/* ── PHILOSOPHY: Unified data / distinct documents ── */}
      <section id="services" className="scroll-mt-[68px] bg-ivory py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <div className="rounded-[28px] overflow-hidden shadow-2xl border border-sand">
              <img src="/images/classroom.jpg" alt={isAr ? 'معلمة مع طالباتها' : 'Teacher with students'} className="w-full h-[420px] lg:h-[480px] object-cover" />
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="kpi-label mb-2">{isAr ? 'فلسفة رافين' : 'THE RAVEN PHILOSOPHY'}</div>
            <h2 className="font-black text-3xl sm:text-4xl leading-snug">{isAr ? 'بيانات موحّدة، وثائق متميزة.' : 'Unified Data, Distinct Documents.'}</h2>
            <p className="mt-3 text-[13px] text-charcoal/65 leading-7 max-w-xl">{isAr ? 'المعلمة تدخل الدرجة مرة واحدة — فيظهر تلقائياً في سجل المادة، تقرير الفصل، مؤشر ولي الأمر، وملف اعتماد الإدارة. لا نسخ يدوي، لا تعارض، لا ضياع للشواهد.' : 'A teacher enters one grade — it instantly appears in the gradebook, the term report, the parent progress view and the leadership evidence file. No manual copying, no conflicts, no lost evidence.'}</p>
            <div className="mt-7 grid sm:grid-cols-3 gap-3">
              {pillars.map(p => (
                <div key={p.en} className="raven-card p-5">
                  <span className="h-10 w-10 rounded-xl bg-green-soft flex items-center justify-center text-green-deep mb-3"><p.icon size={19} /></span>
                  <h3 className="text-[13px] font-extrabold">{isAr ? p.ar : p.en}</h3>
                  <p className="text-[10.5px] text-charcoal/60 leading-5 mt-1.5">{isAr ? p.descAr : p.descEn}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AudiencesSection />
      <LibrarySection />
      <EcosystemProducts />

      {/* ── INSTITUTIONAL FOOTER ── */}
      <footer id="contact" className="scroll-mt-[68px] bg-charcoal text-ivory py-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-ivory/10">
            <div className="flex items-center gap-3">
              <RavenMark size={46} dark />
              <div>
                <div className="font-en font-extrabold tracking-tight">RAVEN <span className="text-gold">OS</span></div>
                <div className="text-[10px] text-sand font-bold">{isAr ? 'النظام التشغيلي الأذكى لمؤسستك التعليمية' : 'The Operating System for Your School'}</div>
              </div>
            </div>
            <address className="not-italic flex flex-col gap-1 text-[12px] text-ivory/75">
              <span className="text-gold font-extrabold text-[13px]">{isAr ? 'تواصل معنا' : 'Contact Us'}</span>
              <a href="mailto:info@raven-os.sa" className="font-en hover:text-gold transition-colors">info@raven-os.sa</a>
              <span>{isAr ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}</span>
            </address>
            <div className="flex flex-wrap gap-2">
              {PORTALS.map(p => (
                <button key={p.id} onClick={() => navigate(p.to)} className="text-[10.5px] font-bold text-ivory/70 hover:text-gold border border-ivory/15 hover:border-gold/50 rounded-full px-3.5 py-1.5 transition-colors">{isAr ? p.ar : p.en}</button>
              ))}
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-ivory/50">
            <p className="font-bold">{t('signature')}</p>
            <p className="font-en">© 2026 Rafeeen Foundation · Raven OS v4.2 · {isAr ? 'جميع البيانات المعروضة تجريبية' : 'All displayed data is demonstrative sample data'}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
