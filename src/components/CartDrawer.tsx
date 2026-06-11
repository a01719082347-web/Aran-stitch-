import { X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  onCheckout: () => void;
}

import { getDirectImageUrl } from '../utils';

export default function CartDrawer({ isOpen, onClose, cart, updateQuantity, removeItem, onCheckout }: CartDrawerProps) {
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-white border-l border-gray-200 shadow-2xl z-[101] flex flex-col"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold uppercase tracking-wider text-yellow-600 flex items-center gap-2">
                Your Cart
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <p className="uppercase tracking-widest text-sm">Cart is empty</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.cartItemId} className="flex gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200 relative shadow-sm">
                    <button 
                      onClick={() => removeItem(item.cartItemId)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <img src={getDirectImageUrl(item.product.image, 'w200')} alt={item.product.name} referrerPolicy="no-referrer" className="w-20 h-24 object-cover rounded bg-gray-100" />
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-1 pr-6">{item.product.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{item.size} • {item.color}</p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-3 bg-white rounded border border-gray-200 px-2 py-1 shadow-sm">
                          <button onClick={() => updateQuantity(item.cartItemId, -1)} className="text-gray-500 hover:text-gray-900"><Minus className="w-3 h-3"/></button>
                          <span className="text-xs font-bold min-w-[1rem] text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartItemId, 1)} className="text-gray-500 hover:text-gray-900"><Plus className="w-3 h-3"/></button>
                        </div>
                        <p className="text-sm font-bold text-teal-700">৳ {(item.product.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm text-gray-500 uppercase tracking-widest">Subtotal</span>
                  <span className="text-xl font-bold text-gray-900">৳ {subtotal.toLocaleString()}</span>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-4 rounded-md font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
