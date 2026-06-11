import { X, CheckCircle, ShieldCheck, Phone, Map, Building2, Navigation, Home, FileText, User } from 'lucide-react';
import { useState, FormEvent, useEffect } from 'react';
import { CartItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getDivisions, getDistricts, getUpazilas } from '../utils/bdData';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onClearCart: () => void;
}

export default function CheckoutModal({ isOpen, onClose, cart, onClearCart }: CheckoutModalProps) {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [division, setDivision] = useState('');
  const [district, setDistrict] = useState('');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  
  const divisionsList = getDivisions(lang === 'bn' ? 'bn' : 'en');
  const districtList = division ? getDistricts(division, lang === 'bn' ? 'bn' : 'en') : [];
  const upazilaList = district ? getUpazilas(district, lang === 'bn' ? 'bn' : 'en') : [];
  
  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.phone) setPhone(user.phone);
    }
  }, [user, isOpen]);
  
  // Reset district/area when division changes
  useEffect(() => {
    setDistrict('');
    setArea('');
  }, [division]);

  // Reset area when district changes
  useEffect(() => {
    setArea('');
  }, [district]);

  const [deliveryArea, setDeliveryArea] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentAmountType, setPaymentAmountType] = useState('');
  const [trxId, setTrxId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const insideCharge = Number(t('delivery.inside')) || 60;
  const outsideCharge = Number(t('delivery.outside')) || 120;
  const deliveryCharge = deliveryArea === 'Inside City' ? insideCharge : (deliveryArea === 'Outside City' ? outsideCharge : 0);
  const totalAmount = subtotal + deliveryCharge - discount;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'WELCOME10') {
      setDiscount(subtotal * 0.1);
      toast.success(lang === 'bn' ? 'প্রোমো কোড প্রয়োগ করা হয়েছে!' : 'Promo code applied!');
    } else {
      setDiscount(0);
      toast.error(lang === 'bn' ? 'ভুল প্রোমো কোড' : 'Invalid promo code');
    }
  };

  const getLabel = (list: any[], val: string) => {
    const item = list.find(i => String(i.value) === String(val));
    return item ? item.title : val;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to place an order');
      return;
    }
    
    setIsSubmitting(true);
    const divLabel = getLabel(divisionsList, division);
    const distLabel = getLabel(districtList, district);
    const areaLabel = getLabel(upazilaList, area);

    const fullAddress = `${address}, ${areaLabel}, ${distLabel}, ${divLabel}. Notes: ${orderNotes}`;

    try {
      const orderId = `ord_${Date.now()}`;
      await setDoc(doc(db, 'orders', orderId), {
        userId: user.id || 'guest',
        customerName: name,
        phone,
        address: fullAddress,
        items: cart,
        subtotal,
        deliveryCharge,
        total: totalAmount,
        paymentMethod: paymentMethod === 'Cash on Delivery' ? paymentMethod : `${paymentMethod} - ${paymentAmountType}`,
        trxId: trxId || 'N/A',
        status: 'Pending',
        trackingId: `TRK-${Math.floor(Math.random() * 1000000)}`,
        createdAt: serverTimestamp()
      });
      
      toast.success(lang === 'bn' ? 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!' : 'Order placed successfully!');
      onClearCart();
      onClose();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `orders/ord_${Date.now()}`);
      toast.error('Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white border border-gray-200 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl z-10"
        >
          <div className="sticky top-0 bg-white text-gray-900 px-6 py-4 flex justify-between items-center z-20 border-b border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold uppercase tracking-wider text-yellow-600 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 cursor-pointer" /> {lang === 'bn' ? 'অর্ডার বিস্তারিত' : 'Checkout Details'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-900 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="space-y-4">
                <h4 className="font-bold border-b border-gray-200 pb-2 text-yellow-600 uppercase tracking-wider">{lang === 'bn' ? 'কাস্টমার বিস্তারিত' : 'Customer Details'}</h4>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-xs uppercase font-bold text-gray-600 mb-1">{lang === 'bn' ? 'পুরো নাম' : 'Full Name'} <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><User className="w-4 h-4" /></div>
                      <input required type="text" placeholder={lang === 'bn' ? 'পুরো নাম' : 'John Doe'} value={name} onChange={e => setName(e.target.value)} className="w-full pl-10 bg-gray-50 border border-gray-200 rounded-md py-2 text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-gray-600 mb-1">{lang === 'bn' ? 'মোবাইল নাম্বার' : 'Mobile Number'} <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Phone className="w-4 h-4" /></div>
                      <input required type="tel" placeholder={lang === 'bn' ? '০১৭১XXXXXXX' : '017XXXXXXXX'} value={phone} onChange={e => setPhone(e.target.value)} className="w-full pl-10 bg-gray-50 border border-gray-200 rounded-md py-2 text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-xs uppercase font-bold text-gray-600 mb-1">{lang === 'bn' ? 'বিভাগ' : 'Division'} <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Map className="w-4 h-4" /></div>
                      <select required value={division} onChange={e => setDivision(e.target.value)} className="w-full pl-10 bg-gray-50 border border-gray-200 rounded-md py-2 text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors appearance-none">
                        <option value="" disabled>{lang === 'bn' ? 'নির্বাচন করুন' : 'Select Division'}</option>
                        {divisionsList.map(div => <option key={div.value} value={div.value}>{div.title}</option>)}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs uppercase font-bold text-gray-600 mb-1">{lang === 'bn' ? 'জেলা' : 'District'} <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Building2 className="w-4 h-4" /></div>
                      <select required disabled={!division} value={district} onChange={e => setDistrict(e.target.value)} className="w-full pl-10 bg-gray-50 border border-gray-200 rounded-md py-2 text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors appearance-none disabled:opacity-50">
                        <option value="" disabled>{lang === 'bn' ? 'নির্বাচন করুন' : 'Select District'}</option>
                        {districtList.map(dist => <option key={dist.value} value={dist.value}>{dist.title}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-xs uppercase font-bold text-gray-600 mb-1">{lang === 'bn' ? 'উপজেলা / এলাকা' : 'Area / Upazila'} <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Navigation className="w-4 h-4" /></div>
                      <select required disabled={!district} value={area} onChange={e => setArea(e.target.value)} className="w-full pl-10 bg-gray-50 border border-gray-200 rounded-md py-2 text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors appearance-none disabled:opacity-50">
                        <option value="" disabled>{lang === 'bn' ? 'নির্বাচন করুন' : 'Select Area/Upazila'}</option>
                        {upazilaList.map(up => <option key={up.value} value={up.value}>{up.title}</option>)}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs uppercase font-bold text-gray-600 mb-1">{lang === 'bn' ? 'ডেলিভারি এরিয়া' : 'Delivery Area'} <span className="text-red-500">*</span></label>
                    <select required value={deliveryArea} onChange={e => setDeliveryArea(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-md py-2 text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors">
                      <option value="" disabled>{lang === 'bn' ? 'ডেলিভারি চার্জ নির্বাচন করুন' : 'Select Delivery Rate'}</option>
                      <option value="Inside City">{lang === 'bn' ? `ঢাকার ভেতরে (+ ${insideCharge} টাকা)` : `Inside City (+ ${insideCharge} BDT)`}</option>
                      <option value="Outside City">{lang === 'bn' ? `ঢাকার বাইরে (+ ${outsideCharge} টাকা)` : `Outside City (+ ${outsideCharge} BDT)`}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-600 mb-1">{lang === 'bn' ? 'পূর্ণাঙ্গ ঠিকানা' : 'Full Address'} <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 flex items-center pointer-events-none text-gray-400"><Home className="w-4 h-4" /></div>
                    <textarea required rows={2} placeholder={lang === 'bn' ? 'বাড়ি নং, রাস্তা নং, বিস্তারিত...' : 'House #, Road #, Area...'} value={address} onChange={e => setAddress(e.target.value)} className="w-full pl-10 bg-gray-50 border border-gray-200 rounded-md py-2 text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"></textarea>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-600 mb-1">{lang === 'bn' ? 'অর্ডার নোটস (ঐচ্ছিক)' : 'Order Notes (Optional)'}</label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 flex items-center pointer-events-none text-gray-400"><FileText className="w-4 h-4" /></div>
                    <textarea rows={2} placeholder={lang === 'bn' ? 'কোনো বিশেষ নির্দেশনা থাকলে লিখুন...' : 'Any special instructions...'} value={orderNotes} onChange={e => setOrderNotes(e.target.value)} className="w-full pl-10 bg-gray-50 border border-gray-200 rounded-md py-2 text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"></textarea>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col mb-2">
                  <h4 className="font-bold border-b border-gray-200 pb-2 text-yellow-600 uppercase tracking-wider mb-4">{lang === 'bn' ? 'পেমেন্ট বিস্তারিত' : 'Payment Details'}</h4>
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm p-4 rounded-md shadow-sm">
                    {lang === 'bn' 
                      ? 'অর্ডার কনফার্ম করার জন্য আপনাকে কমপক্ষে ডেলিভারি চার্জ অগ্রিম প্রদান করতে হবে। (ক্যাশ অন ডেলিভারি ব্যতীত) নিচে দেয়া নাম্বারে সেন্ড মানি করে ফর্মটি পূরণ করুন।' 
                      : 'To confirm your order, you must pay at least the delivery charge in advance (except Cash on Delivery). Please Send Money to the number below and fill out the form.'}
                    <div className="mt-2 text-gray-900 font-bold tracking-wider">
                      bKash / Nagad / Rocket / Card (Personal): <span className="text-yellow-600">01719082347</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  <div>
                    <label className="block text-xs uppercase font-bold text-gray-600 mb-1">{lang === 'bn' ? 'পেমেন্ট মেথড' : 'Payment Method'} <span className="text-red-500">*</span></label>
                    <select required value={paymentMethod} onChange={e => {setPaymentMethod(e.target.value); if (e.target.value === 'Cash on Delivery') {setTrxId('N/A'); setPaymentAmountType('Delivery Charge Only');}}} className="w-full bg-gray-50 border border-gray-200 rounded-md py-2 text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors">
                      <option value="" disabled>{lang === 'bn' ? 'মেথড নির্বাচন করুন' : 'Select Method'}</option>
                      <option value="Cash on Delivery">Cash on Delivery</option>
                      <option value="bKash">bKash</option>
                      <option value="Nagad">Nagad</option>
                      <option value="Card">Card</option>
                    </select>
                  </div>
                  
                  {paymentMethod !== 'Cash on Delivery' && (
                    <>
                      <div>
                        <label className="block text-xs uppercase font-bold text-gray-600 mb-1">{lang === 'bn' ? 'কীসের পেমেন্ট' : 'Advance Payment For'} <span className="text-red-500">*</span></label>
                        <select required value={paymentAmountType} onChange={e => setPaymentAmountType(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-md py-2 text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors">
                          <option value="" disabled>{lang === 'bn' ? 'নির্বাচন করুন' : 'Select Amount'}</option>
                          <option value="Delivery Charge Only">{lang === 'bn' ? 'শুধু ডেলিভারি চার্জ' : 'Delivery Charge Only'}</option>
                          <option value="Full Amount">{lang === 'bn' ? 'সম্পূর্ণ মূল্য' : 'Full Amount'}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs uppercase font-bold text-gray-600 mb-1">{lang === 'bn' ? 'ট্রানজ্যাকশন আইডি' : 'Transaction ID'} <span className="text-red-500">*</span></label>
                        <input required type="text" placeholder={lang === 'bn' ? 'যেমন: 8GXV...' : 'e.g. 8GXV...'} value={trxId} onChange={e => setTrxId(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-md py-2 text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mt-6 shadow-sm">
                <div className="flex gap-2 mb-4">
                  <input type="text" placeholder={lang === 'bn' ? 'প্রোমো কোড (যদি থাকে)' : 'Promo Code (Optional)'} value={promoCode} onChange={e => setPromoCode(e.target.value)} className="flex-1 bg-white border border-gray-200 rounded-md py-2 px-3 text-sm text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors" />
                  <button type="button" onClick={handleApplyPromo} className="px-4 py-2 border border-yellow-400 text-yellow-600 bg-white shadow-sm rounded-md text-sm font-bold uppercase transition-colors hover:bg-yellow-400 hover:text-black">
                    {lang === 'bn' ? 'প্রয়োগ' : 'Apply'}
                  </button>
                </div>
                <div className="flex justify-between mb-2 text-sm text-gray-600">
                  <span>{lang === 'bn' ? 'সাবটোটাল' : 'Subtotal'} ({cart.length} {lang === 'bn' ? 'টি' : 'items'})</span>
                  <span>৳ {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-4 text-sm text-gray-600">
                  <span>{lang === 'bn' ? 'ডেলিভারি চার্জ' : 'Delivery Charge'}</span>
                  <span>৳ {deliveryCharge}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between mb-4 text-sm text-green-600">
                    <span>{lang === 'bn' ? 'ডিসকাউন্ট' : 'Discount'}</span>
                    <span>-৳ {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                  <span className="font-bold text-xl uppercase text-gray-900">{lang === 'bn' ? 'সর্বমোট' : 'Grand Total'}</span>
                  <span className="font-bold text-2xl text-yellow-600">৳ {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full bg-yellow-400 text-black hover:bg-yellow-500 py-4 font-bold text-lg uppercase tracking-widest flex justify-center items-center gap-2 rounded-md shadow-sm disabled:opacity-50 transition-colors">
                <CheckCircle className="w-5 h-5" /> {isSubmitting ? (lang === 'bn' ? 'অপেক্ষা করুন...' : 'Processing...') : (lang === 'bn' ? 'অর্ডার সাবমিট করুন' : 'Confirm Order')}
              </button>

            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
