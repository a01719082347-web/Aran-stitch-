import ProductCardDefault from './ProductCard'; 
import { Product, CartItem } from '../types';
import { motion } from 'motion/react';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getDirectImageUrl } from '../utils';
import ProductDetailsModal from './ProductDetailsModal';

interface ProductsSectionProps {
  searchTerm: string;
  onBuyNow: (product: Product, action: 'cart'|'order'|'whatsapp') => void;
  products: Product[];
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  onCheckout: () => void;
}

export default function ProductsSection({ searchTerm, onBuyNow, products, cart, updateQuantity, removeItem, onCheckout }: ProductsSectionProps) {
  const { t, lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    if (productId && products.length > 0) {
      const product = products.find(p => p.id === productId);
      if (product) {
        setDetailsProduct(product);
      }
    }
  }, [products]);
  
  const dynamicCategories = Array.from(new Set(products.map(p => p.category)));
  const categories = ['All', ...dynamicCategories];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const getCategoryLabel = (cat: string) => {
    if (cat === 'All') return t('prod.all');
    if (lang === 'bn') {
      if (cat === 'Three Piece') return 'থ্রি পিস';
      if (cat === 'Burqa') return 'বোরখা';
      if (cat === 'Gents T-Shirt') return 'জেন্টস টি-শার্ট';
    }
    return cat;
  };

  return (
    <section id="products" className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <h2 className="text-sm text-yellow-600 font-bold uppercase tracking-[0.2em] mb-2">{t('prod.collection')}</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 uppercase">{t('prod.timeless')}</h3>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mt-6 mb-8"></div>
          
          {searchTerm && (
            <p className="mt-6 text-gray-500">{t('prod.showing')} "{searchTerm}"</p>
          )}

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 bg-white border border-gray-200 p-4 rounded-xl shadow-sm max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                    selectedCategory === category 
                    ? 'bg-yellow-400 text-black border-yellow-400 shadow-sm' 
                    : 'bg-transparent text-gray-600 border-gray-200 hover:border-yellow-400 hover:text-yellow-600'
                  }`}
                >
                  {getCategoryLabel(category)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Main Products Area */}
          <div className={`transition-all duration-300 ${cart.length > 0 ? 'xl:w-3/4' : 'w-full'}`}>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-500 font-medium">{t('prod.noproducts')}</p>
              </div>
            ) : (
              <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 ${cart.length > 0 ? '' : 'xl:grid-cols-5'} gap-4 md:gap-8`}>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: (index % 10) * 0.1, ease: "easeOut" }}
                  >
                    <ProductCardDefault product={product} onBuyNow={onBuyNow} onDetails={() => setDetailsProduct(product)} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Cart / Order Sidebar on Homepage */}
          {cart.length > 0 && (
            <div className="w-full xl:w-1/4">
              <div className="sticky top-24 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xl flex flex-col max-h-[80vh]">
                <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-bold uppercase tracking-wider text-gray-900">{t('prod.summary')}</h3>
                  <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">{cart.reduce((a, b) => a + b.quantity, 0)} {t('prod.items')}</span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {cart.map(item => (
                    <div key={item.cartItemId} className="flex gap-3 bg-gray-50/50 p-2 rounded border border-gray-100 relative group">
                      <button 
                        onClick={() => removeItem(item.cartItemId)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full items-center justify-center hidden group-hover:flex shadow-md"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <img src={getDirectImageUrl(item.product.image, 'w200')} alt={item.product.name} referrerPolicy="no-referrer" className="w-16 h-20 object-cover rounded border border-gray-200" />
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h4 className="text-xs font-bold text-gray-900 line-clamp-1 pr-4">{item.product.name}</h4>
                          <p className="text-[10px] text-gray-500 uppercase mt-0.5">{item.size} | {item.color}</p>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                          <div className="flex items-center gap-2 bg-white rounded border border-gray-200 px-1.5 py-0.5">
                            <button onClick={() => updateQuantity(item.cartItemId, -1)} className="text-gray-500 hover:text-gray-900"><Minus className="w-3 h-3"/></button>
                            <span className="text-[10px] font-bold min-w-[1rem] text-center text-gray-900">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.cartItemId, 1)} className="text-gray-500 hover:text-gray-900"><Plus className="w-3 h-3"/></button>
                          </div>
                          <p className="text-xs font-bold text-teal-700">৳ {(item.product.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50">
                   <div className="flex justify-between items-center mb-4">
                    <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">{t('prod.total')}</span>
                    <span className="text-lg font-bold text-gray-900">৳ {subtotal.toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={onCheckout}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded font-bold uppercase tracking-widest flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow transition-all"
                  >
                    {t('prod.checkout')} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <ProductDetailsModal 
        isOpen={!!detailsProduct} 
        onClose={() => setDetailsProduct(null)} 
        product={detailsProduct} 
        onBuyNow={onBuyNow} 
      />
    </section>
  );
}
