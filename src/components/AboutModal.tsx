import { useLanguage } from '../contexts/LanguageContext';
import { Store, ShieldCheck, Heart, X, Phone, MessageCircle, Mail, Facebook, Youtube } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-5xl max-h-[90vh] overflow-y-auto bg-gray-50 border border-gray-200 rounded-2xl shadow-2xl z-50 p-6 md:p-10"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 p-2 hover:bg-gray-200 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-10 md:mb-12 mt-4">
              <div className="flex flex-wrap justify-center items-end gap-2 md:gap-4 mb-4">
                <h2 className="text-2xl md:text-4xl text-yellow-600 font-bold uppercase tracking-wider">
                  {t('about.title1')}
                </h2>
                <h3 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 uppercase">
                  {t('about.title2')}
                </h3>
              </div>
              <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                {t('about.desc')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
              <div className="bg-white p-6 md:p-8 border border-gray-200 rounded-xl text-center hover:border-yellow-400 transition-colors flex flex-col items-center shadow-sm">
                <div className="bg-gray-50 border border-gray-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-4 md:mb-6 text-yellow-600 shadow-sm">
                  <Store className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h4 className="text-lg md:text-xl font-bold uppercase mb-3 text-gray-900">
                  {t('about.mission.title')}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {t('about.mission.desc')}
                </p>
              </div>
              
              <div className="bg-white p-6 md:p-8 border border-gray-200 rounded-xl text-center hover:border-yellow-400 transition-colors flex flex-col items-center shadow-sm">
                <div className="bg-gray-50 border border-gray-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-4 md:mb-6 text-yellow-600 shadow-sm">
                  <ShieldCheck className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h4 className="text-lg md:text-xl font-bold uppercase mb-3 text-gray-900">
                  {t('about.quality.title')}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {t('about.quality.desc')}
                </p>
              </div>

              <div className="bg-white p-6 md:p-8 border border-gray-200 rounded-xl text-center hover:border-yellow-400 transition-colors flex flex-col items-center shadow-sm">
                <div className="bg-gray-50 border border-gray-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-4 md:mb-6 text-yellow-600 shadow-sm">
                  <Heart className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h4 className="text-lg md:text-xl font-bold uppercase mb-3 text-gray-900">
                  {t('about.customer.title')}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {t('about.customer.desc')}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8 mt-4 text-center">
              <h4 className="text-xl font-bold uppercase mb-6 text-yellow-600">
                {t('about.contact.title')}
              </h4>
              <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                <a href="tel:+8801719082347" className="flex flex-col items-center group text-gray-600 hover:text-gray-900 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-2 group-hover:border-yellow-400 group-hover:text-yellow-600 transition-colors shadow-sm">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-sm">+8801719082347</span>
                </a>
                
                <a href="https://wa.me/8801719082347" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group text-gray-600 hover:text-gray-900 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-2 group-hover:border-green-500 group-hover:text-green-500 transition-colors shadow-sm">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="text-sm">WhatsApp</span>
                </a>

                <a href="mailto:a01719082347@gmail.com" className="flex flex-col items-center group text-gray-600 hover:text-gray-900 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-2 group-hover:border-yellow-400 group-hover:text-yellow-600 transition-colors shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-sm">Email</span>
                </a>

                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group text-gray-600 hover:text-gray-900 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-2 group-hover:border-blue-500 group-hover:text-blue-500 transition-colors shadow-sm">
                    <Facebook className="w-5 h-5" />
                  </div>
                  <span className="text-sm">Facebook</span>
                </a>

                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group text-gray-600 hover:text-gray-900 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-2 group-hover:border-red-500 group-hover:text-red-500 transition-colors shadow-sm">
                    <Youtube className="w-5 h-5" />
                  </div>
                  <span className="text-sm">YouTube</span>
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}