import { X, Star, ShoppingCart, Zap, Trash2, MessageCircle, Scissors, Share2 } from 'lucide-react';
import { Product, Review } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc, serverTimestamp, getDocs, collection, query, where } from 'firebase/firestore';

interface ProductDetailsProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onBuyNow: (product: Product, action: 'cart' | 'order' | 'whatsapp') => void;
}

export default function ProductDetailsModal({ product, isOpen, onClose, onBuyNow }: ProductDetailsProps) {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setIsZoomed(false);
    if (product?.id && isOpen) {
      setReviews(product.reviews || []);
      // Optimally, fetch reviews from Firestore
      const fetchReviews = async () => {
        try {
          const q = query(collection(db, 'reviews'), where('productId', '==', product.id));
          const snap = await getDocs(q);
          const fReviews = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
          setReviews([...(product.reviews || []), ...fReviews].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i)); // merge local + firestore
        } catch (e) {
          console.error(e);
        }
      };
      // For now we'll stick to local reviews + new ones fetched from firestore
      fetchReviews();
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error(lang === 'bn' ? 'রিভিউ দেওয়ার জন্য লগইন করুন' : 'Please login to submit a review');
      return;
    }
    if (!newReviewText.trim()) return;

    setSubmittingReview(true);
    try {
      const reviewId = `rev_${Date.now()}`;
      await setDoc(doc(db, 'reviews', reviewId), {
        productId: product.id,
        userId: user.id || 'unknown',
        userName: user.name || user.email.split('@')[0],
        rating: newReviewRating,
        comment: newReviewText,
        createdAt: serverTimestamp()
      });
      toast.success('Review submitted');
      setNewReviewText('');
      setReviews(prev => [{
        id: reviewId,
        user: user.name || user.email.split('@')[0],
        rating: newReviewRating,
        comment: newReviewText
      }, ...prev]);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `reviews/rev_${Date.now()}`);
      toast.error('Failed to submit review');
    } finally {
      setSubmittingReview(false);
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white border border-gray-200 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row z-10"
          >
            <button onClick={onClose} className="absolute right-4 top-4 z-20 bg-gray-100 p-1.5 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors">
              <X className="w-5 h-5" />
            </button>

            <div className="md:w-1/2 bg-gray-50 flex items-center justify-center p-8 max-h-[40vh] md:max-h-none overflow-hidden relative border-r border-gray-100">
               <img 
                 src={getDirectImageUrl(product.image)} 
                 alt={product.name} 
                 className="w-full h-full object-contain cursor-zoom-in hover:scale-105 transition-transform duration-300"
                 referrerPolicy="no-referrer"
                 onClick={() => setIsZoomed(true)}
               />
               <div className="absolute top-4 left-4 flex gap-2">
                 <span className="bg-yellow-400 text-black px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm shadow-sm">{product.category}</span>
               </div>
            </div>

            <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col h-[50vh] md:h-auto bg-white">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-1">{product.name}</h2>
              
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(star => {
                  const ratingVal = product.adminRating !== undefined ? product.adminRating : (reviews.length > 0 ? reviews.reduce((a,c)=>a+c.rating,0)/reviews.length : 0);
                  return (
                    <Star 
                      key={star}
                      className={`w-3 h-3 ${star <= ratingVal ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                    />
                  );
                })}
                <span className="text-xs text-gray-500 ml-1">
                  ({product.adminReviewCount !== undefined ? product.adminReviewCount : reviews.length} {lang === 'bn' ? 'রিভিউ' : 'reviews'})
                </span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-teal-700">৳ {product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through">৳ {product.originalPrice.toLocaleString()}</span>
                  )}
                </div>
                <button 
                  onClick={() => {
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
                  className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded text-sm font-bold text-gray-600 hover:bg-gray-50 focus:outline-none transition-colors"
                >
                  <Share2 className="w-4 h-4" /> {lang === 'bn' ? 'শেয়ার' : 'Share'}
                </button>
              </div>

              <div className="prose prose-sm text-gray-600 mb-6 max-w-none">
                <p>{product.description}</p>
                {product.measurements && <p className="mt-2 whitespace-pre-wrap">{product.measurements}</p>}
                
                {product.measurementTable && product.measurementTable.length > 0 && (
                  <div className="mt-4 overflow-x-auto w-full border border-gray-200 rounded">
                    <table className="w-full text-left border-collapse text-[10px] sm:text-xs">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 font-bold">
                          <th className="p-1.5 sm:p-2 whitespace-nowrap border-r border-gray-200 xl:w-20">Size / Age</th>
                          <th className="p-1.5 sm:p-2 whitespace-nowrap border-r border-gray-200">{product.measurementColumns?.col1 || 'Body Length'}</th>
                          <th className="p-1.5 sm:p-2 whitespace-nowrap border-r border-gray-200">{product.measurementColumns?.col2 || '1/2 Chest'}</th>
                          <th className="p-1.5 sm:p-2 whitespace-nowrap border-r border-gray-200">{product.measurementColumns?.col3 || 'Shoulder'}</th>
                          <th className="p-1.5 sm:p-2 whitespace-nowrap border-r border-gray-200">{product.measurementColumns?.col4 || 'Armhole'}</th>
                          <th className="p-1.5 sm:p-2 whitespace-nowrap">{product.measurementColumns?.col5 || 'Sleeve'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.measurementTable.map((row, idx) => (
                          <tr key={idx} className="border-b border-gray-200 last:border-b-0">
                            <td className="p-1.5 sm:p-2 border-r border-gray-200 font-bold bg-gray-50 text-gray-800">{row.sizeLabel}</td>
                            <td className="p-1.5 sm:p-2 border-r border-gray-200 text-gray-600">{row.col1}</td>
                            <td className="p-1.5 sm:p-2 border-r border-gray-200 text-gray-600">{row.col2}</td>
                            <td className="p-1.5 sm:p-2 border-r border-gray-200 text-gray-600">{row.col3}</td>
                            <td className="p-1.5 sm:p-2 border-r border-gray-200 text-gray-600">{row.col4}</td>
                            <td className="p-1.5 sm:p-2 text-gray-600">{row.col5}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 mb-8">
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { onClose(); onBuyNow(product, 'order'); }} className="flex-1 min-w-[140px] bg-yellow-400 text-black py-3 px-4 font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 rounded hover:bg-yellow-500 transition-colors shadow-sm">
                    <Zap className="w-4 h-4" /> {lang === 'bn' ? 'অর্ডার দিন' : 'Order Now'}
                  </button>
                  <button onClick={() => { onClose(); onBuyNow(product, 'cart'); }} className="flex-1 min-w-[140px] border border-gray-300 text-gray-700 py-3 px-4 font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 rounded hover:bg-gray-100 transition-colors">
                    <ShoppingCart className="w-4 h-4" /> {lang === 'bn' ? 'কার্ট এ যোগ করুন' : 'Add to Cart'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { onClose(); onBuyNow(product, 'whatsapp'); }} className="flex-1 min-w-[140px] bg-green-500 text-white py-3 px-4 font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 rounded hover:bg-green-600 transition-colors shadow-sm">
                    <MessageCircle className="w-4 h-4" /> {lang === 'bn' ? 'হোয়াটসঅ্যাপ অর্ডার' : 'WhatsApp'}
                  </button>
                  <button onClick={() => { 
                    window.dispatchEvent(new CustomEvent('open-custom-order', {
                      detail: { productName: product.name, productPrice: product.price, productId: product.id }
                    }));
                    onClose();
                  }} className="flex-1 min-w-[140px] bg-blue-500 text-white py-3 px-4 font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 rounded hover:bg-blue-600 transition-colors shadow-sm">
                    <Scissors className="w-4 h-4" /> {lang === 'bn' ? 'কাস্টমাইজ' : 'Customize'}
                  </button>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="mt-4 border-t border-gray-100 pt-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">Customer Reviews</h3>
                
                {/* Add Review */}
                <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-xs uppercase font-bold text-gray-700 mb-2">Write a Review</h4>
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setNewReviewRating(star)} className="focus:outline-none">
                        <Star className={`w-5 h-5 ${star <= newReviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                  <textarea 
                    value={newReviewText} 
                    onChange={e => setNewReviewText(e.target.value)} 
                    placeholder="Share your thoughts about this product..."
                    className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 mb-3 focus:outline-none focus:border-yellow-400 h-20 resize-none"
                  />
                  <button 
                    disabled={submittingReview}
                    onClick={handleSubmitReview} 
                    className="px-4 py-2 bg-gray-900 text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors disabled:opacity-50 shadow-sm"
                  >
                    Submit Review
                  </button>
                </div>

                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-sm text-gray-500">No reviews yet.</p>
                  ) : (
                    reviews.map((rv, i) => (
                      <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-sm text-gray-900">{rv.user}</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star key={star} className={`w-3 h-3 ${star <= rv.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{rv.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}

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
            src={getDirectImageUrl(product.image).replace('w800', 'w1600')} 
            alt={product.name} 
            className="max-w-full max-h-[90vh] object-contain cursor-default"
            referrerPolicy="no-referrer"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
