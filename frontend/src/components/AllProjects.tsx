import { ArrowLeft, Building, Calendar, ExternalLink, Grid, List, LogOut, MapPin, Mountain, Search, ShoppingCart, User, UserCircle } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../hooks/useCart';
import { useLanguage } from '../hooks/useLanguage';
import LanguageToggle from './LanguageToggle';

interface Project {
    id: number;
    title: {
        en: string;
        fa: string;
    };
    description: {
        en: string;
        fa: string;
    };
    location: {
        en: string;
        fa: string;
    };
    year: string;
    category: {
        en: string;
        fa: string;
    };
    stones: string[];
    image: string;
    gallery?: string[];
    video?: string;
    client?: {
        en: string;
        fa: string;
    };
    size?: {
        en: string;
        fa: string;
    };
    duration?: {
        en: string;
        fa: string;
    };
    challenges?: {
        en: string;
        fa: string;
    };
    solutions?: {
        en: string;
        fa: string;
    };
}

interface AllProjectsProps {
    onBack: () => void;
    onViewProject: (project: Project) => void;
    onCartClick?: () => void;
    onProfileClick?: () => void;
    onLoginClick?: () => void;
}

const AllProjects: React.FC<AllProjectsProps> = ({ onBack, onViewProject, onCartClick, onProfileClick, onLoginClick }) => {
    const { language } = useLanguage();
    const { user, logout } = useAuth();
    const { getCartItemsCount } = useCart();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedYear, setSelectedYear] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'title' | 'year' | 'category' | 'location'>('year');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleProfileClick = () => {
        setIsProfileDropdownOpen(false);
        if (user) {
            onProfileClick?.();
        } else {
            onLoginClick?.();
        }
    };

    const handleLogout = async () => {
        await logout();
        setIsProfileDropdownOpen(false);
    };

    const projects: Project[] = [
        {
            id: 1,
            title: {
                en: 'Luxury Hotel Tehran',
                fa: 'هتل لوکس تهران'
            },
            description: {
                en: 'Premium marble installation for 5-star hotel lobby and suites',
                fa: 'نصب مرمر ممتاز برای لابی و سوئیت‌های هتل ۵ ستاره'
            },
            location: {
                en: 'Tehran, Iran',
                fa: 'تهران، ایران'
            },
            year: '2024',
            category: {
                en: 'Hospitality',
                fa: 'هتلداری'
            },
            stones: ['Royal Onyx', 'Silver Marble'],
            image: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800',
            gallery: [
                'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800',
                'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
            client: {
                en: 'Tehran Grand Hotel Group',
                fa: 'گروه هتل‌های بزرگ تهران'
            },
            size: {
                en: '15,000 m²',
                fa: '۱۵,۰۰۰ متر مربع'
            },
            duration: {
                en: '18 months',
                fa: '۱۸ ماه'
            },
            challenges: {
                en: 'Large-scale marble installation in a busy hotel environment with strict timeline requirements and high-end finish standards.',
                fa: 'نصب مرمر در مقیاس بزرگ در محیط شلوغ هتل با الزامات زمانی سخت و استانداردهای پرداخت سطح بالا.'
            },
            solutions: {
                en: 'Implemented phased installation approach with specialized teams and premium quality control measures to ensure flawless execution.',
                fa: 'اجرای رویکرد نصب مرحله‌ای با تیم‌های تخصصی و اقدامات کنترل کیفیت ممتاز برای اطمینان از اجرای بی‌نقص.'
            }
        },
        {
            id: 2,
            title: {
                en: 'Modern Villa Dubai',
                fa: 'ویلای مدرن دبی'
            },
            description: {
                en: 'Travertine flooring and wall cladding for luxury residential project',
                fa: 'کفپوش و نمای تراورتن برای پروژه مسکونی لوکس'
            },
            location: {
                en: 'Dubai, UAE',
                fa: 'دبی، امارات'
            },
            year: '2023',
            category: {
                en: 'Residential',
                fa: 'مسکونی'
            },
            stones: ['Persian Travertine'],
            image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
            id: 3,
            title: {
                en: 'Corporate Headquarters',
                fa: 'دفتر مرکزی شرکت'
            },
            description: {
                en: 'Elegant stone facade and interior design for multinational company',
                fa: 'نمای سنگی زیبا و طراحی داخلی برای شرکت چندملیتی'
            },
            location: {
                en: 'Istanbul, Turkey',
                fa: 'استانبول، ترکیه'
            },
            year: '2023',
            category: {
                en: 'Commercial',
                fa: 'تجاری'
            },
            stones: ['Silver Marble', 'Royal Onyx'],
            image: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=800',
            gallery: [
                'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=800',
                'https://images.pexels.com/photos/2467558/pexels-photo-2467558.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            client: {
                en: 'Global Tech Solutions',
                fa: 'راه‌حل‌های فناوری جهانی'
            },
            size: {
                en: '8,500 m²',
                fa: '۸,۵۰۰ متر مربع'
            },
            duration: {
                en: '12 months',
                fa: '۱۲ ماه'
            }
        },
        {
            id: 4,
            title: {
                en: 'Shopping Mall Complex',
                fa: 'مجتمع تجاری'
            },
            description: {
                en: 'Large-scale stone installation for premium shopping destination',
                fa: 'نصب سنگ در مقیاس بزرگ برای مرکز خرید ممتاز'
            },
            location: {
                en: 'Doha, Qatar',
                fa: 'دوحه، قطر'
            },
            year: '2022',
            category: {
                en: 'Retail',
                fa: 'خرده‌فروشی'
            },
            stones: ['Persian Travertine', 'Silver Marble'],
            image: 'https://images.pexels.com/photos/2467558/pexels-photo-2467558.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
            id: 5,
            title: {
                en: 'Cultural Center',
                fa: 'مرکز فرهنگی'
            },
            description: {
                en: 'Artistic stone work for modern cultural and exhibition space',
                fa: 'کار سنگی هنری برای فضای فرهنگی و نمایشگاهی مدرن'
            },
            location: {
                en: 'Shiraz, Iran',
                fa: 'شیراز، ایران'
            },
            year: '2024',
            category: {
                en: 'Cultural',
                fa: 'فرهنگی'
            },
            stones: ['Royal Onyx', 'Persian Travertine'],
            image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
            id: 6,
            title: {
                en: 'Luxury Resort',
                fa: 'منتجع لوکس'
            },
            description: {
                en: 'Premium stone finishes for exclusive beachfront resort',
                fa: 'پرداخت‌های سنگی ممتاز برای منتجع ساحلی انحصاری'
            },
            location: {
                en: 'Antalya, Turkey',
                fa: 'آنتالیا، ترکیه'
            },
            year: '2023',
            category: {
                en: 'Hospitality',
                fa: 'هتلداری'
            },
            stones: ['Silver Marble', 'Persian Travertine'],
            image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800'
        }
    ];

    // Get unique categories and years
    const categories = useMemo(() => {
        const uniqueCategories = Array.from(new Set(projects.map(project => project.category[language])));
        return uniqueCategories;
    }, [language]);

    const years = useMemo(() => {
        const uniqueYears = Array.from(new Set(projects.map(project => project.year))).sort((a, b) => b.localeCompare(a));
        return uniqueYears;
    }, []);

    // Filter and sort projects
    const filteredAndSortedProjects = useMemo(() => {
        let filtered = projects.filter(project => {
            const matchesSearch = project.title[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.location[language].toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || project.category[language] === selectedCategory;
            const matchesYear = selectedYear === 'all' || project.year === selectedYear;
            return matchesSearch && matchesCategory && matchesYear;
        });

        // Sort projects
        filtered.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'title':
                    comparison = a.title[language].localeCompare(b.title[language]);
                    break;
                case 'year':
                    comparison = a.year.localeCompare(b.year);
                    break;
                case 'category':
                    comparison = a.category[language].localeCompare(b.category[language]);
                    break;
                case 'location':
                    comparison = a.location[language].localeCompare(b.location[language]);
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [searchTerm, selectedCategory, selectedYear, sortBy, sortOrder, language]);

    return (
        <div className="min-h-screen bg-white">
            {/* Custom Header */}
            <header className="bg-warm-50/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-warm-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        {/* Left side - Back Button and Logo */}
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <button
                                onClick={onBack}
                                className="flex items-center space-x-2 text-stone-600 hover:text-stone-800 transition-colors rtl:space-x-reverse"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="font-persian">
                                    {language === 'fa' ? 'بازگشت به صفحه اصلی' : 'Back to Home'}
                                </span>
                            </button>

                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                <div className="bg-stone-800 p-2 rounded-lg">
                                    <Mountain className="w-6 h-6 text-warm-50" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-stone-800 font-persian">
                                        {language === 'fa' ? 'سنگ مدوسا' : 'Medusa Stone'}
                                    </h1>
                                    <p className="text-xs text-stone-600 font-persian">
                                        {language === 'fa' ? 'کیفیت برتر زندگی' : 'A Higher Quality of Living'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Center - All Projects Title */}
                        <div className="flex-1 text-center">
                            <h1 className="text-2xl md:text-3xl font-bold text-stone-800 font-persian">
                                {language === 'fa' ? 'همه پروژه‌ها' : 'All Projects'}
                            </h1>
                        </div>

                        {/* Right side - Language toggle, Profile, Cart and CTA */}
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <LanguageToggle />

                            {/* Profile Icon */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="relative p-2 text-stone-600 hover:text-stone-800 transition-colors bg-white rounded-lg shadow-sm hover:shadow-md"
                                >
                                    {user ? (
                                        <UserCircle className="w-6 h-6" />
                                    ) : (
                                        <User className="w-6 h-6" />
                                    )}
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-stone-200 py-2 z-50">
                                        {user ? (
                                            <>
                                                <div className="px-4 py-2 border-b border-stone-100">
                                                    <p className="text-sm font-medium text-stone-800 font-persian">
                                                        {user.name || user.email}
                                                    </p>
                                                    <p className="text-xs text-stone-500">{user.email}</p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleProfileClick();
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                                                >
                                                    <UserCircle className="w-4 h-4" />
                                                    <span className="font-persian">
                                                        {language === 'fa' ? 'پروفایل' : 'Profile'}
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span className="font-persian">
                                                        {language === 'fa' ? 'خروج' : 'Logout'}
                                                    </span>
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={handleProfileClick}
                                                className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                                            >
                                                <User className="w-4 h-4" />
                                                <span className="font-persian">
                                                    {language === 'fa' ? 'ورود / ثبت نام' : 'Login / Register'}
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={onCartClick || (() => { })}
                                className="relative p-2 text-stone-600 hover:text-stone-800 transition-colors bg-white rounded-lg shadow-sm hover:shadow-md"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                {getCartItemsCount() > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">
                                        {getCartItemsCount()}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Filters and Search */}
            <div className="bg-stone-50 py-6 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5 rtl:left-auto rtl:right-3" />
                            <input
                                type="text"
                                placeholder={language === 'fa' ? 'جستجو در پروژه‌ها...' : 'Search projects...'}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent rtl:pl-4 rtl:pr-10"
                                dir={language === 'fa' ? 'rtl' : 'ltr'}
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent font-persian"
                        >
                            <option value="all">
                                {language === 'fa' ? 'همه دسته‌ها' : 'All Categories'}
                            </option>
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>

                        {/* Year Filter */}
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent font-persian"
                        >
                            <option value="all">
                                {language === 'fa' ? 'همه سال‌ها' : 'All Years'}
                            </option>
                            {years.map(year => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>

                        {/* Sort */}
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <span className="text-stone-600 font-persian">
                                {language === 'fa' ? 'مرتب‌سازی:' : 'Sort by:'}
                            </span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'title' | 'year' | 'category' | 'location')}
                                className="px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                            >
                                <option value="title">
                                    {language === 'fa' ? 'عنوان' : 'Title'}
                                </option>
                                <option value="year">
                                    {language === 'fa' ? 'سال' : 'Year'}
                                </option>
                                <option value="category">
                                    {language === 'fa' ? 'دسته‌بندی' : 'Category'}
                                </option>
                                <option value="location">
                                    {language === 'fa' ? 'مکان' : 'Location'}
                                </option>
                            </select>
                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="px-3 py-2 border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors"
                                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                            >
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </button>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-stone-800 text-white' : 'bg-white text-stone-600 hover:bg-stone-100'
                                    }`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-stone-800 text-white' : 'bg-white text-stone-600 hover:bg-stone-100'
                                    }`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className="bg-white py-4 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-stone-600 font-persian">
                        {language === 'fa'
                            ? `نمایش ${filteredAndSortedProjects.length} از ${projects.length} پروژه`
                            : `Showing ${filteredAndSortedProjects.length} of ${projects.length} projects`
                        }
                    </p>
                </div>
            </div>

            {/* Projects Grid/List */}
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredAndSortedProjects.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-stone-400 mb-4">
                                <Search className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold text-stone-600 mb-2 font-persian">
                                {language === 'fa' ? 'پروژه‌ای یافت نشد' : 'No projects found'}
                            </h3>
                            <p className="text-stone-500 font-persian">
                                {language === 'fa'
                                    ? 'لطفاً کلمات کلیدی جستجو یا فیلترها را تغییر دهید'
                                    : 'Try adjusting your search terms or filters'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                                : 'space-y-6'
                        }>
                            {filteredAndSortedProjects.map((project) => (
                                <div
                                    key={project.id}
                                    className={`bg-white rounded-4xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group transform hover:-translate-y-2 ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
                                        }`}
                                >
                                    {/* Project Image */}
                                    <div className={`relative overflow-hidden ${viewMode === 'list'
                                        ? 'w-full md:w-80 h-48 md:h-auto'
                                        : 'aspect-[4/3]'
                                        }`}>
                                        <img
                                            src={project.image}
                                            alt={project.title[language]}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                        {/* Category Badge */}
                                        <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-stone-800">
                                            {project.category[language]}
                                        </div>

                                        {/* Year Badge */}
                                        <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-stone-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-white">
                                            {project.year}
                                        </div>
                                    </div>

                                    {/* Project Details */}
                                    <div className={`p-6 space-y-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-bold text-stone-800 font-persian">
                                                {project.title[language]}
                                            </h3>
                                            <p className={`text-stone-600 text-sm font-persian ${viewMode === 'list' ? '' : 'line-clamp-2'
                                                }`}>
                                                {project.description[language]}
                                            </p>
                                        </div>

                                        {/* Project Meta */}
                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm text-stone-500">
                                                <MapPin className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                                                <span className="font-persian">{project.location[language]}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-stone-500">
                                                <Calendar className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                                                <span className="font-persian">{project.year}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-stone-500">
                                                <Building className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                                                <span className="font-persian">{project.category[language]}</span>
                                            </div>
                                        </div>

                                        {/* Stones Used */}
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-semibold text-stone-700 font-persian">
                                                {language === 'fa' ? 'سنگ‌های استفاده شده:' : 'Stones Used:'}
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {project.stones.map((stone, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-warm-100 text-stone-700 px-3 py-1 rounded-full text-xs font-medium"
                                                    >
                                                        {stone}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* View Project Button */}
                                        <div className="pt-4">
                                            <button
                                                onClick={() => onViewProject(project)}
                                                className="w-full bg-stone-800 text-white py-3 rounded-2xl hover:bg-stone-700 transition-all duration-300 font-semibold font-persian transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 rtl:space-x-reverse"
                                            >
                                                <span>{language === 'fa' ? 'مشاهده پروژه' : 'View Project'}</span>
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllProjects;
