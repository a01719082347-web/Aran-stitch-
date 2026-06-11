import { useState, FormEvent, useEffect } from 'react';
import { Product } from '../types';
import { ArrowLeft, Trash2, Plus, Image as ImageIcon, X, Info, Package, Settings, Edit, LogOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface AdminDashboardProps {
  products: Product[];
  setProducts: (items: Product[]) => void;
  onExit: () => void;
}

export default function AdminDashboard({ products, setProducts, onExit }: AdminDashboardProps) {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'site-content'>('products');
  const [isAdding, setIsAdding] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [sizesStr, setSizesStr] = useState('M, L, XL');
  const [colorsStr, setColorsStr] = useState('Black, White');
  const [imagesStr, setImagesStr] = useState('');
  const { lang, translations, updateTranslation } = useLanguage();
  const [editLang, setEditLang] = useState<'en' | 'bn'>(lang);
  
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: 'Three Piece',
    price: 0,
    originalPrice: 0,
    image: '',
    description: '',
    measurementColumns: {
      col1: 'Body Length',
      col2: '1/2 Chest',
      col3: 'Shoulder',
      col4: 'Armhole',
      col5: 'Sleeve'
    },
    measurementTable: [],
    isBabyProduct: false,
    tag: 'None'
  });

  const confirmDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    setDeleteConfirmId(null);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleEdit = (product: Product) => {
    setEditingProductId(product.id);
    setIsAdding(true);
    setNewProduct({
      ...product,
      measurementColumns: product.measurementColumns || {
        col1: 'Body Length',
        col2: '1/2 Chest',
        col3: 'Shoulder',
        col4: 'Armhole',
        col5: 'Sleeve'
      }
    });
    setSizesStr(product.sizes ? product.sizes.join(', ') : '');
    setColorsStr(product.colors ? product.colors.join(', ') : '');
    setImagesStr(product.images ? product.images.join(', ') : '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingProductId(null);
    setNewProduct({
      name: '',
      category: 'Three Piece',
      price: 0,
      originalPrice: 0,
      image: '',
      description: '',
      measurementColumns: {
        col1: 'Body Length',
        col2: '1/2 Chest',
        col3: 'Shoulder',
        col4: 'Armhole',
        col5: 'Sleeve'
      },
      measurementTable: [],
      isBabyProduct: false,
      tag: 'None',
      adminRating: undefined,
      adminReviewCount: undefined
    });
    setSizesStr('M, L, XL');
    setColorsStr('Black, White');
    setImagesStr('');
  };

  const handleAddSubmit = (e: FormEvent) => {
    e.preventDefault();
    const productData: Product = {
      ...(newProduct as Product),
      sizes: sizesStr.split(',').map(s => s.trim()).filter(Boolean),
      colors: colorsStr.split(',').map(s => s.trim()).filter(Boolean),
      images: imagesStr.split(',').map(s => s.trim()).filter(Boolean),
      id: editingProductId || Date.now().toString(),
      reviews: newProduct.reviews || []
    };
    
    if (editingProductId) {
      setProducts(products.map(p => p.id === editingProductId ? productData : p));
    } else {
      setProducts([...products, productData]);
    }
    
    handleCancel();
  };

  const getDirectImageUrl = (url: string) => {
    if (!url) return '';
    const match = url.match(/(?:file\/d\/|open\?id=|id=)([-a-zA-Z0-9_]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w200`;
    }
    return url;
  };

  return (
    <div className="w-full overflow-x-hidden min-h-screen bg-[var(--color-dark-bg)] text-gray-900 pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 border-b border-gray-200 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <button onClick={onExit} className="flex items-center gap-2 text-gray-600 font-medium hover:text-yellow-500 transition-colors text-sm uppercase tracking-widest">
                <ArrowLeft className="w-4 h-4" /> Back to Store
              </button>
              <button onClick={() => { logout(); onExit(); }} className="flex items-center gap-2 text-gray-600 font-medium hover:text-red-500 transition-colors text-sm uppercase tracking-widest border-l border-gray-200 pl-4">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold uppercase gold-text">Admin Control Panel</h1>
          </div>
          
          <div className="flex flex-wrap bg-gray-50 p-1 rounded-md border border-gray-200">
            <button 
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-3 py-2 md:px-4 rounded text-[10px] md:text-sm uppercase font-bold transition-colors ${activeTab === 'products' ? 'bg-gold text-black' : 'text-gray-600 font-medium hover:text-gray-900'}`}
            >
              <Package className="w-4 h-4" /> Products
            </button>
            <button 
              onClick={() => setActiveTab('site-content')}
              className={`flex items-center gap-2 px-3 py-2 md:px-4 rounded text-[10px] md:text-sm uppercase font-bold transition-colors ${activeTab === 'site-content' ? 'bg-gold text-black' : 'text-gray-600 font-medium hover:text-gray-900'}`}
            >
              <Settings className="w-4 h-4" /> Site Content
            </button>
          </div>
        </div>

        {activeTab === 'site-content' && (
          <div className="bg-white shadow-md border border-gray-200 rounded p-6 md:p-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold gold-text">Edit Site Content</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setEditLang('en')}
                  className={`px-4 py-2 rounded text-xs md:text-sm font-bold uppercase transition-colors border ${editLang === 'en' ? 'bg-gold border-gold text-black' : 'border-zinc-700 text-gray-600 font-medium hover:border-gold hover:text-gold'}`}
                >
                  English
                </button>
                <button 
                  onClick={() => setEditLang('bn')}
                  className={`px-4 py-2 rounded text-xs md:text-sm font-bold uppercase transition-colors border ${editLang === 'bn' ? 'bg-gold border-gold text-black' : 'border-zinc-700 text-gray-600 font-medium hover:border-gold hover:text-gold'}`}
                >
                  Bangla
                </button>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold border-b border-gray-200 pb-2">Hero Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Subtitle</label>
                    <input className="w-full" value={translations[editLang]['hero.subtitle'] || ''} onChange={(e) => updateTranslation(editLang, 'hero.subtitle', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Title Part 1</label>
                    <input className="w-full" value={translations[editLang]['hero.title1'] || ''} onChange={(e) => updateTranslation(editLang, 'hero.title1', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Title Part 2 (Gold)</label>
                    <input className="w-full" value={translations[editLang]['hero.title2'] || ''} onChange={(e) => updateTranslation(editLang, 'hero.title2', e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Cover Image 1 URL</label>
                    <input className="w-full mb-2" value={translations[editLang]['hero.coverImage1'] || ''} onChange={(e) => updateTranslation(editLang, 'hero.coverImage1', e.target.value)} />
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Cover Image 2 URL</label>
                    <input className="w-full mb-2" value={translations[editLang]['hero.coverImage2'] || ''} onChange={(e) => updateTranslation(editLang, 'hero.coverImage2', e.target.value)} />
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Cover Image 3 URL</label>
                    <input className="w-full" value={translations[editLang]['hero.coverImage3'] || ''} onChange={(e) => updateTranslation(editLang, 'hero.coverImage3', e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Animation Style</label>
                    <select className="w-full" value={translations[editLang]['hero.bgAnimation'] || 'zoom'} onChange={(e) => updateTranslation(editLang, 'hero.bgAnimation', e.target.value)}>
                      <option value="fade">Fade</option>
                      <option value="zoom">Zoom</option>
                      <option value="slideRight">Slide Right</option>
                      <option value="slideLeft">Slide Left</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Description</label>
                    <textarea rows={3} className="w-full" value={translations[editLang]['hero.desc'] || ''} onChange={(e) => updateTranslation(editLang, 'hero.desc', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold border-b border-gray-200 pb-2">Contact Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Contact Phone</label>
                    <input className="w-full" value={translations[editLang]['contact.phone'] || ''} onChange={(e) => updateTranslation(editLang, 'contact.phone', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Contact Email</label>
                    <input className="w-full" value={translations[editLang]['contact.emailAddress'] || ''} onChange={(e) => updateTranslation(editLang, 'contact.emailAddress', e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Address</label>
                    <textarea rows={2} className="w-full" value={translations[editLang]['contact.address'] || ''} onChange={(e) => updateTranslation(editLang, 'contact.address', e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Contact Text Description</label>
                    <textarea rows={2} className="w-full" value={translations[editLang]['contact.desc'] || ''} onChange={(e) => updateTranslation(editLang, 'contact.desc', e.target.value)} />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-bold border-b border-gray-200 pb-2">About Us Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Small Title</label>
                    <input className="w-full" value={translations[editLang]['about.title1'] || ''} onChange={(e) => updateTranslation(editLang, 'about.title1', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Main Title</label>
                    <input className="w-full" value={translations[editLang]['about.title2'] || ''} onChange={(e) => updateTranslation(editLang, 'about.title2', e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Description</label>
                    <textarea rows={3} className="w-full" value={translations[editLang]['about.desc'] || ''} onChange={(e) => updateTranslation(editLang, 'about.desc', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Mission Title</label>
                    <input className="w-full" value={translations[editLang]['about.mission.title'] || ''} onChange={(e) => updateTranslation(editLang, 'about.mission.title', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Mission Description</label>
                    <textarea rows={2} className="w-full" value={translations[editLang]['about.mission.desc'] || ''} onChange={(e) => updateTranslation(editLang, 'about.mission.desc', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Quality Title</label>
                    <input className="w-full" value={translations[editLang]['about.quality.title'] || ''} onChange={(e) => updateTranslation(editLang, 'about.quality.title', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Quality Description</label>
                    <textarea rows={2} className="w-full" value={translations[editLang]['about.quality.desc'] || ''} onChange={(e) => updateTranslation(editLang, 'about.quality.desc', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Customer Title</label>
                    <input className="w-full" value={translations[editLang]['about.customer.title'] || ''} onChange={(e) => updateTranslation(editLang, 'about.customer.title', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Customer Description</label>
                    <textarea rows={2} className="w-full" value={translations[editLang]['about.customer.desc'] || ''} onChange={(e) => updateTranslation(editLang, 'about.customer.desc', e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Contact Title</label>
                    <input className="w-full" value={translations[editLang]['about.contact.title'] || ''} onChange={(e) => updateTranslation(editLang, 'about.contact.title', e.target.value)} />
                  </div>
                </div>
              </div>

               <div className="space-y-4">
                <h3 className="text-xl font-bold border-b border-gray-200 pb-2">Footer Section</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Footer Description</label>
                    <textarea rows={2} className="w-full" value={translations[editLang]['footer.desc'] || ''} onChange={(e) => updateTranslation(editLang, 'footer.desc', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold border-b border-gray-200 pb-2">Delivery Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Inside City Charge (BDT)</label>
                    <input type="number" className="w-full" value={translations[editLang]['delivery.inside'] || ''} onChange={(e) => updateTranslation(editLang, 'delivery.inside', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Outside City Charge (BDT)</label>
                    <input type="number" className="w-full" value={translations[editLang]['delivery.outside'] || ''} onChange={(e) => updateTranslation(editLang, 'delivery.outside', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold border-b border-gray-200 pb-2">General Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Site Name</label>
                    <input className="w-full" value={translations[editLang]['site.name'] || ''} onChange={(e) => updateTranslation(editLang, 'site.name', e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Site Font (Brand Name)</label>
                    <select 
                      className="w-full" 
                      value={translations[editLang]['site.font'] || "'Playfair Display', serif"} 
                      onChange={(e) => updateTranslation(editLang, 'site.font', e.target.value)}
                    >
                      <option value="ui-sans-serif, system-ui, sans-serif">Default System Sans</option>
                      <option value="ui-serif, Georgia, Cambria, serif">Default System Serif</option>
                      <option value="'Playfair Display', serif">Playfair Display (Elegant Serif)</option>
                      <option value="'Cinzel', serif">Cinzel (Classic Roman)</option>
                      <option value="'Montserrat', sans-serif">Montserrat (Modern Sans)</option>
                      <option value="'Lato', sans-serif">Lato (Clean Sans)</option>
                      <option value="'Oswald', sans-serif">Oswald (Bold Compact)</option>
                      <option value="'Merriweather', serif">Merriweather (Readable Serif)</option>
                      <option value="'Great Vibes', cursive">Great Vibes (Stylish Script)</option>
                      <option value="'Dancing Script', cursive">Dancing Script (Casual Script)</option>
                      <option value="'Pacifico', cursive">Pacifico (Fun Brush)</option>
                      <option value="'Roboto', sans-serif">Roboto (Clean Tech)</option>
                    </select>
                    <div className="mt-3 p-4 bg-gray-50 border border-gray-100 rounded flex justify-center items-center">
                      <span className="text-2xl md:text-3xl" style={{ fontFamily: translations[editLang]['site.font'] || "'Playfair Display', serif" }}>
                        {translations[editLang]['site.name'] || 'ARAN STITCH'}
                      </span>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Site Logo URL (Leave empty to use default icon)</label>
                    <input className="w-full" value={translations[editLang]['site.logo'] || ''} onChange={(e) => updateTranslation(editLang, 'site.logo', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold border-b border-gray-200 pb-2">Social Links Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Facebook URL</label>
                    <input className="w-full" value={translations[editLang]['social.facebook'] || ''} onChange={(e) => updateTranslation(editLang, 'social.facebook', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Instagram URL</label>
                    <input className="w-full" value={translations[editLang]['social.instagram'] || ''} onChange={(e) => updateTranslation(editLang, 'social.instagram', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">YouTube URL</label>
                    <input className="w-full" value={translations[editLang]['social.youtube'] || ''} onChange={(e) => updateTranslation(editLang, 'social.youtube', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">WhatsApp Number</label>
                    <input className="w-full" value={translations[editLang]['social.whatsapp'] || ''} onChange={(e) => updateTranslation(editLang, 'social.whatsapp', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 font-medium mb-1">Messenger URL</label>
                    <input className="w-full" value={translations[editLang]['social.messenger'] || ''} onChange={(e) => updateTranslation(editLang, 'social.messenger', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => alert("Settings saved successfully!")}
                  className="btn-gold px-8 py-3 rounded font-bold uppercase text-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold uppercase tracking-wider gold-text">Product Catalog ({products.length})</h2>
              <button 
                onClick={() => isAdding ? handleCancel() : setIsAdding(true)}
                className="btn-gold px-4 py-2 rounded flex items-center gap-2 text-sm"
              >
                {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {isAdding ? 'Cancel' : 'Add Product'}
              </button>
            </div>

            {isAdding && (
              <div className="bg-white shadow-md border border-gray-200 rounded p-6 mb-8 shadow-2xl">
                <h3 className="text-xl font-bold mb-4 gold-text">{editingProductId ? 'Edit Product' : 'Add New Product'}</h3>
                <form onSubmit={handleAddSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase text-gray-600 font-medium mb-1">Product Name</label>
                      <input required type="text" className="w-full" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="e.g. Elegant Check Shirt" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-600 font-medium mb-1">Category</label>
                      <input 
                        required 
                        list="categories-list"
                        type="text" 
                        className="w-full" 
                        value={newProduct.category} 
                        onChange={e => setNewProduct({...newProduct, category: e.target.value})} 
                        placeholder="e.g. Three Piece, Burqa, etc." 
                      />
                      <datalist id="categories-list">
                        <option value="Three Piece" />
                        <option value="Burqa" />
                        <option value="Gents T-Shirt" />
                        {Array.from(new Set(products.map(p => p.category))).filter(c => !['Three Piece', 'Burqa', 'Gents T-Shirt'].includes(c)).map(c => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-600 font-medium mb-1">Price (BDT)</label>
                      <input required type="number" className="w-full" min="0" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-600 font-medium mb-1">Original Price (Optional BDT)</label>
                      <input type="number" className="w-full" min="0" value={newProduct.originalPrice || ''} onChange={e => setNewProduct({...newProduct, originalPrice: e.target.value ? Number(e.target.value) : undefined})} placeholder="e.g. 1500" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-600 font-medium mb-1">Primary Image URL</label>
                      <input required type="url" className="w-full" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} placeholder="https://example.com/image.jpg" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-600 font-medium mb-1">Additional Image URLs (Comma separated)</label>
                      <input type="text" className="w-full" value={imagesStr} onChange={e => setImagesStr(e.target.value)} placeholder="https://..., https://..." />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-600 font-medium mb-1">Product Tag</label>
                      <select required className="w-full" value={newProduct.tag || 'None'} onChange={e => setNewProduct({...newProduct, tag: e.target.value as Product['tag']})}>
                        <option value="None">None</option>
                        <option value="New Arrival">New Arrival</option>
                        <option value="Trending">Trending</option>
                        <option value="Popular">Popular</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-600 font-medium mb-1">Override Rating (1-5)</label>
                      <input type="number" step="0.1" min="1" max="5" className="w-full" value={newProduct.adminRating || ''} onChange={e => setNewProduct({...newProduct, adminRating: e.target.value ? Number(e.target.value) : undefined})} placeholder="e.g. 4.5" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-600 font-medium mb-1">Override Review Count</label>
                      <input type="number" min="0" className="w-full" value={newProduct.adminReviewCount || ''} onChange={e => setNewProduct({...newProduct, adminReviewCount: e.target.value ? Number(e.target.value) : undefined})} placeholder="e.g. 120" />
                    </div>
                    <div className="pt-2">
                      <label className="flex items-center gap-2 text-xs uppercase text-gray-500 mb-1 cursor-pointer">
                        <input type="checkbox" checked={newProduct.isBabyProduct || false} onChange={e => setNewProduct({...newProduct, isBabyProduct: e.target.checked})} className="accent-gold rounded-sm w-4 h-4 cursor-pointer" />
                        <span className="font-bold text-gray-800 tracking-wider">This is a Baby Product</span>
                      </label>
                      <label className="block text-xs uppercase text-gray-600 font-medium mt-3 mb-1">
                        {newProduct.isBabyProduct ? 'Baby Ages/Sizes (Comma separated)' : 'Sizes (Comma separated)'}
                      </label>
                      <input required type="text" className="w-full" value={sizesStr} onChange={e => setSizesStr(e.target.value)} placeholder={newProduct.isBabyProduct ? "1 Month, 2 Months, 1 Year, 1.5 Years, 2 Years" : "S, M, L, XL"} list={newProduct.isBabyProduct ? "baby-sizes-preset" : undefined} />
                      {newProduct.isBabyProduct && (
                        <datalist id="baby-sizes-preset">
                          <option value="1 Month, 2 Months, 3 Months, 6 Months, 9 Months, 1 Year, 1.5 Years, 2 Years" />
                          <option value="1-3M, 3-6M, 6-9M, 9-12M, 1-2Y" />
                        </datalist>
                      )}
                    </div>
                    <div className="pt-2 sm:pt-[2.2rem]">
                      <label className="block text-xs uppercase text-gray-600 font-medium mb-1">Colors (Comma separated)</label>
                      <input required type="text" className="w-full" value={colorsStr} onChange={e => setColorsStr(e.target.value)} placeholder="Black, White, Gold" />
                    </div>
                    <div className="col-span-1 md:col-span-2 mt-2 border-2 border-yellow-200 p-4 rounded bg-orange-50/50 shadow-inner">
                      <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-bold uppercase text-amber-800 tracking-widest flex items-center gap-2">
                          Product Measurement Chart
                        </label>
                        <button type="button" onClick={() => setNewProduct({...newProduct, measurementTable: [...(newProduct.measurementTable || []), {sizeLabel: '', col1: '', col2: '', col3: '', col4: '', col5: ''}]})} className="text-xs bg-amber-500 hover:bg-amber-600 px-3 py-1.5 rounded text-white flex items-center gap-1 uppercase tracking-wider font-bold transition-colors shadow-sm">
                          <Plus className="w-4 h-4" /> Add Row
                        </button>
                      </div>
                      
                      {newProduct.measurementTable && newProduct.measurementTable.length > 0 ? (
                        <div className="overflow-x-auto w-full pb-2">
                          <p className="text-xs text-amber-700 font-medium mb-3 italic">Click the column headers below to rename them! Need more space? Scroll horizontally.</p>
                          <table className="w-full text-left border-collapse text-sm min-w-[700px]">
                            <thead>
                              <tr className="border-b-2 border-amber-200 text-amber-800 tracking-wider">
                                <th className="p-2 font-bold w-24">Size/Age</th>
                                <th className="p-1 font-bold"><input className="w-full bg-white border border-amber-200 rounded text-amber-900 font-bold text-xs p-2 text-center" value={newProduct.measurementColumns?.col1 || 'Body Length'} onChange={e => setNewProduct({...newProduct, measurementColumns: {...newProduct.measurementColumns, col1: e.target.value} as any})} /></th>
                                <th className="p-1 font-bold"><input className="w-full bg-white border border-amber-200 rounded text-amber-900 font-bold text-xs p-2 text-center" value={newProduct.measurementColumns?.col2 || '1/2 Chest'} onChange={e => setNewProduct({...newProduct, measurementColumns: {...newProduct.measurementColumns, col2: e.target.value} as any})} /></th>
                                <th className="p-1 font-bold"><input className="w-full bg-white border border-amber-200 rounded text-amber-900 font-bold text-xs p-2 text-center" value={newProduct.measurementColumns?.col3 || 'Shoulder'} onChange={e => setNewProduct({...newProduct, measurementColumns: {...newProduct.measurementColumns, col3: e.target.value} as any})} /></th>
                                <th className="p-1 font-bold"><input className="w-full bg-white border border-amber-200 rounded text-amber-900 font-bold text-xs p-2 text-center" value={newProduct.measurementColumns?.col4 || 'Armhole'} onChange={e => setNewProduct({...newProduct, measurementColumns: {...newProduct.measurementColumns, col4: e.target.value} as any})} /></th>
                                <th className="p-1 font-bold"><input className="w-full bg-white border border-amber-200 rounded text-amber-900 font-bold text-xs p-2 text-center" value={newProduct.measurementColumns?.col5 || 'Sleeve'} onChange={e => setNewProduct({...newProduct, measurementColumns: {...newProduct.measurementColumns, col5: e.target.value} as any})} /></th>
                                <th className="p-2 font-bold w-12 text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-amber-100">
                              {newProduct.measurementTable.map((row, idx) => (
                                <tr key={idx} className="hover:bg-amber-100/30 transition-colors">
                                  <td className="p-1"><input className="w-full text-base p-2 h-10 bg-white border border-gray-300 rounded font-bold text-center text-cyan-800" value={row.sizeLabel} onChange={(e) => {
                                    const newTable = [...(newProduct.measurementTable || [])];
                                    newTable[idx].sizeLabel = e.target.value;
                                    setNewProduct({...newProduct, measurementTable: newTable});
                                  }} placeholder="14 / S" /></td>
                                  
                                  <td className="p-1"><input type="text" inputMode="decimal" className="w-full text-base p-2 h-10 bg-white border border-gray-300 rounded text-center text-gray-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500" value={row.col1} onChange={(e) => {
                                    const newTable = [...(newProduct.measurementTable || [])];
                                    newTable[idx].col1 = e.target.value;
                                    setNewProduct({...newProduct, measurementTable: newTable});
                                  }} placeholder="..." /></td>
                                  
                                  <td className="p-1"><input type="text" inputMode="decimal" className="w-full text-base p-2 h-10 bg-white border border-gray-300 rounded text-center text-gray-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500" value={row.col2} onChange={(e) => {
                                    const newTable = [...(newProduct.measurementTable || [])];
                                    newTable[idx].col2 = e.target.value;
                                    setNewProduct({...newProduct, measurementTable: newTable});
                                  }} placeholder="..." /></td>
                                  
                                  <td className="p-1"><input type="text" inputMode="decimal" className="w-full text-base p-2 h-10 bg-white border border-gray-300 rounded text-center text-gray-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500" value={row.col3} onChange={(e) => {
                                    const newTable = [...(newProduct.measurementTable || [])];
                                    newTable[idx].col3 = e.target.value;
                                    setNewProduct({...newProduct, measurementTable: newTable});
                                  }} placeholder="..." /></td>
                                  
                                  <td className="p-1"><input type="text" inputMode="decimal" className="w-full text-base p-2 h-10 bg-white border border-gray-300 rounded text-center text-gray-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500" value={row.col4} onChange={(e) => {
                                    const newTable = [...(newProduct.measurementTable || [])];
                                    newTable[idx].col4 = e.target.value;
                                    setNewProduct({...newProduct, measurementTable: newTable});
                                  }} placeholder="..." /></td>
                                  
                                  <td className="p-1"><input type="text" inputMode="decimal" className="w-full text-base p-2 h-10 bg-white border border-gray-300 rounded text-center text-gray-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500" value={row.col5} onChange={(e) => {
                                    const newTable = [...(newProduct.measurementTable || [])];
                                    newTable[idx].col5 = e.target.value;
                                    setNewProduct({...newProduct, measurementTable: newTable});
                                  }} placeholder="..." /></td>
                                  
                                  <td className="p-1 text-center">
                                    <button type="button" onClick={() => {
                                      const newTable = [...(newProduct.measurementTable || [])];
                                      newTable.splice(idx, 1);
                                      setNewProduct({...newProduct, measurementTable: newTable});
                                    }} className="text-gray-400 hover:text-red-600 bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 flex justify-center items-center h-10 w-10 mx-auto rounded transition-colors shadow-sm">
                                      <X className="w-5 h-5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 border border-dashed border-gray-200 p-4 text-center rounded">
                          No measurement table added.
                        </p>
                      )}
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs uppercase text-gray-600 font-medium mb-1">Description</label>
                      <textarea required rows={3} className="w-full" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} placeholder="Describe the product details, fabric, and fit..." />
                    </div>
                  </div>
                  <button type="submit" className="btn-gold px-6 py-2 rounded font-bold uppercase text-sm mt-4 w-full md:w-auto">
                    {editingProductId ? 'Update Product' : 'Save Product to Web'}
                  </button>
                </form>
              </div>
            )}

            <div className="bg-white shadow-md border border-gray-200 rounded overflow-x-auto shadow-xl">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-black/50 text-xs uppercase tracking-widest text-gray-500">
                    <th className="p-4 w-24">Image</th>
                    <th className="p-4 font-normal">Product Details</th>
                    <th className="p-4 font-normal w-32">Price</th>
                    <th className="p-4 font-normal w-24 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-b border-gray-200/50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <img src={getDirectImageUrl(p.image)} alt={p.name} referrerPolicy="no-referrer" className="w-16 h-20 object-cover rounded bg-gray-100" />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900 text-md">{p.name}</p>
                          {p.tag && p.tag !== 'None' && (
                            <span className="text-[9px] bg-gold/20 text-gold uppercase px-1.5 py-0.5 rounded-sm tracking-wider font-bold">{p.tag}</span>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs mt-1 uppercase tracking-wide">{p.category}</p>
                        <p className="text-zinc-600 text-xs mt-2 line-clamp-1 max-w-sm">{p.description}</p>
                        <div className="flex gap-2 mt-2">
                          {p.sizes && p.sizes.length > 0 && <span className="text-[10px] bg-gray-100 text-zinc-300 px-2 py-0.5 rounded">Sizes: {p.sizes.join(', ')}</span>}
                          {p.colors && p.colors.length > 0 && <span className="text-[10px] bg-gray-100 text-zinc-300 px-2 py-0.5 rounded">Colors: {p.colors.join(', ')}</span>}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="gold-text font-bold">৳ {p.price.toLocaleString()}</div>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <div className="text-gray-500 line-through text-xs mt-1">৳ {p.originalPrice.toLocaleString()}</div>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEdit(p)} className="text-gray-500 hover:text-blue-500 transition-colors p-2 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 outline-none" title="Edit Product">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="text-gray-500 hover:text-red-500 transition-colors p-2 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 outline-none" title="Delete Product">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-500 uppercase tracking-widest">No products found in catalog</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-gray-50 border border-gray-200 p-6 max-w-sm w-full shadow-2xl relative">
            <h3 className="text-xl font-bold text-gray-900 mb-2 uppercase tracking-widest text-center">Confirm Delete</h3>
            <p className="text-gray-600 font-medium text-sm text-center mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2 border border-zinc-700 text-gray-900 font-bold uppercase text-xs tracking-widest hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deleteConfirmId)}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-bold uppercase text-xs tracking-widest hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
