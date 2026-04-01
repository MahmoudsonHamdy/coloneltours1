import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, MapPin, Clock, FileText, CreditCard, ShieldCheck, Plane, Globe } from 'lucide-react';
import { VISA_DATA, IMGS_URL } from '../constants/visaData';

export default function VisaDetails({ lang }: { lang: 'ar' | 'en' }) {
  const { id } = useParams();
  const visa = VISA_DATA.find(v => v.c === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!visa) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg text-white">
        <h1 className="text-4xl font-bold mb-4">{lang === 'ar' ? 'التأشيرة غير موجودة' : 'Visa Not Found'}</h1>
        <Link to="/" className="text-brand-accent hover:underline">{lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</Link>
      </div>
    );
  }

  const imgUrl = IMGS_URL[visa.f] || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80';

  return (
    <div className="min-h-screen bg-brand-bg text-gray-300 font-sans selection:bg-brand-accent selection:text-white pb-20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[900] bg-brand-bg/95 backdrop-blur-xl border-b border-white/5 px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
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
        </Link>
        <Link to="/" className="text-sm font-medium text-gray-300 hover:text-brand-accent transition-colors">
          {lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[60vh] w-full pt-20">
        <img src={imgUrl} alt={visa.c} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/60 to-brand-bg/20" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 container mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl drop-shadow-lg">{visa.f}</span>
              <span className="px-4 py-1 rounded-full bg-brand-accent/20 text-brand-accent text-sm font-bold border border-brand-accent/30 backdrop-blur-md">
                {lang === 'ar' ? 'تأشيرة سياحية' : 'Tourist Visa'}
              </span>
              {visa.fast && (
                <span className="px-4 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-bold border border-green-500/30 backdrop-blur-md">
                  {lang === 'ar' ? 'تجهيز سريع' : 'Fast Processing'}
                </span>
              )}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">{visa.c}</h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              {lang === 'ar' 
                ? 'استمتع بتجربة سفر لا تُنسى. نحن نتكفل بجميع إجراءات التأشيرة لضمان رحلة سلسة ومريحة.' 
                : 'Enjoy an unforgettable travel experience. We handle all visa procedures to ensure a smooth and comfortable journey.'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Details Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center gap-3">
                <Clock className="text-brand-accent" size={32} />
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{lang === 'ar' ? 'مدة التجهيز' : 'Processing'}</div>
                  <div className="font-bold text-white">{visa.d}</div>
                </div>
              </div>
              <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center gap-3">
                <MapPin className="text-brand-accent" size={32} />
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{lang === 'ar' ? 'الصلاحية' : 'Validity'}</div>
                  <div className="font-bold text-white">{visa.dur}</div>
                </div>
              </div>
              <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center gap-3">
                <CreditCard className="text-brand-accent" size={32} />
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{lang === 'ar' ? 'السعر' : 'Price'}</div>
                  <div className="font-bold text-white">{visa.p} EGP</div>
                </div>
              </div>
              <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center gap-3">
                <ShieldCheck className="text-brand-accent" size={32} />
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{lang === 'ar' ? 'نسبة القبول' : 'Success Rate'}</div>
                  <div className="font-bold text-white">98%</div>
                </div>
              </div>
            </div>

            {/* Documents Required */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <FileText className="text-brand-accent" />
                {lang === 'ar' ? 'المستندات المطلوبة' : 'Required Documents'}
              </h2>
              <div className="glass-card p-8 rounded-3xl">
                <ul className="space-y-4">
                  {visa.doc.split('+').map((doc, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-brand-accent/20 flex items-center justify-center shrink-0 mt-1">
                        <CheckCircle size={14} className="text-brand-accent" />
                      </div>
                      <span className="text-lg text-gray-200">{doc.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Gallery */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Globe className="text-brand-accent" />
                {lang === 'ar' ? 'اكتشف الوجهة' : 'Explore Destination'}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <img src={`https://loremflickr.com/600/400/${visa.c},landmark/all?random=1`} alt="Gallery 1" className="w-full h-48 object-cover rounded-2xl" />
                <img src={`https://loremflickr.com/600/400/${visa.c},landmark/all?random=2`} alt="Gallery 2" className="w-full h-48 object-cover rounded-2xl" />
                <img src={`https://loremflickr.com/600/400/${visa.c},landmark/all?random=3`} alt="Gallery 3" className="w-full h-48 object-cover rounded-2xl" />
                <img src={`https://loremflickr.com/600/400/${visa.c},landmark/all?random=4`} alt="Gallery 4" className="w-full h-48 object-cover rounded-2xl" />
              </div>
            </div>

            {/* Why Choose Us */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <ShieldCheck className="text-brand-accent" />
                {lang === 'ar' ? 'لماذا كولونيل تورز؟' : 'Why Colonel Tours?'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  lang === 'ar' ? 'خبرة أكثر من 10 سنوات' : 'Over 10 years experience',
                  lang === 'ar' ? 'دعم فني على مدار الساعة' : '24/7 Customer Support',
                  lang === 'ar' ? 'أعلى نسبة قبول للتأشيرات' : 'Highest visa success rate',
                  lang === 'ar' ? 'تجهيز سريع وموثوق' : 'Fast & reliable processing'
                ].map((item, i) => (
                  <div key={i} className="glass-card p-6 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                      <CheckCircle size={20} />
                    </div>
                    <span className="font-medium text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar / Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 glass-card p-8 rounded-3xl border-brand-accent/30 shadow-2xl shadow-brand-accent/10">
              <h3 className="text-2xl font-bold text-white mb-2">
                {lang === 'ar' ? 'احجز تأشيرتك الآن' : 'Book Your Visa Now'}
              </h3>
              <p className="text-sm text-gray-400 mb-8">
                {lang === 'ar' ? 'تواصل معنا مباشرة عبر واتساب للبدء في الإجراءات.' : 'Contact us directly via WhatsApp to start the process.'}
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-gray-400">{lang === 'ar' ? 'الوجهة' : 'Destination'}</span>
                  <span className="font-bold text-white">{visa.c}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-gray-400">{lang === 'ar' ? 'السعر' : 'Price'}</span>
                  <span className="font-bold text-brand-accent text-xl">{visa.p} EGP</span>
                </div>
              </div>

              <a 
                href={`https://wa.me/201126672801?text=I want to book a visa for ${visa.c}`} 
                target="_blank" 
                className="w-full bg-brand-accent text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-accent-light transition-all flex items-center justify-center gap-3 shadow-lg shadow-brand-accent/20"
              >
                {lang === 'ar' ? 'تواصل عبر واتساب' : 'Contact via WhatsApp'}
                <Plane size={20} className={lang === 'ar' ? 'rotate-180' : ''} />
              </a>
              
              <p className="text-center text-xs text-gray-500 mt-4">
                {lang === 'ar' ? 'سيتم الرد عليك في غضون دقائق' : 'We will reply within minutes'}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
