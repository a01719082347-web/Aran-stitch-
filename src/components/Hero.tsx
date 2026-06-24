import { motion } from 'motion/react';
import { Sparkles, Facebook, Instagram, Youtube, MessageCircle, ArrowDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const COVER_IMAGE = 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=1920';

export default function Hero() {
  const { t, lang } = useLanguage();

  const getDirectImageUrl = (url: string) => {
    if (!url) return '';
    const match = url.match(/(?:file\/d\/|open\?id=|id=)([-a-zA-Z0-9_]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1920`;
    }
    return url;
  };

  const coverImageUrl = t('hero.coverImage1') !== 'hero.coverImage1' 
    ? getDirectImageUrl(t('hero.coverImage1')) 
    : COVER_IMAGE;

  return (
    <section id="home" className="relative min-h-[260px] sm:min-h-[360px] md:min-h-[520px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-gray-50 pt-32 sm:pt-36 md:pt-44 pb-12 md:pb-20">
      {/* Background Image with Light Overlay */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${coverImageUrl}')` }}
      />
      
      {/* Elegant Light Gradient Overlay to make it feel fresh and light */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-white/40 z-10" />
      <div className="absolute inset-0 bg-white/30 z-10" />

      <div className="relative z-20 px-4 max-w-5xl mx-auto w-full flex flex-col items-center md:items-start justify-center gap-4 text-center md:text-left mt-4 md:mt-6">
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-yellow-600 tracking-[0.25em] text-[10px] md:text-xs font-bold uppercase mb-1.5 flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> {t('hero.subtitle')}
            </h2>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-2 uppercase tracking-wide leading-tight">
              {t('hero.title1')} <span className="text-gray-800">{t('hero.title2')}</span>
            </h1>
            
            <p className="text-gray-600 text-[11px] sm:text-xs md:text-sm mb-4 max-w-lg mx-auto md:mx-0 font-light leading-relaxed">
              {t('hero.desc')}
            </p>

            <motion.a 
              href="#products"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-yellow-400 hover:text-black text-white px-5 py-2.5 font-bold uppercase tracking-widest text-[10px] md:text-xs shadow-md transition-colors"
            >
              {lang === 'bn' ? 'শপিং শুরু করুন' : 'Start Shopping'} <ArrowDown className="w-3.5 h-3.5" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
