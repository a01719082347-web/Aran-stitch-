import { Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SubNavbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function SubNavbar({ searchTerm, setSearchTerm }: SubNavbarProps) {
  const { lang, t } = useLanguage();

  const navLinks = [
    { name: t('nav.home'), href: '#home' },
    { name: t('nav.products'), href: '#products' },
    { name: t('nav.about'), action: () => window.dispatchEvent(new CustomEvent('toggle-about')) },
  ];

  return (
    <div id="sub-navbar" className="bg-white border-y border-gray-100 shadow-xs relative z-30">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row justify-between items-center py-2.5 gap-2 sm:gap-4">
          
          {/* Navigation Links (Home, Products, About Us) */}
          <div className="flex items-center gap-5 sm:gap-6 md:gap-8 text-xs sm:text-[14px] md:text-[15px] uppercase tracking-wider font-bold text-zinc-800 flex-shrink-0">
            {navLinks.map((link) => (
              link.href ? (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="hover:text-yellow-600 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-yellow-400 hover:after:w-full after:transition-all after:duration-300 whitespace-nowrap"
                >
                  {link.name}
                </a>
              ) : (
                <button 
                  key={link.name} 
                  onClick={link.action}
                  className="hover:text-yellow-600 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-yellow-400 hover:after:w-full after:transition-all after:duration-300 uppercase font-bold whitespace-nowrap cursor-pointer"
                >
                  {link.name}
                </button>
              )
            ))}
          </div>

          {/* Search Bar - Compact & Scaled Down */}
          <div className="relative w-36 sm:w-52 md:w-68 flex-shrink-0">
            <input 
              type="text" 
              placeholder={t('nav.search')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-zinc-900 py-1.5 sm:py-2 pr-2.5 text-[11px] sm:text-xs focus:outline-none focus:border-yellow-500 focus:bg-white transition-all w-full shadow-inner"
              style={{ borderRadius: '9999px', paddingLeft: '34px' }}
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 pointer-events-none" />
          </div>

        </div>
      </div>
    </div>
  );
}
