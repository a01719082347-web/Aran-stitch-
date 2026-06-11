import { ShoppingBag, Search, ShoppingCart, Globe, LogIn, User as UserIcon, LogOut } from 'lucide-react';
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
                <>
                  <button onClick={() => window.dispatchEvent(new CustomEvent('toggle-admin'))} className="p-1 px-2 border border-yellow-400 bg-yellow-400 text-black rounded hover:bg-yellow-500 text-[10px] uppercase font-bold flex flex-shrink-0 items-center justify-center transition-colors">
                    {lang === 'bn' ? 'এডমিন' : 'Admin'}
                  </button>
                  <button onClick={logout} className="p-1 px-1.5 border border-gray-200 rounded bg-gray-100 text-zinc-600 hover:text-red-500 hover:border-red-500 text-[10px] uppercase font-bold flex items-center justify-center gap-1 flex-shrink-0 transition-colors">
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : user ? (
                <>
                  <button onClick={() => window.dispatchEvent(new CustomEvent('toggle-profile'))} className="p-1 px-1.5 border border-gray-200 rounded bg-gray-100 text-zinc-600 hover:text-yellow-600 hover:border-yellow-400 text-[10px] uppercase font-bold flex items-center justify-center gap-1 flex-shrink-0 transition-colors">
                    <UserIcon className="w-3.5 h-3.5" /> {lang === 'bn' ? 'প্রোফাইল' : 'Profile'}
                  </button>
                  <button onClick={logout} className="p-1 px-1.5 border border-gray-200 rounded bg-gray-100 text-zinc-600 hover:text-red-500 hover:border-red-500 text-[10px] uppercase font-bold flex items-center justify-center gap-1 flex-shrink-0 transition-colors">
                    <LogOut className="w-3.5 h-3.5" /> {lang === 'bn' ? 'লগআউট' : 'Logout'}
                  </button>
                </>
              ) : (
                <button onClick={() => window.dispatchEvent(new CustomEvent('toggle-auth'))} className="p-1 px-1.5 border border-gray-200 rounded bg-gray-100 text-zinc-600 hover:text-yellow-600 hover:border-yellow-400 text-[10px] uppercase font-bold flex-shrink-0 transition-colors">
                   <LogIn className="w-4 h-4" />
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

          {/* Nav Links & Search */}
          <div className="flex items-center gap-4 md:gap-6 text-xs uppercase tracking-tighter opacity-80 font-medium order-3 lg:order-2 w-full lg:w-auto flex-1 overflow-x-auto scrollbar-hide py-1 px-2 lg:px-0 mt-2 lg:mt-0">
            {navLinks.map((link) => (
              link.href ? (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="text-zinc-600 hover:text-yellow-600 transition-colors whitespace-nowrap flex-shrink-0"
                >
                  {link.name}
                </a>
              ) : (
                <button 
                  key={link.name} 
                  onClick={link.action}
                  className="text-zinc-600 hover:text-yellow-600 transition-colors whitespace-nowrap flex-shrink-0 uppercase font-medium"
                >
                  {link.name}
                </button>
              )
            ))}
            
            {/* Search Bar - Inline with Nav Links */}
            <div className="relative flex-shrink-0 w-44 md:w-56 ml-auto lg:ml-4">
              <input 
                type="text" 
                placeholder={t('nav.search')} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-100 border border-gray-200 text-zinc-900 rounded-full py-1.5 pl-10 pr-3 text-xs focus:outline-none focus:border-yellow-400 transition-all w-full"
                style={{ borderRadius: '9999px' }}
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
          
          {/* Actions (Login, Lang, Search) */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0 order-2 lg:order-3 flex-wrap justify-end">
            {/* User Info / Login */}
            {user ? (
              <div className="flex items-center gap-2">
                <button onClick={() => window.dispatchEvent(new CustomEvent('toggle-profile'))} className="flex items-center gap-1.5 text-xs text-zinc-600 capitalize px-2 hidden xl:flex hover:text-yellow-600 transition-colors">
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>{user.name || user.email.split('@')[0]}</span>
                </button>
                <button 
                  onClick={logout} 
                  className="p-2 text-zinc-600 hover:text-red-500 flex items-center gap-1.5 text-xs uppercase font-bold border border-transparent rounded-full hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  {lang === 'bn' ? 'লগআউট' : 'Logout'}
                </button>
                {isAdmin && (
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('toggle-admin'))} 
                    className="p-2 text-black bg-yellow-400 hover:bg-yellow-500 flex items-center gap-1.5 text-xs uppercase font-bold rounded-full transition-all whitespace-nowrap"
                  >
                    {lang === 'bn' ? 'এডমিন' : 'Admin'}
                  </button>
                )}
              </div>
            ) : (
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('toggle-auth'))} 
                className="p-2 text-zinc-600 hover:text-yellow-600 flex items-center gap-1.5 text-xs uppercase font-bold border border-gray-200 rounded-full hover:border-yellow-400 transition-all whitespace-nowrap"
              >
                <LogIn className="w-4 h-4" />
                {lang === 'bn' ? 'লগইন' : 'Login'}
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
