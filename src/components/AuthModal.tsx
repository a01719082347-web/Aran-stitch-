import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LogIn, Mail, Lock, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, loginWithEmail, registerWithEmail } = useAuth();
  const { lang } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await login();
      onClose();
    } catch (e: any) {
      if (e.code === 'auth/popup-closed-by-user') {
        // User closed the popup, don't show an error
        return;
      }
      setError(e.message || 'Authentication failed');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(name, email, password);
      }
      onClose();
      setEmail('');
      setPassword('');
      setName('');
    } catch (e: any) {
      console.error(e);
      let errorMsg = e.message || 'Authentication failed';
      if (e.code === 'auth/email-already-in-use') errorMsg = lang === 'bn' ? 'এই ইমেইলটি আগে থেকেই ব্যবহৃত হচ্ছে।' : 'This email is already in use.';
      else if (e.code === 'auth/invalid-credential') errorMsg = lang === 'bn' ? 'ইমেইল বা পাসওয়ার্ড ভুল।' : 'Invalid email or password.';
      else if (e.code === 'auth/weak-password') errorMsg = lang === 'bn' ? 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।' : 'Password must be at least 6 characters.';
      else if (e.code === 'auth/operation-not-allowed') errorMsg = lang === 'bn' ? 'Email/Password লগইন Firebase এ বন্ধ আছে। দয়া করে Firebase Console থেকে Email/Password Auth চালু করুন।' : 'Email/Password login is not enabled in Firebase project.';
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="bg-white border border-gray-200 p-8 rounded-lg max-w-sm w-full shadow-2xl relative my-8"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-1.5 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4 mt-2">
              <h2 className="text-xl font-serif font-black uppercase text-zinc-900 tracking-widest">
                ARAN STITCH
              </h2>
            </div>

            {/* Premium Tab Segmented Switcher */}
            <div className="flex bg-zinc-100 p-1 rounded-full mb-6 relative">
              <button
                type="button"
                onClick={() => { setIsLogin(true); setError(''); }}
                className={`flex-1 text-center py-2 text-xs uppercase tracking-wider font-extrabold rounded-full transition-all duration-300 ${
                  isLogin 
                    ? 'bg-yellow-400 text-black shadow-sm scale-[1.02]' 
                    : 'text-gray-500 hover:text-zinc-900'
                }`}
              >
                {lang === 'bn' ? 'লগইন করুন' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => { setIsLogin(false); setError(''); }}
                className={`flex-1 text-center py-2 text-xs uppercase tracking-wider font-extrabold rounded-full transition-all duration-300 ${
                  !isLogin 
                    ? 'bg-yellow-400 text-black shadow-sm scale-[1.02]' 
                    : 'text-gray-500 hover:text-zinc-900'
                }`}
              >
                {lang === 'bn' ? 'নিবন্ধন করুন' : 'Register'}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 font-medium text-xs p-3.5 rounded-lg mb-4 text-center animate-shake leading-snug">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              {!isLogin && (
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">{lang === 'bn' ? 'নাম' : 'Name'}</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      required 
                      type="text" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder={lang === 'bn' ? 'আপনার নাম' : 'Your name'} 
                      style={{ paddingLeft: '2.5rem' }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-md py-2 pr-3 text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors text-sm" 
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-xs uppercase font-bold text-gray-700 mb-1">{lang === 'bn' ? 'ইমেইল' : 'Email'}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    required 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="example@email.com" 
                    style={{ paddingLeft: '2.5rem' }}
                    className="w-full bg-gray-50 border border-gray-200 rounded-md py-2 pr-3 text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors text-sm" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs uppercase font-bold text-gray-700 mb-1">{lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    required 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    style={{ paddingLeft: '2.5rem' }}
                    className="w-full bg-gray-50 border border-gray-200 rounded-md py-2 pr-3 text-gray-900 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors text-sm" 
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 text-black py-2.5 rounded font-bold transition-colors hover:bg-yellow-500 disabled:opacity-50 mt-2 text-sm uppercase tracking-wider shadow-sm"
              >
                {loading ? '...' : (isLogin 
                  ? (lang === 'bn' ? 'লগইন করুন' : 'Login') 
                  : (lang === 'bn' ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Account'))}
              </button>
            </form>

            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative px-4 bg-white text-xs text-gray-500 uppercase">
                {lang === 'bn' ? 'অথবা' : 'OR'}
              </div>
            </div>

            <div className="py-2">
              <button 
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-white border border-gray-200 text-gray-900 py-2.5 rounded font-bold transition-all flex items-center justify-center gap-3 transform active:scale-[0.98] hover:bg-gray-50 hover:border-gray-300 text-sm shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {lang === 'bn' ? 'গুগল দিয়ে চালিয়ে যান' : 'Continue with Google'}
              </button>
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              {isLogin ? (
                <>
                  {lang === 'bn' ? 'অ্যাকাউন্ট নেই? ' : "Don't have an account? "}
                  <button type="button" onClick={() => setIsLogin(false)} className="text-yellow-600 font-bold hover:underline">
                    {lang === 'bn' ? 'সাইন আপ করুন' : 'Sign Up'}
                  </button>
                </>
              ) : (
                <>
                  {lang === 'bn' ? 'আগে থেকে অ্যাকাউন্ট আছে? ' : "Already have an account? "}
                  <button type="button" onClick={() => setIsLogin(true)} className="text-yellow-600 font-bold hover:underline">
                    {lang === 'bn' ? 'লগইন করুন' : 'Login'}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
