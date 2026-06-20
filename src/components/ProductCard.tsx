import { Star, ShoppingCart, MessageCircle, Zap, Heart, Scissors, ZoomIn, X, Share2 } from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';

interface ProductCardProps {
  product: Product;
  onBuyNow: (product: Product, action: 'cart' | 'order' | 'whatsapp') => void;
  onDetails?: () => void;
  key?: any;
}

export default function ProductCard({ product, onBuyNow, onDetails }: ProductCardProps) {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (user && user.wishlist && typeof user.wishlist !== 'function') {
      setIsWishlisted(user.wishlist.includes(product.id));
    }
  }, [user, product.id]);

  const toggleWishlist = async () => {
    if (!user) {
      toast.info(lang === 'bn' ? 'অনুগ্রহ করে লগইন করুন' : 'Please login to add to wishlist');
      return;
    }
    
    try {
      const userRef = doc(db, 'users', user.id!);
      if (isWishlisted) {
        await updateDoc(userRef, { 
          wishlist: arrayRemove(product.id),
          updatedAt: serverTimestamp()
        });
        setIsWishlisted(false);
        user.wishlist = user.wishlist?.filter(id => id !== product.id) || [];
        toast.info('Removed from wishlist');
      } else {
        await updateDoc(userRef, { 
          wishlist: arrayUnion(product.id),
          updatedAt: serverTimestamp()
        });
        setIsWishlisted(true);
        user.wishlist = [...(user.wishlist || []), product.id];
        toast.success('Added to wishlist');
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${user.id}`);
      toast.error('Error updating wishlist');
    }
  };

  const getDirectImageUrl = (url: string) => {
    if (!url) return '';
    const match = url.match(/(?:file\/d\/|open\?id=|id=)([-a-zA-Z0-9_]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
    }
    return url;
  };

  const imagesList = [getDirectImageUrl(product.image)];
  if (product.images && product.images.length > 0) {
    imagesList.push(getDirectImageUrl(product.images[0])); // Take at most 2 images for the quick animation
  }

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    if (imagesList.length > 1) {
      // Add random stagger from 0 to 2 seconds so cards don't animate all at once
      const staggerDelay = Math.random() * 2000;
      
      timeout = setTimeout(() => {
        // First transition after delay
        setCurrentImgIndex((prev) => (prev + 1) % imagesList.length);
        
        // Then start continuous interval, slightly randomized to stay out of sync
        timer = setInterval(() => {
          setCurrentImgIndex((prev) => (prev + 1) % imagesList.length);
        }, 3000 + Math.random() * 1000);
      }, staggerDelay);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
      if (timer) clearInterval(timer);
    };
  }, [imagesList.length]);

  const avgRating = product.adminRating !== undefined 
    ? product.adminRating 
    : (product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : 0);

  const reviewCount = product.adminReviewCount !== undefined 
    ? product.adminReviewCount 
    : product.reviews.length;

  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const getCategoryLabel = (cat: string) => {
    if (lang === 'bn') {
      if (cat === 'Three Piece') return 'থ্রি পিস';
      if (cat === 'Burqa') return 'বোরখা';
      if (cat === 'Gents T-Shirt') return 'জেন্টস টি-শার্ট';
    }
    return cat;
  };

  return (
    <>
      <div className="bg-white border border-gray-200 group overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col rounded-md shadow-sm relative">
        <div 
          className="relative overflow-hidden aspect-[4/5] bg-gray-50 flex items-center justify-center cursor-pointer"
          onClick={onDetails}
        >
        <AnimatePresence>
          <motion.img 
            key={currentImgIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            src={imagesList[currentImgIndex]} 
            alt={product.name} 
            referrerPolicy="no-referrer"
            className="absolute inset-0 object-contain w-full h-full group-hover:scale-105 transition-transform duration-700"
          />
        </AnimatePresence>

        {/* Zoom Icon */}
        <div 
          onClick={(e) => { e.stopPropagation(); setIsZoomed(true); }}
          className="absolute top-2 right-2 bg-white/70 p-1.5 md:p-2 rounded-full shadow-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-zoom-in hover:bg-white z-10"
        >
          <ZoomIn className="w-4 h-4 md:w-5 md:h-5" />
        </div>

        {/* Share Button */}
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            const url = `${window.location.origin}/?product=${product.id}`;
            if (navigator.share) {
              navigator.share({
                title: product.name,
                text: `Check out ${product.name} at ARAN STITCH!`,
                url: url
              }).catch(console.error);
            } else {
              navigator.clipboard.writeText(url);
              toast.success(lang === 'bn' ? 'লিঙ্ক কপি করা হয়েছে!' : 'Link copied to clipboard!');
            }
          }}
          className="absolute top-12 right-2 bg-white/70 p-1.5 md:p-2 rounded-full shadow-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white z-10"
        >
          <Share2 className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* Wishlist Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); toggleWishlist(); }}
          className={`absolute z-10 bottom-2 right-2 p-1.5 md:p-2 rounded-full shadow-sm bg-white transition-colors border ${isWishlisted ? 'border-red-200 text-red-500' : 'border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-300'}`}
        >
          <Heart className={`w-3 h-3 md:w-4 md:h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
        </button>

        {discountPercentage > 0 && (
          <div className="absolute z-10 top-2 left-2 bg-[#ff3b30] text-white px-2 py-1 text-[10px] md:text-xs font-bold rounded-sm shadow-sm">
            -{discountPercentage}%
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-grow p-3 bg-white">
        <h3 onClick={onDetails} className="font-medium text-[13px] md:text-sm text-gray-900 mb-0.5 cursor-pointer hover:text-yellow-600 transition-colors">{product.name}</h3>
        <p className="text-gray-400 text-[10px] mb-2">{getCategoryLabel(product.category)}</p>

        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map(star => (
            <Star 
              key={star}
              className={`w-3.5 h-3.5 md:w-4 md:h-4 ${star <= avgRating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
            />
          ))}
          <span className="text-[10px] text-gray-500 ml-1">({reviewCount})</span>
        </div>
        
        <div className="flex flex-col mt-auto pt-2 gap-2">
          <div className="flex items-center gap-2 mb-1">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] md:text-[11px] text-gray-400 line-through line-through-decoration-gray-400">{product.originalPrice.toLocaleString()}৳</span>
            )}
            <span className="text-[13px] md:text-sm font-bold text-teal-700">{product.price.toLocaleString()}৳</span>
          </div>
          
          <div className="grid grid-cols-2 gap-1.5">
            <button 
              onClick={() => onBuyNow(product, 'order')}
              className="flex items-center justify-center gap-1 text-[10px] uppercase bg-yellow-400 text-black px-1 py-1.5 hover:bg-yellow-500 transition-colors rounded-sm font-bold shadow-sm"
            >
              <Zap className="w-3 h-3 md:w-3.5 md:h-3.5" /> {lang === 'bn' ? 'অর্ডার' : 'Try On'}
            </button>
            <button 
              onClick={() => onBuyNow(product, 'cart')}
              className="flex items-center justify-center gap-1 text-[10px] uppercase bg-zinc-900 text-white px-1 py-1.5 hover:bg-zinc-800 transition-colors rounded-sm font-bold shadow-sm"
            >
              <ShoppingCart className="w-3 h-3 md:w-3.5 md:h-3.5" /> {lang === 'bn' ? 'কার্ট' : 'Add to cart'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mt-1.5">
            <button 
              onClick={() => onBuyNow(product, 'whatsapp')}
              className="flex items-center justify-center gap-1 text-[10px] uppercase bg-green-500 text-white px-1 py-1.5 hover:bg-green-600 transition-colors rounded-sm font-bold shadow-sm"
            >
              <MessageCircle className="w-3 h-3 md:w-3.5 md:h-3.5" /> {lang === 'bn' ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                window.dispatchEvent(new CustomEvent('open-custom-order', {
                  detail: { productName: product.name, productPrice: product.price, productId: product.id }
                }));
              }}
              className="flex items-center justify-center gap-1 text-[10px] uppercase bg-blue-500 text-white px-1 py-1.5 hover:bg-blue-600 transition-colors rounded-sm font-bold shadow-sm"
            >
              <Scissors className="w-3 h-3 md:w-3.5 md:h-3.5" /> {lang === 'bn' ? 'কাস্টমাইজ' : 'Customize'}
            </button>
          </div>
        </div>
      </div>
    </div>

      {isZoomed && (
        <div 
          className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <button 
            onClick={() => setIsZoomed(false)} 
            className="absolute right-4 top-4 md:right-8 md:top-8 z-[130] bg-white/10 p-2 md:p-3 rounded-full text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <img 
            src={imagesList[currentImgIndex]}
            alt={product.name} 
            className="max-w-full max-h-[90vh] object-contain cursor-default"
            referrerPolicy="no-referrer"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
