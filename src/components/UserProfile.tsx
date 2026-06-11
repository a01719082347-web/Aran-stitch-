import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Order, Product } from '../types';
import { Package, Heart, RefreshCcw, LogOut } from 'lucide-react';
import ProductCardDefault from './ProductCard';

export default function UserProfile({ products, onBuyNow, onExit }: { products: Product[], onBuyNow: any, onExit: () => void }) {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist'>('orders');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'orders'), where("userId", "==", user.id));
        const snap = await getDocs(q);
        const fetchedOrders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        
        // sort by createdAt desc
        fetchedOrders.sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });
        
        setOrders(fetchedOrders);

        // Map wishlist strings to Product objects
        if (user.wishlist && user.wishlist.length > 0) {
          const list = products.filter(p => user.wishlist!.includes(p.id));
          setWishlistProducts(list);
        } else {
          setWishlistProducts([]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user, products, activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold uppercase text-yellow-600 tracking-widest mb-1">My Account</h1>
            <p className="text-gray-500">Welcome back, {user?.name || user?.email}</p>
          </div>
          <div className="flex gap-4">
            <button onClick={onExit} className="px-4 py-2 border border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded uppercase text-xs font-bold tracking-widest transition-colors flex items-center gap-2">
              Back to Shop
            </button>
            <button onClick={() => { logout(); onExit(); }} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded uppercase text-xs font-bold tracking-widest transition-colors flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        <div className="flex gap-6 border-b border-gray-200 mb-8">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`pb-3 font-bold uppercase tracking-widest text-sm flex items-center gap-2 border-b-2 transition-all ${activeTab === 'orders' ? 'border-yellow-400 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <Package className="w-4 h-4" /> Order History
          </button>
          <button 
            onClick={() => setActiveTab('wishlist')}
            className={`pb-3 font-bold uppercase tracking-widest text-sm flex items-center gap-2 border-b-2 transition-all ${activeTab === 'wishlist' ? 'border-yellow-400 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <Heart className="w-4 h-4" /> Wishlist
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-yellow-400 animate-pulse">
            <RefreshCcw className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div>
            {activeTab === 'orders' && (
              <div className="space-y-6">
                {orders.length === 0 ? (
                  <div className="text-center py-12 border border-gray-200 rounded-lg bg-white shadow-sm">
                    <p className="text-gray-500">No orders found.</p>
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="border border-gray-200 bg-white shadow-sm rounded-lg p-6 flex flex-col md:flex-row gap-6 justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex bg-gray-50 w-fit px-2 py-1 rounded border border-gray-200 text-xs items-center gap-2">
                          <span className="text-gray-500 uppercase font-bold tracking-widest">Order</span>
                          <span className="font-mono text-yellow-600">{order.id}</span>
                        </div>
                        <p className="text-sm text-gray-500">Date: {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
                        <div className="mt-4 border-t border-gray-200 pt-4">
                          <h4 className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-2">Items</h4>
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex gap-4 items-center">
                                <span className="font-bold text-gray-900 text-sm">{item.quantity}x</span>
                                <span className="text-gray-700 text-sm">{item.product.name} ({item.size}, {item.color})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="md:border-l md:border-gray-200 md:pl-6 flex flex-col justify-between items-start md:items-end md:min-w-[200px]">
                        <div className="mb-4">
                          <span className="text-xs uppercase font-bold tracking-widest text-gray-500 block mb-1">Status</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            order.status === 'Pending' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                            order.status === 'Delivered' ? 'bg-green-50 text-green-600 border border-green-200' :
                            order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border border-red-200' :
                            'bg-blue-50 text-blue-600 border border-blue-200'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="mb-4">
                          <span className="text-xs uppercase font-bold tracking-widest text-gray-500 block mb-1">Tracking ID</span>
                          <span className="font-mono text-sm text-gray-700">{order.trackingId || 'Pending'}</span>
                        </div>
                        <div>
                          <span className="text-xs uppercase font-bold tracking-widest text-gray-500 block mb-1">Total</span>
                          <span className="font-bold text-teal-700 text-lg">৳ {order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {wishlistProducts.length === 0 ? (
                   <div className="col-span-full text-center py-12 border border-gray-200 rounded-lg bg-white shadow-sm">
                    <p className="text-gray-500">Your wishlist is empty.</p>
                  </div>
                ) : (
                  wishlistProducts.map(product => (
                    <ProductCardDefault key={product.id} product={product} onBuyNow={onBuyNow} />
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
