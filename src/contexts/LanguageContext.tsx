import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'bn';

const defaultTranslations: Record<Language, Record<string, string>> = {
  en: {
    'marquee.text1': 'Welcome to ARAN STITCH! A lifestyle boutique named after our 4 family members.',
    'marquee.text2': 'For design customization, contact our tailoring experts directly on WhatsApp.',
    'marquee.text3': 'Cash on delivery is available all over Bangladesh with safe delivery.',
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.custom_order': 'Custom Order',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.search': 'Search...',
    'hero.subtitle': 'Premium Fashion Collection',
    'hero.title1': 'Elegance in',
    'hero.title2': 'Every Stitch',
    'hero.coverImages': 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1920,https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=1920,https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1920',
    'hero.coverImage1': 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1920',
    'hero.coverImage2': 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=1920',
    'hero.coverImage3': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1920',
    'hero.bgAnimation': 'zoom',
    'hero.desc': 'Discover our exclusive range of Three Pieces, Modest Burqas, and Signature Gents T-Shirts designed with uncompromising quality.',
    'hero.shop': 'Shop Collection',
    'hero.view': 'View Product',
    'prod.collection': 'Our Collection',
    'prod.timeless': 'Timeless Elegance',
    'prod.all': 'All',
    'prod.showing': 'Showing results for',
    'prod.noproducts': 'No products found matching your selection.',
    'prod.summary': 'Order Summary',
    'prod.items': 'Items',
    'prod.total': 'Total',
    'prod.checkout': 'Proceed to Checkout',
    'contact.title1': 'Get in Touch',
    'contact.title2': 'Contact Us',
    'contact.desc': 'Have questions about our collection or need help with a custom order? Our team is here to assist you.',
    'contact.name': 'Your Name',
    'contact.email': 'Email Address',
    'contact.msg': 'Message',
    'contact.send': 'Send Message',
    'contact.info': 'Contact Information',
    'contact.address': 'Dhaka, Bangladesh',
    'contact.phone': '+880 171 9082347',
    'contact.emailAddress': 'info@aranstitch.com',
    'about.title1': 'Our Story',
    'about.title2': 'About Us',
    'about.desc': 'ARAN STITCH is a premium fashion brand creating stylish and modern clothing with meticulous attention to detail.',
    'about.mission.title': 'Our Mission',
    'about.mission.desc': 'To deliver the latest fashion trends ensuring the highest quality at accessible prices.',
    'about.quality.title': 'Quality',
    'about.quality.desc': 'From thread to finish, we never compromise on the best quality materials and craftsmanship.',
    'about.customer.title': 'Customer Satisfaction',
    'about.customer.desc': 'Your satisfaction is our primary priority. We are committed to giving you the best shopping experience.',
    'about.contact.title': 'Contact Us',
    'footer.desc': 'Curated fashion for those who appreciate quality and elegance in every detail.',
    'footer.links': 'Quick Links',
    'footer.customer': 'Customer Service',
    'footer.shipping': 'Shipping Policy',
    'footer.returns': 'Returns & Exchanges',
    'footer.size': 'Size Guide',
    'footer.rights': 'All rights reserved.',
    'delivery.inside': '60',
    'delivery.outside': '120',
    'social.facebook': 'https://facebook.com',
    'social.instagram': 'https://instagram.com',
    'social.youtube': 'https://youtube.com',
    'social.whatsapp': '8801719082347',
    'social.messenger': 'https://m.me/aranstitch',
    'site.logo': '',
    'site.name': 'ARAN STITCH',
    'site.font': "'Playfair Display', serif",
  },
  bn: {
    'marquee.text1': 'আরান স্টিচে আপনাকে স্বাগত! পরিবারে ৪ সদস্যের নামের প্রথম অক্ষর নিয়ে তৈরি আমাদের ভালোবাসার ব্র্যান্ড।',
    'marquee.text2': 'যেকোনো সাহায্য বা ডিজাইন কাস্টমাইজেশনের জন্য সরাসরি হোয়াটসঅ্যাপে আমাদের টেইলরের সাথে যোগাযোগ করুন।',
    'marquee.text3': 'সারা বাংলাদেশে ক্যাশ অন ডেলিভারি (হোম ডেলিভারি সুবিধা)।',
    'nav.home': 'হোম',
    'nav.products': 'পণ্য',
    'nav.custom_order': 'কাস্টম অর্ডার করুন',
    'nav.about': 'আমাদের সম্পর্কে',
    'nav.contact': 'যোগাযোগ',
    'nav.search': 'খুঁজুন...',
    'hero.subtitle': 'প্রিমিয়াম ফ্যাশন কালেকশন',
    'hero.title1': 'প্রতিটি সেলাইয়ে',
    'hero.title2': 'আভিজাত্য',
    'hero.coverImages': 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1920,https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=1920,https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1920',
    'hero.coverImage1': 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1920',
    'hero.coverImage2': 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=1920',
    'hero.coverImage3': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1920',
    'hero.bgAnimation': 'zoom',
    'hero.desc': 'আমাদের এক্সক্লুসিভ থ্রি পিস, বোরখা এবং জেন্টস টি-শার্ট কালেকশন উপভোগ করুন, যা গুণগত মানের সাথে আপস না করে উন্নতমানের ডিজাইনে তৈরি।',
    'hero.shop': 'কেনাকাটা শুরু করুন',
    'hero.view': 'বিস্তারিত দেখুন',
    'prod.collection': 'আমাদের কালেকশন',
    'prod.timeless': 'চিরন্তন রূচিবোধ',
    'prod.all': 'সব',
    'prod.showing': 'ফলাফল দেখাচ্ছে',
    'prod.noproducts': 'আপনার পছন্দের কোন পণ্য পাওয়া যায়নি।',
    'prod.summary': 'অর্ডারের সারাংশ',
    'prod.items': 'টি',
    'prod.total': 'সর্বমোট',
    'prod.checkout': 'চেকআউট করুন',
    'contact.title1': 'আমাদের সাথে',
    'contact.title2': 'যোগাযোগ করুন',
    'contact.desc': 'আমাদের পণ্য সম্পর্কে কোন প্রশ্ন আছে বা কি কাস্টম অর্ডার প্রয়োজন? আমাদের টিম সব সময় প্রস্তুত আপনাকে সাহায্য করতে।',
    'contact.name': 'আপনার নাম',
    'contact.email': 'ইমেইল ঠিকানা',
    'contact.msg': 'মেসেজ',
    'contact.send': 'বার্তা পাঠান',
    'contact.info': 'যোগাযোগের ঠিকানা',
    'contact.address': 'ঢাকা, বাংলাদেশ',
    'contact.phone': '+880 171 9082347',
    'contact.emailAddress': 'info@aranstitch.com',
    'about.title1': 'আমাদের গল্প',
    'about.title2': 'আমাদের সম্পর্কে',
    'about.desc': 'আরান স্টিচ (ARAN STITCH) হলো একটি প্রিমিয়াম ফ্যাশন ব্র্যান্ড যা রুচিশীল এবং আধুনিক ডিজাইনের পোশাক তৈরি করে।',
    'about.mission.title': 'আমাদের লক্ষ্য',
    'about.mission.desc': 'সাশ্রয়ী মূল্যে সর্বোচ্চ গুণগত মান বজায় রেখে লেটেস্ট ফ্যাশন ট্রেন্ড সবার কাছে পৌঁছে দেওয়া।',
    'about.quality.title': 'কোয়ালিটি',
    'about.quality.desc': 'প্রতিটি সুতো থেকে ফিনিশিং পর্যন্ত, আমরা সেরা কোয়ালিটির ক্ষেত্রে কোন আপস করি না।',
    'about.customer.title': 'কাস্টমার সন্তুষ্টি',
    'about.customer.desc': 'আপনার সন্তুষ্টিই আমাদের প্রথম অগ্রাধিকার। আমরা আপনাকে সেরা শপিং অভিজ্ঞতা দিতে প্রতিশ্রুতিবদ্ধ।',
    'about.contact.title': 'যোগাযোগ করুন',
    'footer.desc': 'যাঁরা প্রতিটি ডিটেইলে গুণগত মান এবং আধুনিকতা পছন্দ করেন, তাদের জন্য বাছাইকৃত সেরা ফ্যাশন।',
    'footer.links': 'প্রয়োজনীয় লিঙ্ক',
    'footer.customer': 'কাস্টমার সার্ভিস',
    'footer.shipping': 'ডেলিভারি পলিসি',
    'footer.returns': 'রিটার্ন ও এক্সচেঞ্জ',
    'footer.size': 'সাইজ গাইড',
    'footer.rights': 'সর্বস্বত্ব সংরক্ষিত।',
    'delivery.inside': '60',
    'delivery.outside': '120',
    'social.facebook': 'https://facebook.com',
    'social.instagram': 'https://instagram.com',
    'social.youtube': 'https://youtube.com',
    'social.whatsapp': '8801719082347',
    'social.messenger': 'https://m.me/aranstitch',
    'site.logo': '',
    'site.name': 'ARAN STITCH',
    'site.font': "'Playfair Display', serif",
  }
};

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  updateTranslation: (lang: Language, key: string, value: string) => void;
  translations: Record<Language, Record<string, string>>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>('bn'); // default to bn
  const [translations, setTranslations] = useState<Record<Language, Record<string, string>>>(() => {
    const saved = localStorage.getItem('aran_translations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          en: { ...defaultTranslations.en, ...(parsed.en || {}) },
          bn: { ...defaultTranslations.bn, ...(parsed.bn || {}) }
        };
      } catch (e) {
        return defaultTranslations;
      }
    }
    return defaultTranslations;
  });

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'bn' : 'en');
  };

  const t = (key: string): string => {
    return translations[lang][key] !== undefined ? translations[lang][key] : key;
  };

  const updateTranslation = (langToUpdate: Language, key: string, value: string) => {
    const newTranslations = {
      ...translations,
      [langToUpdate]: {
        ...translations[langToUpdate],
        [key]: value
      }
    };
    setTranslations(newTranslations);
    localStorage.setItem('aran_translations', JSON.stringify(newTranslations));
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t, updateTranslation, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
