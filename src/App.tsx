import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SubNavbar from './components/SubNavbar';
import ProductsSection from './components/Products';
import CustomOrder from './components/CustomOrder';
import AboutModal from './components/AboutModal';
import AddToCartModal from './components/AddToCartModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import { Product, CartItem, Review } from './types';
import { products as initialProducts } from './data';
import { useAuth } from './contexts/AuthContext';
import { useLanguage } from './contexts/LanguageContext';
import { db } from './lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

import UserProfile from './components/UserProfile';
import FloatingContact from './components/FloatingContact';

export default function App() {
  const [currentView, setCurrentView] = useState<'shop' | 'admin' | 'profile'>('shop');
  const [searchTerm, setSearchTerm] = useState('');
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  
  // Persisted Products State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('aran_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  // Fetch and synchronize all customer reviews from Firestore to update ratings on the Home page
  const fetchAllReviews = async () => {
    try {
      const snap = await getDocs(collection(db, 'reviews'));
      const allReviews = snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          productId: data.productId,
          user: data.userName || data.user || 'Guest User',
          rating: data.rating,
          comment: data.comment || '',
          reply: data.reply || ''
        };
      });

      setProducts(prevProducts => {
        return prevProducts.map(p => {
          const productFirestoreReviews = allReviews.filter(r => r.productId === p.id).map(r => ({
            id: r.id,
            user: r.user,
            rating: r.rating,
            comment: r.comment,
            reply: r.reply
          }));
          
          // Merge with initial system reviews to prevent losing any, keeping IDs unique
          const mergedReviews = [...(p.reviews || []), ...productFirestoreReviews].filter(
            (v, i, a) => a.findIndex(t => t.id === v.id) === i
          );
          
          return {
            ...p,
            reviews: mergedReviews
          };
        });
      });
    } catch (err) {
      console.error("Failed to fetch/sync reviews from Firestore: ", err);
    }
  };

  useEffect(() => {
    fetchAllReviews();
    window.addEventListener('refresh-reviews', fetchAllReviews);
    return () => {
      window.removeEventListener('refresh-reviews', fetchAllReviews);
    };
  }, []);

  useEffect(() => {
    document.title = t('site.name');
  }, [t]);

  useEffect(() => {
    localStorage.setItem('aran_products', JSON.stringify(products));
  }, [products]);

  // Listen to Admin toggle from footer/navbar custom event
  useEffect(() => {
    const handleToggleAdmin = () => {
      if (isAdmin) {
        setCurrentView('admin');
      } else {
        setIsAuthOpen(true);
      }
    };
    const handleToggleProfile = () => {
      if (user) {
        setCurrentView('profile');
      } else {
        setIsAuthOpen(true);
      }
    };
    const handleToggleAuth = () => setIsAuthOpen(true);
    const handleToggleAbout = () => setIsAboutOpen(true);
    
    window.addEventListener('toggle-admin', handleToggleAdmin);
    window.addEventListener('toggle-profile', handleToggleProfile);
    window.addEventListener('toggle-auth', handleToggleAuth);
    window.addEventListener('toggle-about', handleToggleAbout);
    return () => {
      window.removeEventListener('toggle-admin', handleToggleAdmin);
      window.removeEventListener('toggle-profile', handleToggleProfile);
      window.removeEventListener('toggle-auth', handleToggleAuth);
      window.removeEventListener('toggle-about', handleToggleAbout);
    };
  }, [isAdmin, user]);

  // Cart & Modals State
  const [selectedProduct, setSelectedProduct] = useState<{product: Product, action: 'cart'|'order'|'whatsapp'} | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleAddToCart = (newItem: CartItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.cartItemId === newItem.cartItemId);
      if (existing) {
        return prev.map(item => item.cartItemId === newItem.cartItemId 
          ? { ...item, quantity: item.quantity + newItem.quantity } 
          : item
        );
      }
      return [...prev, newItem];
    });
    // Open cart drawer after short delay
    setTimeout(() => setIsCartOpen(true), 150);
  };

  const handleOrderNow = (newItem: CartItem) => {
    handleAddToCart(newItem);
    setSelectedProduct(null);
    setTimeout(() => {
       setIsCartOpen(false);
       setIsCheckoutOpen(true);
    }, 200);
  };

  const handleWhatsAppOrder = (item: CartItem) => {
    const message = `*NEW INQUIRY - ${t('site.name')}*
----------------------------
*Product Details:*
Item: ${item.product.name}
Size: ${item.size}
Color: ${item.color}
Quantity: ${item.quantity}
Price: ${item.product.price * item.quantity} BDT

I would like to order this. Please let me know the next steps.`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/8801719082347?text=${encoded}`, '_blank');
    setSelectedProduct(null);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartItemId === id) {
        const newQ = item.quantity + delta;
        return { ...item, quantity: newQ > 0 ? newQ : 1 };
      }
      return item;
    }));
  };

  const removeCartItem = (id: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== id));
  };

  const handleOpenCheckout = () => {
    setIsCartOpen(false);
    if (!user) {
      setTimeout(() => setIsAuthOpen(true), 300);
      // We could store the intent to open checkout after login, but let's keep it simple
    } else {
      setTimeout(() => setIsCheckoutOpen(true), 300);
    }
  };

  if (currentView === 'admin') {
    return <AdminDashboard products={products} setProducts={setProducts} onExit={() => setCurrentView('shop')} />;
  }

  if (currentView === 'profile') {
    return <UserProfile products={products} onBuyNow={(p, a) => setSelectedProduct({product: p, action: a as any})} onExit={() => setCurrentView('shop')} />;
  }

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans overflow-x-hidden">
      <Navbar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        cartCount={cartItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
      />
      
      <main>
        <Hero />
        <SubNavbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <ProductsSection 
          products={products} 
          searchTerm={searchTerm} 
          onBuyNow={(p, a) => setSelectedProduct({product: p, action: a})} 
          cart={cart}
          updateQuantity={updateCartQuantity}
          removeItem={removeCartItem}
          onCheckout={handleOpenCheckout}
        />
        <CustomOrder />
      </main>

      <AddToCartModal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        product={selectedProduct?.product || null} 
        defaultAction={selectedProduct?.action || 'cart'}
        onAddToCart={handleAddToCart}
        onOrderNow={handleOrderNow}
        onWhatsAppOrder={handleWhatsAppOrder}
      />
      
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateCartQuantity}
        removeItem={removeCartItem}
        onCheckout={handleOpenCheckout}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onClearCart={() => setCart([])}
      />
      
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <FloatingContact />
    </div>
  );
}
