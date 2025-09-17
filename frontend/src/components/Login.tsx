import { Eye, EyeOff, Lock, Mail, User, X } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { translations } from '../data/translations';
import { useLanguage } from '../hooks/useLanguage';

interface LoginProps {
    onClose: () => void;
    onSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose, onSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { login, register } = useAuth();
    const { language } = useLanguage();
    const t = translations[language];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            let result;
            if (isLogin) {
                result = await login(email, password);
            } else {
                if (!name.trim()) {
                    setError(language === 'fa' ? 'نام الزامی است' : 'Name is required');
                    setLoading(false);
                    return;
                }
                result = await register(email, password, name);
            }

            if (result.success) {
                setSuccess(
                    isLogin
                        ? (language === 'fa' ? 'با موفقیت وارد شدید' : 'Successfully logged in')
                        : (language === 'fa' ? 'حساب کاربری با موفقیت ایجاد شد' : 'Account created successfully')
                );
                setTimeout(() => {
                    onSuccess?.();
                    onClose();
                }, 1500);
            } else {
                setError(result.error || (language === 'fa' ? 'خطایی رخ داد' : 'An error occurred'));
            }
        } catch (error) {
            setError(language === 'fa' ? 'خطایی رخ داد' : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setName('');
        setError('');
        setSuccess('');
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        resetForm();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-stone-200">
                    <h2 className="text-2xl font-bold text-stone-800 font-persian">
                        {isLogin
                            ? (language === 'fa' ? 'ورود' : 'Login')
                            : (language === 'fa' ? 'ثبت نام' : 'Register')
                        }
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-stone-400 hover:text-stone-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Test Mode Indicator */}
                {(import.meta.env.MODE === 'development' || import.meta.env.VITE_SUPABASE_URL === 'https://your-project.supabase.co') && (
                    <div className="mx-6 mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700 font-persian">
                            <strong>{language === 'fa' ? 'حالت تست:' : 'Test Mode:'}</strong> {language === 'fa' ? 'هر ایمیل و رمز عبوری کار می‌کند' : 'Any email and password will work'}
                        </p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2 font-persian">
                                {language === 'fa' ? 'نام' : 'Name'}
                            </label>
                            <div className="relative">
                                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-4 pr-12 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all font-persian"
                                    placeholder={language === 'fa' ? 'نام خود را وارد کنید' : 'Enter your name'}
                                    required={!isLogin}
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2 font-persian">
                            {language === 'fa' ? 'ایمیل' : 'Email'}
                        </label>
                        <div className="relative">
                            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-4 pr-12 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all"
                                placeholder={language === 'fa' ? 'ایمیل خود را وارد کنید' : 'Enter your email'}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2 font-persian">
                            {language === 'fa' ? 'رمز عبور' : 'Password'}
                        </label>
                        <div className="relative">
                            <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-4 pr-20 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all"
                                placeholder={language === 'fa' ? 'رمز عبور خود را وارد کنید' : 'Enter your password'}
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-persian">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-persian">
                            {success}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-stone-800 text-white py-3 px-4 rounded-lg hover:bg-stone-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed font-persian"
                    >
                        {loading
                            ? (language === 'fa' ? 'در حال پردازش...' : 'Processing...')
                            : (isLogin
                                ? (language === 'fa' ? 'ورود' : 'Login')
                                : (language === 'fa' ? 'ثبت نام' : 'Register')
                            )
                        }
                    </button>

                    {/* Toggle Mode */}
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="text-stone-600 hover:text-stone-800 transition-colors text-sm font-persian"
                        >
                            {isLogin
                                ? (language === 'fa' ? 'حساب کاربری ندارید؟ ثبت نام کنید' : "Don't have an account? Register")
                                : (language === 'fa' ? 'حساب کاربری دارید؟ وارد شوید' : 'Already have an account? Login')
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
