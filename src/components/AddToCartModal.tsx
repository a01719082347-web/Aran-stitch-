import { X, ShoppingBag, Zap, MessageCircle, Plus, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { getDirectImageUrl } from '../utils';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  defaultAction?: 'cart' | 'order' | 'whatsapp';
  onAddToCart: (item: CartItem) => void;
  onOrderNow?: (item: CartItem) => void;
  onWhatsAppOrder?: (item: CartItem) => void;
}

export default function AddToCartModal({ isOpen, onClose, product, defaultAction = 'cart', onAddToCart, onOrderNow, onWhatsAppOrder }: AddToCartModalProps) {
  const { lang, t } = useLanguage();
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [quantity, setQuantity] = useState<number | ''>(1);
  const [activeImage, setActiveImage] = useState(product?.image || '');

  useEffect(() => {
    if (product) {
      setSize(product.sizes[0] || '');
      setColor(product.colors[0] || '');
      setQuantity(1);
      setActiveImage(product.image);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const allImages = [product.image, ...(product.images || [])];

  const handleAction = (action: 'cart' | 'order' | 'whatsapp') => {
    // Validate size and color (already handled effectively by select defaults, but just in case)
    const finalQuantity = typeof quantity === 'number' ? quantity : 1;
    if (!size || !color || finalQuantity < 1) return;

    const item: CartItem = {
      cartItemId: `${product.id}-${size}-${color}`,
      product,
      size,
      color,
      quantity: finalQuantity
    };

    if (action === 'cart') {
      onAddToCart(item);
    } else if (action === 'order' && onOrderNow) {
      onOrderNow(item);
    } else if (action === 'whatsapp' && onWhatsAppOrder) {
      onWhatsAppOrder(item);
    }
    
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white border border-gray-200 rounded-lg w-full max-w-lg shadow-2xl z-10"
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold uppercase tracking-wider text-yellow-600">
              {defaultAction === 'whatsapp' ? 'WhatsApp Order Options' : defaultAction === 'order' ? 'Direct Order Options' : 'Add to Cart Options'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex gap-4 mb-6">
              <div className="flex flex-col gap-2">
                <img src={getDirectImageUrl(activeImage, 'w800')} alt={product.name} referrerPolicy="no-referrer" className="w-24 h-32 object-cover bg-gray-50 rounded border border-gray-200" />
                {allImages.length > 1 && (
                  <div className="flex gap-1.5 overflow-x-auto max-w-[96px] pb-1 scrollbar-hide">
                    {allImages.map((img, i) => (
                      <button 
                         key={i} 
                         onClick={() => setActiveImage(img)} 
                         className={`flex-shrink-0 rounded overflow-hidden border ${activeImage === img ? 'border-yellow-400' : 'border-gray-200 opacity-60 hover:opacity-100'} transition-all`}
                      >
                         <img src={getDirectImageUrl(img, 'w200')} alt="" referrerPolicy="no-referrer" className="w-8 h-10 object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-md font-bold text-gray-900 leading-tight">{product.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-teal-700 font-bold text-lg">৳ {product.price.toLocaleString()}</p>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <p className="text-gray-400 line-through text-sm">৳ {product.originalPrice.toLocaleString()}</p>
                  )}
                </div>
              </div>
            </div>

            {product.measurements && (
              <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded">
                <h4 className="text-xs uppercase text-yellow-600 font-bold mb-1 tracking-wider">{lang === 'bn' ? 'মেজারমেন্ট গাইড' : 'Measurements Guide'}</h4>
                <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">{product.measurements}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Size <span className="text-red-500">*</span></label>
                  <select required value={size} onChange={e => setSize(e.target.value)} className="w-full bg-white border border-gray-200 text-gray-900 rounded px-2 py-1.5 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400">
                    {product.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Color <span className="text-red-500">*</span></label>
                  <select required value={color} onChange={e => setColor(e.target.value)} className="w-full bg-white border border-gray-200 text-gray-900 rounded px-2 py-1.5 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400">
                    {product.colors.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Quantity <span className="text-red-500">*</span></label>
                <div className="flex items-center">
                  <div className="flex items-center bg-white border border-gray-200 rounded-md shadow-sm">
                    <button type="button" onClick={() => setQuantity(Math.max(1, (typeof quantity === 'number' ? quantity : 1) - 1))} className="px-3 py-1.5 text-gray-500 hover:text-gray-900 border-r border-gray-200 focus:outline-none"><Minus className="w-4 h-4"/></button>
                    <input 
                      type="number" 
                      min="1" 
                      max="10" 
                      value={quantity} 
                      onChange={e => {
                        const val = e.target.value;
                        if (val === '') {
                          setQuantity('');
                        } else {
                          const num = parseInt(val, 10);
                          if (!isNaN(num)) {
                            setQuantity(Math.min(10, num));
                          }
                        }
                      }} 
                      onBlur={() => {
                        if (quantity === '' || quantity < 1) setQuantity(1);
                      }}
                      className="w-16 text-center py-1.5 text-gray-900 focus:outline-none appearance-none font-bold" 
                    />
                    <button type="button" onClick={() => setQuantity(Math.min(10, (typeof quantity === 'number' ? quantity : 1) + 1))} className="px-3 py-1.5 text-gray-500 hover:text-gray-900 border-l border-gray-200 focus:outline-none"><Plus className="w-4 h-4"/></button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-6">
                <button type="button" onClick={() => handleAction('cart')} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2.5 font-bold text-xs md:text-sm uppercase tracking-widest flex justify-center items-center gap-1.5 rounded shadow-sm transition-colors">
                  <ShoppingBag className="w-4 h-4" /> Add Cart
                </button>
                <button type="button" onClick={() => handleAction('order')} className="w-full bg-gray-900 text-white py-2.5 font-bold text-xs md:text-sm uppercase tracking-widest flex justify-center items-center gap-1.5 rounded hover:bg-black transition-colors shadow-sm">
                  <Zap className="w-4 h-4" /> Order Now
                </button>
              </div>
              <button type="button" onClick={() => handleAction('whatsapp')} className="w-full bg-[#25D366] text-white py-2.5 font-bold text-xs md:text-sm uppercase tracking-widest flex justify-center items-center gap-1.5 rounded hover:bg-[#1ebd5a] transition-colors mt-2 shadow-sm">
                <MessageCircle className="w-4 h-4" /> WhatsApp Order
              </button>
              <div className="mt-4 border-t border-gray-200 pt-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  {lang === 'bn' ? 'মেজারমেন্ট গাইড' : 'Measurements Guide'}
                </p>
                {product.measurementTable && product.measurementTable.length > 0 ? (
                  <div className="overflow-x-auto w-full border border-gray-200 rounded">
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
                ) : (
                  <p className="text-[10px] text-gray-500 italic">No measurement guide available.</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
