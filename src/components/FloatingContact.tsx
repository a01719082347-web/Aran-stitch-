import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';

export default function FloatingContact() {
  const { t } = useLanguage();

  const whatsappNumber = t('social.whatsapp').replace(/\D/g, '') || '8801719082347';
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;
  const messengerUrl = t('social.messenger').startsWith('http') ? t('social.messenger') : 'https://m.me/aranstitch';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Messenger Button */}
      <motion.a
        href={messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-tr from-[#00A1FF] to-[#0078FF] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
      >
        <svg viewBox="0 0 36 36" className="w-7 h-7 md:w-8 md:h-8 fill-current">
          <path d="M18,3.5C9.8,3.5,3,9.7,3,17.4c0,4.4,2.2,8.3,5.6,10.9v4.2c0,0.6,0.5,1.1,1.1,1.1c0.2,0,0.4-0.1,0.6-0.2L14.7,31c1.1,0.3,2.2,0.4,3.3,0.4c8.2,0,15-6.2,15-13.9C33,9.7,26.2,3.5,18,3.5zM20.2,20.5l-3.3-3.5L10,20.5l7-7.4l3.3,3.5l6.9-3.5L20.2,20.5z" />
        </svg>
      </motion.a>

      {/* WhatsApp Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 md:w-14 md:h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
      >
        <MessageCircle className="w-7 h-7 md:w-8 md:h-8" />
      </motion.a>
    </div>
  );
}
