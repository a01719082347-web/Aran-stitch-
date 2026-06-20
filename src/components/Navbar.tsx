import { ShoppingBag, Search, ShoppingCart, Globe, LogIn, User as UserIcon, LogOut, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getDirectImageUrl } from '../utils';

interface NavbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export default function Navbar({ searchTerm, setSearchTerm, cartCount, onOpenCart }: NavbarProps) {
  const { lang, toggleLanguage, t } = useLanguage();
  const { user, isAdmin, logout } = useAuth();

  const navLinks = [
    { name: t('nav.home'), href: '#home' },
    { name: t('nav.products'), href: '#products' },
    { name: t('nav.about'), action: () => window.dispatchEvent(new CustomEvent('toggle-about')) },
  ];

  return (
    <nav className="fixed w-full bg-white text-zinc-900 z-50 border-b border-gray-200 top-0 shadow-sm">
      {/* Marquee with Social Media Icons on the Right Corner */}
      <div className="bg-[#f0c33a] text-neutral-900 py-1.5 px-4 overflow-hidden border-b border-yellow-500 flex justify-between items-center gap-4 font-bold text-[11px] h-8">
        <div className="flex-1 min-w-0 overflow-hidden flex items-center">
          <marquee behavior="scroll" direction="left" scrollamount="3.5" className="w-full">
            <div className="inline-flex items-center gap-10 whitespace-nowrap">
              <span>{t('marquee.text1')}</span>
              <span className="text-amber-800 text-base">✦</span>
              <span>{t('marquee.text2')}</span>
              <span className="text-amber-800 text-base">✦</span>
              <span>{t('marquee.text3')}</span>
            </div>
          </marquee>
        </div>

        {/* Static social icons at the right corner (mobile & desktop) */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0 bg-[#f0c33a] pl-2 z-10">
          <a href={t('social.facebook').startsWith('http') ? t('social.facebook') : 'https://facebook.com'} target="_blank" rel="noopener noreferrer" className="hover:text-blue-800 transition-colors" title="Facebook">
            <Facebook className="w-3.5 h-3.5" />
          </a>
          <a href={t('social.instagram').startsWith('http') ? t('social.instagram') : 'https://instagram.com'} target="_blank" rel="noopener noreferrer" className="hover:text-pink-700 transition-colors" title="Instagram">
            <Instagram className="w-3.5 h-3.5" />
          </a>
          <a href={t('social.youtube').startsWith('http') ? t('social.youtube') : 'https://youtube.com'} target="_blank" rel="noopener noreferrer" className="hover:text-red-700 transition-colors" title="YouTube">
            <Youtube className="w-3.5 h-3.5" />
          </a>
          <a href={`https://wa.me/${t('social.whatsapp').replace(/\D/g, '') || '8801719082347'}`} target="_blank" rel="noopener noreferrer" className="hover:text-green-700 transition-colors" title="WhatsApp">
            <MessageCircle className="w-3.5 h-3.5 text-green-700 fill-green-700/10" />
          </a>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap lg:flex-nowrap justify-between items-center py-2 lg:h-16 gap-3 lg:gap-4">
          
          <div className="flex justify-between items-center w-full lg:w-auto order-1">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer mr-2 lg:mr-6" onClick={() => window.scrollTo(0,0)}>
              {t('site.logo') ? (
                <img src={getDirectImageUrl(t('site.logo'))} alt={`${t('site.name')} Logo`} className="h-6 md:h-8 w-auto max-w-[40px] md:max-w-[80px] object-contain flex-shrink-0" referrerPolicy="no-referrer" />
              ) : (
                <ShoppingBag className="h-5 w-5 md:h-6 md:w-6 text-zinc-900 flex-shrink-0" />
              )}
              <span className="text-lg md:text-2xl tracking-widest text-zinc-900 font-bold whitespace-nowrap" style={{ fontFamily: t('site.font') || "'Playfair Display', serif" }}>{t('site.name')}</span>
            </div>

            {/* Mobile Actions (Right side) */}
            <div className="flex lg:hidden items-center gap-2">
              {/* Language Toggle Mobile */}
              <button onClick={toggleLanguage} className="p-1 px-1.5 bg-gray-100 border border-gray-200 rounded text-zinc-600 hover:text-yellow-600 hover:border-yellow-400 flex items-center gap-1 text-[10px] uppercase font-bold flex-shrink-0 transition-colors">
                {lang === 'en' ? 'BN' : 'EN'}
              </button>

              {isAdmin ? (
                <div className="flex items-center gap-1.5">
                  <button onClick={() => window.dispatchEvent(new CustomEvent('toggle-admin'))} className="px-2 py-1 bg-zinc-950 text-white rounded-full hover:bg-yellow-500 hover:text-black text-[10px] uppercase font-black tracking-wider shadow-sm flex flex-shrink-0 items-center justify-center transition-all">
                    {lang === 'bn' ? 'এডমিন' : 'Admin'}
                  </button>
                  <button onClick={logout} className="p-1.5 border border-red-200 text-red-500 bg-red-50/40 rounded-full hover:bg-red-500 hover:text-white text-[10px] flex items-center justify-center flex-shrink-0 transition-all shadow-sm">
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : user ? (
                <div className="flex items-center gap-1.5">
                  <button onClick={() => window.dispatchEvent(new CustomEvent('toggle-profile'))} className="flex items-center gap-1 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-500/20 px-2 py-1 rounded-full text-[10px] uppercase font-bold flex-shrink-0 transition-all shadow-sm">
                    <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 text-black text-[8px] font-black flex items-center justify-center uppercase">
                      {(user.name || user.email || 'U')[0]}
                    </div>
                    <span>{lang === 'bn' ? 'প্রোফাইল' : 'Profile'}</span>
                  </button>
                  <button onClick={logout} className="p-1.5 border border-red-100 bg-red-50/50 text-gray-500 hover:text-red-500 rounded-full flex items-center justify-center flex-shrink-0 transition-all shadow-xs">
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('toggle-auth'))} 
                  className="flex items-center gap-1 bg-amber-500 text-black hover:bg-amber-600 px-3 py-1.5 rounded-full text-[10px] uppercase font-black tracking-wider flex-shrink-0 transition-all shadow-md active:scale-95"
                >
                  <UserIcon className="w-3.5 h-3.5 stroke-[2.5px]" />
                  <span>{lang === 'bn' ? 'লগইন / নিবন্ধন' : 'Sign In'}</span>
                </button>
              )}

              {/* Cart Button */}
              <button onClick={onOpenCart} className="relative p-1.5 text-zinc-600 hover:text-yellow-600 transition-colors flex-shrink-0">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                   <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-black bg-yellow-400 rounded-full transform scale-90">
                     {cartCount}
                   </span>
                )}
              </button>
            </div>
          </div>

