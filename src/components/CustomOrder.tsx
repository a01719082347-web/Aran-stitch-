import { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react';
import { Camera, Send, Scissors, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

export default function CustomOrder() {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [fabric, setFabric] = useState('');
  const [measurements, setMeasurements] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleCustomizeEvent = (e: any) => {
      if (e.detail && e.detail.productName) {
        const details = `Reference: ${e.detail.productName} (৳${e.detail.productPrice}) [ID: ${e.detail.productId}]\nI want to customize this design with: `;
        setDescription(details);
      } else {
        setDescription('');
      }
      setIsOpen(true);
    };

    // @ts-ignore
    window.addEventListener('open-custom-order', handleCustomizeEvent);
    // @ts-ignore
    return () => window.removeEventListener('open-custom-order', handleCustomizeEvent);
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...selectedFiles].slice(0, 3)); // Max 3 images
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!description && !fabric && !measurements && images.length === 0) return;

    const message = `*NEW CUSTOM ORDER INQUIRY*\n----------------------------\n*Fabric Preference:* ${fabric || 'Not specified'}\n*Measurements:* ${measurements || 'Not specified'}\n*Design Details:* ${description || 'Not specified'}\n\n*Note:* I have ${images.length} sample image(s) to show you.`;
    
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/8801719082347?text=${encoded}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal content dialog */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative bg-white border border-gray-200 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col z-10"
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)} 
              className="absolute right-4 top-4 z-20 bg-gray-100 p-1.5 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Container */}
            <div className="overflow-y-auto p-6 md:p-8">
              {/* Header inside Modal */}
              <div className="text-center mb-8 pr-6 pl-6">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-full text-yellow-600 shadow-sm animate-pulse">
                    <Scissors size={24} />
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2 font-serif text-gray-900 tracking-wide">
                  {lang === 'bn' ? 'কাস্টম অর্ডার করুন' : 'Make a Custom Order'}
                </h2>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed max-w-md mx-auto">
                  {lang === 'bn' 
                    ? 'আপনার মনে কি কোনো অনন্য ডিজাইন আছে? আপনার পছন্দের কাপড় এবং ডিজাইনের স্যাম্পল আমাদের সাথে শেয়ার করুন। আপনার আইডিয়া আপলোড করুন, এবং আমরা আপনার জন্য একটি প্রিমিয়াম পোশাক তৈরি করব!' 
                    : 'Have a unique design in mind? Share your fabric preference and design sample with us. Upload your ideas, and let\'s craft something premium exclusively for you!'}
                </p>
              </div>

              {/* Form content */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                      {lang === 'bn' ? 'পছন্দের কাপড়' : 'Fabric Preference'}
                    </label>
                    <input 
                      type="text"
                      value={fabric}
                      onChange={e => setFabric(e.target.value)}
                      placeholder={lang === 'bn' ? 'যেমন: সিল্ক, পিওর কটন, লিনেন...' : 'e.g. Silk, Pure Cotton, Linen...'}
                      className="w-full bg-gray-50 border border-gray-200 rounded-md py-2.5 px-3.5 text-gray-900 placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:bg-white transition-colors text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                      {lang === 'bn' ? 'ডিজাইনের বিস্তারিত' : 'Design Details'}
                    </label>
                    <input 
                      type="text"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder={lang === 'bn' ? 'স্টাইল, ফিট বা প্যাটার্ন বর্ণনা করুন...' : 'Describe the style, fit, or pattern...'}
                      className="w-full bg-gray-50 border border-gray-200 rounded-md py-2.5 px-3.5 text-gray-900 placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:bg-white transition-colors text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                    {lang === 'bn' ? 'মাপ (Measurements)' : 'Measurements'}
                  </label>
                  <textarea 
                    value={measurements}
                    onChange={e => setMeasurements(e.target.value)}
                    placeholder={lang === 'bn' ? 'যেমন: বুক: ৪০, লম্বা: ২৮, হাতা: ২৪...' : 'e.g. Chest: 40, Length: 28, Sleeve: 24...'}
                    rows={2}
                    className="w-full bg-gray-50 border border-gray-200 rounded-md py-2.5 px-3.5 text-gray-900 placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:bg-white transition-colors text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                    {lang === 'bn' ? 'স্যাম্পল ছবি আপলোড করুন' : 'Upload Sample Images'}
                  </label>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-yellow-400 hover:bg-gray-50/50 transition-all bg-gray-50"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-6 h-6 text-gray-400 mb-1.5" />
                    <p className="text-xs text-gray-500 font-medium">
                      {lang === 'bn' ? 'ডিজাইনের ছবি আপলোড করতে ক্লিক করুন (সর্বোচ্চ ৩টি)' : 'Click to upload design inspiration (Max 3)'}
                    </p>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                  </div>

                  {images.length > 0 && (
                    <div className="flex gap-3 mt-3 flex-wrap">
                      {images.map((file, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200 shadow-sm transition-transform hover:scale-105">
                          <img src={URL.createObjectURL(file)} alt="Sample" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-white/90 text-gray-900 p-0.5 rounded-full text-[10px] hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2 group shadow-sm uppercase tracking-wider text-xs"
                >
                  {lang === 'bn' ? 'হোয়াটসঅ্যাপে অর্ডার কনফার্ম করুন' : 'Confirm on WhatsApp'}
                  <Send size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
