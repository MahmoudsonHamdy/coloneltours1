import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plane, 
  Search, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  MessageSquare, 
  Globe, 
  Menu, 
  X, 
  Star,
  ChevronDown,
  Phone,
  Facebook,
  Instagram,
  Mail,
  Bot,
  Building,
  Briefcase,
  FileText
} from 'lucide-react';
import { VISA_DATA, IMGS_URL, Visa } from './constants/visaData';
import { GoogleGenAI } from "@google/genai";

import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import VisaDetails from './pages/VisaDetails';

// --- AI Assistant Component ---
const AIAssistant = ({ lang }: { lang: 'ar' | 'en' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: lang === 'ar' 
            ? "أنت مساعد سفر ذكي لشركة Colonel Tours. ساعد العملاء في اختيار وجهات السفر وشرح متطلبات التأشيرة. كن ودوداً ومحترفاً."
            : "You are an AI travel assistant for Colonel Tours. Help customers choose destinations and explain visa requirements. Be friendly and professional."
        }
      });
      
      const response = await model;
      setMessages(prev => [...prev, { role: 'bot', text: response.text || (lang === 'ar' ? "عذراً، حدث خطأ." : "Sorry, an error occurred.") }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: lang === 'ar' ? "عذراً، لا يمكنني الرد الآن." : "Sorry, I can't respond right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[1000]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-80 sm:w-96 bg-brand-bg-light border border-brand-accent/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]"
          >
            <div className="bg-brand-blue p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="text-brand-accent-light" size={24} />
                <span className="font-bold text-white">{lang === 'ar' ? 'مساعد كولونيل الذكي' : 'Colonel AI Assistant'}</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-400 mt-10">
                  <Bot size={48} className="mx-auto mb-2 opacity-20" />
                  <p>{lang === 'ar' ? 'كيف يمكنني مساعدتك اليوم؟' : 'How can I help you today?'}</p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${m.role === 'user' ? 'bg-brand-accent text-brand-bg font-bold' : 'bg-gray-800 text-gray-200'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 p-3 rounded-2xl animate-pulse">...</div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={lang === 'ar' ? 'اكتب سؤالك هنا...' : 'Type your question...'}
                className="flex-1 bg-brand-bg border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-accent/50"
              />
              <button onClick={handleSend} className="bg-brand-accent p-2 rounded-xl text-brand-bg hover:bg-brand-accent-light transition-colors">
                <Plane size={18} className={lang === 'ar' ? 'rotate-180' : ''} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-brand-accent rounded-full flex items-center justify-center text-brand-bg shadow-xl hover:shadow-brand-accent/20 transition-all"
      >
        {isOpen ? <X size={28} /> : <Bot size={28} />}
      </motion.button>
    </div>
  );
};

// --- Main App Component ---
function Home() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredVisas = VISA_DATA.filter(v => {
    const matchesFilter = filter === 'all' || (filter === 'fast' ? v.fast : v.r === filter);
    const matchesSearch = v.c.toLowerCase().includes(search.toLowerCase()) || v.f.includes(search);
    return matchesFilter && matchesSearch;
  });

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBookingStatus('loading');
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setBookingStatus('success');
        setTimeout(() => setBookingStatus('idle'), 5000);
      }
    } catch (error) {
      console.error("Booking Error:", error);
      setBookingStatus('idle');
    }
  };

  const t = {
    ar: {
      nav: { dest: 'الوجهات', prices: 'الأسعار', services: 'خدماتنا', how: 'كيف نعمل', book: 'احجز الآن' },
      hero: { eyebrow: 'متخصصون في تأشيرات السياحة الدولية', p: 'بنوصلك لأكتر من 60 وجهة حول العالم. تأشيرات، فنادق، طيران، وتجهيز خط السير — كل حاجة في مكان واحد.', cta: 'ابدأ طلبك دلوقتي', explore: 'شوف وجهاتنا' },
      stats: { visas: 'تأشيرة ناجحة', dests: 'وجهة متاحة', rate: 'نسبة القبول', exp: 'سنوات خبرة' },
      why: { title: 'لماذا تختارنا', h2: 'خبرة حقيقية ونتائج مضمونة', lead: 'مش بس بنجمع أوراق — بنبني ملفك بشكل صح عشان نوصل لأعلى نسبة قبول ممكنة.' },
      dest: { title: 'الأكثر طلباً', h2: 'وجهاتنا المميزة', lead: 'مرر على الكارت عشان تشوف التفاصيل كاملة', all: 'شوف كل الوجهات' },
      form: { title: 'احجز استشارتك المجانية الآن', lead: 'ملي الفورم وهيتواصل معاك متخصص خلال ساعة واحدة', submit: 'ابعت الطلب', success: 'تم الإرسال بنجاح! سنتواصل معك قريباً.' }
    },
    en: {
      nav: { dest: 'Destinations', prices: 'Prices', services: 'Services', how: 'How It Works', book: 'Book Now' },
      hero: { eyebrow: 'International Tourism Visa Specialists', p: 'We take you to 60+ destinations worldwide. Visas, hotels, flights & itinerary planning — everything in one place.', cta: 'Start Your Application', explore: 'Explore Destinations' },
      stats: { visas: 'Successful Visas', dests: 'Destinations', rate: 'Approval Rate', exp: 'Years Experience' },
      why: { title: 'Why Choose Us', h2: 'Real Expertise & Guaranteed Results', lead: "We don't just collect documents — we build your file correctly to achieve the highest possible approval rate." },
      dest: { title: 'Most Popular', h2: 'Our Featured Destinations', lead: 'Hover over a card to see full details', all: 'All Destinations' },
      form: { title: 'Book Your Free Consultation', lead: 'Fill the form and a specialist will contact you within one hour.', submit: 'Send Request', success: 'Sent successfully! We will contact you soon.' }
    }
  }[lang];

  return (
    <div className={`min-h-screen font-sans ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* --- Navigation --- */}
      <nav className={`fixed top-0 left-0 right-0 z-[900] transition-all duration-300 px-6 py-4 flex items-center justify-between ${isScrolled ? 'bg-brand-bg/95 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent'}`}>
        <div className="flex items-center gap-3">
          <img 
            src="/logo-white.png" 
            alt="Colonel Tours Logo" 
            className="h-12 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="hidden relative items-center justify-center w-12 h-12 text-brand-blue bg-white rounded-full shadow-lg shadow-white/10">
            <Globe size={28} strokeWidth={2} />
            <Plane size={16} className="absolute -top-1 -right-1 text-brand-accent rotate-45" fill="currentColor" />
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-white leading-none text-lg">Colonel Tours</div>
            <div className="text-[10px] text-brand-accent uppercase tracking-widest mt-1">Experience Luxury Travel</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {Object.entries(t.nav).map(([key, label]) => (
            <a key={key} href={`#${key}`} className={`text-sm font-medium transition-colors ${key === 'book' ? 'bg-brand-accent text-brand-bg px-4 py-2 rounded-lg hover:bg-brand-accent-light' : 'text-gray-300 hover:text-brand-accent'}`}>
              {label}
            </a>
          ))}
          <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="text-xs font-bold border border-white/20 px-3 py-1 rounded-full hover:border-brand-accent transition-colors">
            {lang === 'ar' ? 'EN' : 'العربية'}
          </button>
        </div>

        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* --- Mobile Menu --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-0 z-[850] bg-brand-bg flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {Object.entries(t.nav).map(([key, label]) => (
              <a key={key} href={`#${key}`} onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-white hover:text-brand-accent">
                {label}
              </a>
            ))}
            <button onClick={() => { setLang(lang === 'ar' ? 'en' : 'ar'); setMobileMenuOpen(false); }} className="text-brand-accent font-bold">
              {lang === 'ar' ? 'English' : 'العربية'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Hero Section --- */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,68,176,0.1)_0%,transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-accent/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-blue/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 mb-8 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md"
            >
              <div className="w-2 h-2 bg-brand-accent rounded-full animate-ping" />
              <span className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.4em]">{t.hero.eyebrow}</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hero-title mb-10"
            >
              COLONEL<br />
              <span className="shiny-text italic">TOURS</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
            >
              {t.hero.p}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center gap-6 justify-center"
            >
              <a href="#request" className="accent-gradient text-brand-bg px-10 py-5 rounded-2xl font-extrabold text-lg flex items-center gap-3 hover:scale-105 transition-all shadow-2xl shadow-brand-accent/20">
                {t.hero.cta}
                <Plane size={24} strokeWidth={2.5} className={lang === 'ar' ? 'rotate-180' : ''} />
              </a>
              <a href="#dest" className="bg-white/5 border border-white/10 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-md">
                {t.hero.explore}
              </a>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
          <span className="text-[10px] uppercase tracking-[0.5em] font-bold">{lang === 'ar' ? 'اكتشف المزيد' : 'Discover More'}</span>
          <div className="w-[1px] h-20 bg-gradient-to-b from-brand-accent to-transparent" />
        </div>
      </section>

      {/* --- Stats --- */}
      <div className="relative z-20 -mt-10">
        <div className="container mx-auto px-6">
          <div className="glass-card grid grid-cols-2 md:grid-cols-4 gap-8 p-12 rounded-[2rem]">
            {[
              { n: '5000+', l: t.stats.visas, i: CheckCircle },
              { n: '60+', l: t.stats.dests, i: Globe },
              { n: '98%', l: t.stats.rate, i: ShieldCheck },
              { n: '10+', l: t.stats.exp, i: Star }
            ].map((s, i) => (
              <div key={i} className="text-center group">
                <div className="w-12 h-12 bg-brand-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-accent group-hover:text-brand-bg transition-all duration-500">
                  <s.i size={24} strokeWidth={1.5} />
                </div>
                <div className="text-4xl font-bold text-white mb-1">{s.n}</div>
                <div className="text-[10px] text-brand-accent uppercase tracking-widest font-bold">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Why Us --- */}
      <section id="why" className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-24">
          <div className="flex-1 relative group">
            <div className="absolute -inset-4 bg-brand-accent/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&q=85" 
                alt="Expertise" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/80 to-transparent" />
            </div>
            <motion.div 
              whileHover={{ y: -10 }}
              className="absolute -bottom-10 -left-10 glass-card p-10 rounded-3xl border-brand-accent/30"
            >
              <div className="text-6xl font-bold text-brand-accent mb-2">98%</div>
              <div className="text-xs font-black uppercase tracking-[0.3em] text-white">{t.stats.rate}</div>
            </motion.div>
          </div>
          
          <div className="flex-1">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-[1px] bg-brand-accent" />
              <span className="text-xs font-black text-brand-accent uppercase tracking-[0.4em]">{t.why.title}</span>
            </div>
            <h2 className="section-title mb-8">
              {lang === 'ar' ? <>خبرة <span className="shiny-text italic">حقيقية</span><br />ونتائج مضمونة</> : <>Real <span className="shiny-text italic">Expertise</span><br />& Guaranteed Results</>}
            </h2>
            <p className="text-xl text-gray-400 mb-12 leading-relaxed font-light">{t.why.lead}</p>
            
            <div className="grid sm:grid-cols-2 gap-8">
              {[
                { i: Clock, t: lang === 'ar' ? 'سرعة في التنفيذ' : 'Fast Processing', p: lang === 'ar' ? 'تركيا في ساعة واحدة.' : 'Turkey in one hour.' },
                { i: ShieldCheck, t: lang === 'ar' ? 'مراجعة الملف' : 'File Review', p: lang === 'ar' ? 'بنراجع كل ورقة بدقة.' : 'We review every doc.' },
                { i: MessageSquare, t: lang === 'ar' ? 'دعم متواصل' : '24/7 Support', p: lang === 'ar' ? 'فريقنا متاح دائماً.' : 'Our team is always here.' },
                { i: Globe, t: lang === 'ar' ? '60+ وجهة' : '60+ Destinations', p: lang === 'ar' ? 'خيارات سفر لا محدودة.' : 'Unlimited travel options.' }
              ].map((f, i) => (
                <div key={i} className="flex gap-5 group">
                  <div className="w-14 h-14 shrink-0 glass-card rounded-2xl flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-brand-bg transition-all duration-500">
                    <f.i size={28} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">{f.t}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{f.p}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Our Services --- */}
      <section id="services" className="py-24 bg-brand-bg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[1px] bg-brand-accent" />
                <span className="text-xs font-bold text-brand-accent uppercase tracking-[0.3em]">{lang === 'ar' ? 'خدماتنا' : 'Our Services'}</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                {lang === 'ar' ? 'حلول سفر متكاملة' : 'Comprehensive Travel Solutions'}
              </h2>
            </div>
            <p className="text-gray-400 max-w-md text-sm md:text-base leading-relaxed">
              {lang === 'ar' ? 'نقدم مجموعة واسعة من الخدمات لتلبية جميع احتياجات سفرك، من استخراج التأشيرات إلى حجز تذاكر الطيران والفنادق.' : 'We offer a wide range of services to meet all your travel needs, from visa processing to flight and hotel bookings.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FileText size={32} />,
                title: lang === 'ar' ? 'استخراج التأشيرات' : 'Visa Processing',
                desc: lang === 'ar' ? 'نساعدك في استخراج تأشيرات السياحة والعمل لمختلف دول العالم.' : 'We assist you in obtaining tourist and work visas for various countries.'
              },
              {
                icon: <Plane size={32} />,
                title: lang === 'ar' ? 'حجز تذاكر الطيران' : 'Flight Booking',
                desc: lang === 'ar' ? 'نوفر لك أفضل عروض أسعار تذاكر الطيران على جميع الخطوط الجوية.' : 'We provide you with the best flight ticket offers on all airlines.'
              },
              {
                icon: <Building size={32} />,
                title: lang === 'ar' ? 'حجز الفنادق' : 'Hotel Booking',
                desc: lang === 'ar' ? 'نحجز لك إقامتك في أفضل الفنادق حول العالم بأسعار تنافسية.' : 'We book your stay in the best hotels worldwide at competitive prices.'
              },
              {
                icon: <Briefcase size={32} />,
                title: lang === 'ar' ? 'برامج سياحية' : 'Tour Packages',
                desc: lang === 'ar' ? 'نصمم لك برامج سياحية متكاملة تناسب ميزانيتك واهتماماتك.' : 'We design comprehensive tour packages tailored to your budget and interests.'
              }
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 rounded-2xl group hover:border-brand-accent/50 transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent mb-6 group-hover:scale-110 transition-transform duration-500">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Destinations --- */}
      <section id="dest" className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[1px] bg-brand-accent" />
                <span className="text-xs font-bold text-brand-accent uppercase tracking-[0.3em]">{t.dest.title}</span>
              </div>
              <h2 className="text-5xl font-bold mb-4">{t.dest.h2}</h2>
              <p className="text-gray-400">{t.dest.lead}</p>
            </div>
            <div className="flex flex-col items-end gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <input 
                  type="text" 
                  placeholder={lang === 'ar' ? 'ابحث عن دولة...' : 'Search country...'}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 pl-10 text-sm text-white focus:outline-none focus:border-brand-accent/50"
                />
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                {['all', 'africa', 'asia', 'europe', 'americas', 'oceania', 'fast'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${filter === f ? 'bg-brand-accent text-brand-bg' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredVisas.map((v, i) => (
                <motion.div 
                  key={v.c}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer"
                >
                  <img src={IMGS_URL[v.f] || `https://loremflickr.com/600/400/${v.c},landmark/all`} alt={v.c} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/20 to-transparent opacity-90" />
                  
                  <div className="absolute top-4 right-4 z-10 text-3xl drop-shadow-lg">{v.f}</div>
                  {v.fast && <div className="absolute top-4 left-4 z-10 bg-green-500/20 backdrop-blur-md border border-green-500/50 text-green-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">Fast</div>}
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-brand-accent transition-colors">{v.c}</h3>
                    <div className="flex gap-2 mb-3">
                      <span className="text-[10px] bg-white/10 px-2 py-1 rounded-full text-white/70">{v.d}</span>
                      <span className="text-[10px] bg-white/10 px-2 py-1 rounded-full text-white/70">{v.dur}</span>
                    </div>
                    <div className="text-brand-accent font-bold">{v.p} EGP</div>
                  </div>

                  <div className="absolute inset-0 bg-brand-bg/95 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-8 text-center">
                    <div className="text-brand-accent text-2xl font-bold mb-4">{v.c}</div>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-xs border-b border-white/10 pb-2">
                        <span className="text-gray-500">{lang === 'ar' ? 'المستندات' : 'Documents'}</span>
                        <span className="text-white font-bold">{v.doc}</span>
                      </div>
                      <div className="flex justify-between text-xs border-b border-white/10 pb-2">
                        <span className="text-gray-500">{lang === 'ar' ? 'التنفيذ' : 'Processing'}</span>
                        <span className="text-white font-bold">{v.d}</span>
                      </div>
                    </div>
                    <button onClick={() => navigate(`/visa/${v.c}`)} className="bg-brand-accent text-white py-3 rounded-xl font-bold text-sm hover:bg-brand-accent-light transition-all">
                      {lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>


      {/* --- Booking Form --- */}
      <section id="request" className="py-24 bg-brand-bg-light">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-20 items-center">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-brand-accent" />
              <span className="text-xs font-bold text-brand-accent uppercase tracking-[0.3em]">{lang === 'ar' ? 'ابدأ رحلتك' : 'Start Your Journey'}</span>
            </div>
            <h2 className="text-5xl font-bold mb-6 leading-tight">{t.form.title}</h2>
            <p className="text-lg text-gray-400 mb-10">{t.form.lead}</p>
            
            <div className="space-y-6">
              {[
                { t: lang === 'ar' ? 'استشارة مجانية 100%' : '100% Free Consultation' },
                { t: lang === 'ar' ? 'متابعة شخصية مستمرة' : 'Personal Follow-up' },
                { t: lang === 'ar' ? 'مراجعة الملف قبل التقديم' : 'Pre-submission Review' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-brand-accent rounded-full flex items-center justify-center text-brand-bg">
                    <CheckCircle size={14} />
                  </div>
                  <span className="font-bold text-white">{item.t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="bg-brand-bg p-10 rounded-3xl border border-white/5 shadow-2xl">
              {bookingStatus === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{t.form.success}</h3>
                </motion.div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{lang === 'ar' ? 'الاسم الأول' : 'First Name'}</label>
                      <input name="firstName" required className="w-full bg-brand-bg-light border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-accent/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{lang === 'ar' ? 'اسم العائلة' : 'Last Name'}</label>
                      <input name="lastName" required className="w-full bg-brand-bg-light border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-accent/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{lang === 'ar' ? 'رقم الواتساب' : 'WhatsApp'}</label>
                    <input name="whatsapp" type="tel" required className="w-full bg-brand-bg-light border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-accent/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{lang === 'ar' ? 'الوجهة' : 'Destination'}</label>
                    <select name="destination" required className="w-full bg-brand-bg-light border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-accent/50 appearance-none">
                      <option value="">{lang === 'ar' ? 'اختار البلد' : 'Select Country'}</option>
                      {VISA_DATA.map(v => <option key={v.c} value={v.c}>{v.c}</option>)}
                    </select>
                  </div>
                  <button 
                    disabled={bookingStatus === 'loading'}
                    className="w-full bg-brand-accent text-brand-bg py-4 rounded-xl font-bold text-lg hover:bg-brand-accent-light transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {bookingStatus === 'loading' ? '...' : t.form.submit}
                    <Plane size={20} className={lang === 'ar' ? 'rotate-180' : ''} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-brand-bg pt-24 pb-12 border-t border-white/5">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="/logo-white.png" 
                alt="Colonel Tours Logo" 
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden relative items-center justify-center w-12 h-12 text-brand-blue bg-white rounded-full shadow-lg shadow-white/10">
                <Globe size={28} strokeWidth={2} />
                <Plane size={16} className="absolute -top-1 -right-1 text-brand-accent rotate-45" fill="currentColor" />
              </div>
              <div>
                <div className="font-bold text-white leading-none text-lg">Colonel Tours</div>
                <div className="text-[10px] text-brand-accent uppercase tracking-widest mt-1">Experience Luxury Travel</div>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-8">
              {lang === 'ar' ? 'متخصصون في التأشيرات السياحية منذ أكثر من 10 سنوات. بنساعد المصريين يسافروا لأكتر من 60 وجهة حول العالم.' : 'Tourism visa specialists for over 10 years, helping clients travel to 60+ destinations worldwide.'}
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-gray-500 hover:border-brand-accent hover:text-brand-accent transition-all">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">{lang === 'ar' ? 'الوجهات' : 'Destinations'}</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              {['Cuba 🇨🇺', 'Georgia 🇬🇪', 'Seychelles 🇸🇨', 'Kenya 🇰🇪'].map(d => (
                <li key={d}><a href="#" className="hover:text-brand-accent transition-colors">{d}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">{lang === 'ar' ? 'خدماتنا' : 'Services'}</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              {['File Prep', 'Appointments', 'Itinerary', 'Hotels'].map(s => (
                <li key={s}><a href="#" className="hover:text-brand-accent transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">{lang === 'ar' ? 'تواصل' : 'Contact'}</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li className="flex items-center gap-3"><Phone size={16} className="text-brand-accent" /> 01126672801</li>
              <li className="flex items-center gap-3"><Mail size={16} className="text-brand-accent" /> coloneltours.eg@gmail.com</li>
            </ul>
          </div>
        </div>
        
        <div className="container mx-auto px-6 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>© 2026 Colonel Tours. All rights reserved.</p>
          <p>Experience <span className="text-brand-accent">Luxury</span> Travel ✈️</p>
        </div>
      </footer>

      {/* --- Floating WhatsApp --- */}
      <a 
        href="https://wa.me/201126672801" 
        target="_blank" 
        className="fixed bottom-6 right-6 z-[1000] bg-[#25d366] text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-2xl hover:scale-105 transition-transform"
      >
        <Phone size={20} />
        {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
      </a>

      {/* --- AI Assistant --- */}
      <AIAssistant lang={lang} />
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/visa/:id" element={<VisaDetails lang={lang} />} />
      </Routes>
    </BrowserRouter>
  );
}
