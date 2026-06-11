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
    <section id="home" className="relative md:min-h-[75vh] flex items-center justify-center overflow-hidden bg-gray-50 pt-24 pb-28 md:pb-24">
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

      <div className="relative z-20 px-4 max-w-5xl mx-auto w-full flex flex-col items-center md:items-start justify-center gap-8 text-center md:text-left">
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-yellow-600 tracking-[0.3em] text-xs md:text-sm font-bold uppercase mb-4 flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-4 h-4" /> {t('hero.subtitle')}
            </h2>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 mb-6 uppercase tracking-wider leading-tight">
              {t('hero.title1')} <br/>
              <span className="text-gray-800">{t('hero.title2')}</span>
            </h1>
            
            <p className="text-gray-600 text-sm md:text-lg mb-10 max-w-xl mx-auto md:mx-0 font-light leading-relaxed">
              {t('hero.desc')}
            </p>

            <motion.a 
              href="#products"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 font-bold uppercase tracking-widest text-sm shadow-xl hover:bg-black transition-colors"
            >
              {lang === 'bn' ? 'শপিং শুরু করুন' : 'Start Shopping'} <ArrowDown className="w-4 h-4" />
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Social Links Bottom Corner */}
      <div className="absolute bottom-8 left-8 z-20 hidden md:flex gap-4">
        <a href={t('social.facebook').startsWith('http') ? t('social.facebook') : 'https://facebook.com'} target="_blank" rel="noopener noreferrer" className="bg-white/80 backdrop-blur-sm border border-gray-200 p-2.5 rounded-full hover:bg-yellow-400 hover:text-white transition-all text-gray-600 shadow-sm">
          <Facebook className="w-5 h-5" />
        </a>
        <a href={t('social.instagram').startsWith('http') ? t('social.instagram') : 'https://instagram.com'} target="_blank" rel="noopener noreferrer" className="bg-white/80 backdrop-blur-sm border border-gray-200 p-2.5 rounded-full hover:bg-yellow-400 hover:text-white transition-all text-gray-600 shadow-sm">
          <Instagram className="w-5 h-5" />
        </a>
        <a href={t('social.youtube').startsWith('http') ? t('social.youtube') : 'https://youtube.com'} target="_blank" rel="noopener noreferrer" className="bg-white/80 backdrop-blur-sm border border-gray-200 p-2.5 rounded-full hover:bg-yellow-400 hover:text-white transition-all text-gray-600 shadow-sm">
          <Youtube className="w-5 h-5" />
        </a>
        <a href={`https://wa.me/${t('social.whatsapp').replace(/\D/g, '') || '8801719082347'}`} target="_blank" rel="noopener noreferrer" className="bg-white/80 backdrop-blur-sm border border-gray-200 p-2.5 rounded-full hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all text-gray-600 shadow-sm">
          <MessageCircle className="w-5 h-5" />
        </a>
      </div>

      {/* Social Links Bottom Center for mobile */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-4 md:hidden">
        <a href={t('social.facebook').startsWith('http') ? t('social.facebook') : 'https://facebook.com'} target="_blank" rel="noopener noreferrer" className="bg-white/80 backdrop-blur-sm border border-gray-200 p-2.5 rounded-full hover:bg-yellow-400 hover:text-white transition-all text-gray-600 shadow-sm">
          <Facebook className="w-5 h-5" />
        </a>
        <a href={t('social.instagram').startsWith('http') ? t('social.instagram') : 'https://instagram.com'} target="_blank" rel="noopener noreferrer" className="bg-white/80 backdrop-blur-sm border border-gray-200 p-2.5 rounded-full hover:bg-yellow-400 hover:text-white transition-all text-gray-600 shadow-sm">
          <Instagram className="w-5 h-5" />
        </a>
        <a href={t('social.youtube').startsWith('http') ? t('social.youtube') : 'https://youtube.com'} target="_blank" rel="noopener noreferrer" className="bg-white/80 backdrop-blur-sm border border-gray-200 p-2.5 rounded-full hover:bg-yellow-400 hover:text-white transition-all text-gray-600 shadow-sm">
          <Youtube className="w-5 h-5" />
        </a>
        <a href={`https://wa.me/${t('social.whatsapp').replace(/\D/g, '') || '8801719082347'}`} target="_blank" rel="noopener noreferrer" className="bg-white/80 backdrop-blur-sm border border-gray-200 p-2.5 rounded-full hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all text-gray-600 shadow-sm">
          <MessageCircle className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
}