          {/* Actions (Login, Lang, Search) */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0 order-2 lg:order-3 flex-wrap justify-end">
            {/* User Info / Login */}
            {user ? (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('toggle-profile'))} 
                  className="flex items-center gap-2 text-xs font-semibold text-zinc-800 bg-gray-50 hover:bg-yellow-50 border border-gray-200 hover:border-yellow-400 py-1.5 px-3.5 rounded-full transition-all shadow-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-yellow-400 text-black text-[10px] font-black uppercase flex items-center justify-center">
                    {(user.name || user.email || 'U')[0]}
                  </div>
                  <span className="capitalize">{user.name || user.email.split('@')[0]}</span>
                </button>
                
                {isAdmin && (
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('toggle-admin'))} 
                    className="px-3.5 py-1.5 text-black bg-zinc-900 text-white hover:bg-yellow-400 hover:text-black transition-all text-xs uppercase font-black tracking-wider rounded-full shadow-md"
                  >
                    {lang === 'bn' ? 'এডমিন পোর্টাল' : 'Admin Portal'}
                  </button>
                )}

                <button 
                  onClick={logout} 
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50/50 rounded-full transition-all"
                  title={lang === 'bn' ? 'লগআউট' : 'Logout'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('toggle-auth'))} 
                className="px-4 py-2 text-yellow-700 bg-yellow-50/50 hover:bg-yellow-400 hover:text-black flex items-center gap-2 text-xs uppercase font-black tracking-wider border border-yellow-500/30 rounded-full transition-all whitespace-nowrap shadow-sm hover:shadow-md hover:scale-[1.02]"
              >
                <UserIcon className="w-4 h-4 stroke-[2.5px]" />
                {lang === 'bn' ? 'লগইন / নিবন্ধন' : 'Sign In / Register'}
              </button>
            )}

            <button onClick={toggleLanguage} className="p-2 text-zinc-600 hover:text-yellow-600 flex items-center gap-1.5 text-xs uppercase font-bold border border-gray-200 rounded-full hover:border-yellow-400 transition-all whitespace-nowrap">
              <Globe className="w-4 h-4" />
              {lang === 'en' ? 'বাংলা' : 'English'}
            </button>

            {/* Cart Button Desktop */}
            <button onClick={onOpenCart} className="relative p-2 text-zinc-600 hover:text-yellow-600 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-black bg-yellow-400 rounded-full transform translate-x-1/4 -translate-y-1/4">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
