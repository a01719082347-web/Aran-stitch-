import { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react';
import { Camera, Send, Scissors } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function CustomOrder() {
  const { lang } = useLanguage();
  const [description, setDescription] = useState('');
  const [fabric, setFabric] = useState('');
  const [measurements, setMeasurements] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleCustomizeEvent = (e: CustomEvent<{ productName: string, productPrice: number, productId: string }>) => {
      const details = `Reference: ${e.detail.productName} (৳${e.detail.productPrice}) [ID: ${e.detail.productId}]\nI want to customize this design with: `;
      setDescription(details);
      const el = document.getElementById('custom-order');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
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
    <section id="custom-order" className="py-20 relative bg-gray-50 border-t border-gray-200 border-b">
      <div className="absolute inset-0 bg-yellow-400/5 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white border border-gray-200 rounded-full text-yellow-600 shadow-sm">
              <Scissors size={28} />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif text-gray-900 tracking-wide">
            {lang === 'bn' ? 'কাস্টম অর্ডার করুন' : 'Make a Custom Order'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            {lang === 'bn' 
              ? 'আপনার মনে কি কোনো অনন্য ডিজাইন আছে? আপনার পছন্দের কাপড় এবং ডিজাইনের স্যাম্পল আমাদের সাথে শেয়ার করুন। আপনার আইডিয়া আপলোড করুন, এবং আমরা আপনার জন্য একটি প্রিমিয়াম পোশাক তৈরি করব!' 
              : 'Have a unique design in mind? Share your fabric preference and design sample with us. Upload your ideas, and let\'s craft something premium exclusively for you!'}
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-xl shadow-lg backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {lang === 'bn' ? 'পছন্দের কাপড়' : 'Fabric Preference'}
                </label>
                <input 
                  type="text"
                  value={fabric}
                  onChange={e => setFabric(e.target.value)}
                  placeholder={lang === 'bn' ? 'যেমন: সিল্ক, পিওর কটন, লিনেন...' : 'e.g. Silk, Pure Cotton, Linen...'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-md py-3 px-4 text-gray-900 placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {lang === 'bn' ? 'ডিজাইনের বিস্তারিত' : 'Design Details'}
                </label>
                <input 
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder={lang === 'bn' ? 'স্টাইল, ফিট বা প্যাটার্ন বর্ণনা করুন...' : 'Describe the style, fit, or pattern...'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-md py-3 px-4 text-gray-900 placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {lang === 'bn' ? 'মাপ (Measurements)' : 'Measurements'}
              </label>
              <textarea 
                value={measurements}
                onChange={e => setMeasurements(e.target.value)}
                placeholder={lang === 'bn' ? 'যেমন: বুক: ৪০, লম্বা: ২৮, হাতা: ২৪...' : 'e.g. Chest: 40, Length: 28, Sleeve: 24...'}
                rows={2}
                className="w-full bg-gray-50 border border-gray-200 rounded-md py-3 px-4 text-gray-900 placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {lang === 'bn' ? 'স্যাম্পল ছবি আপলোড করুন' : 'Upload Sample Images'}
              </label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-yellow-400 transition-colors bg-gray-50"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
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
                <div className="flex gap-4 mt-4 flex-wrap">
                  {images.map((file, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-200 shadow-sm">
                      <img src={URL.createObjectURL(file)} alt="Sample" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-white/80 text-gray-900 p-1 rounded-full text-xs hover:bg-red-500 hover:text-white transition-colors"
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
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2 group shadow-sm uppercase tracking-widest text-sm"
            >
              {lang === 'bn' ? 'হোয়াটসঅ্যাপে কনফার্ম করুন' : 'Confirm on WhatsApp'}
              <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
