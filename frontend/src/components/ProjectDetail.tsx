import { ArrowLeft, Building, Calendar, ExternalLink, MapPin, Play, X } from 'lucide-react';
import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import Header from './Header';

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

interface ProjectDetailProps {
    project: Project;
    onBack: () => void;
    onCartClick?: () => void;
    onProfileClick?: () => void;
    onLoginClick?: () => void;
    onHomeClick?: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, onCartClick, onProfileClick, onLoginClick, onHomeClick }) => {
    const { language } = useLanguage();
    const [selectedImage, setSelectedImage] = useState(0);
    const [showVideo, setShowVideo] = useState(false);

    // Create gallery with main image and additional images if available
    const gallery = project.gallery ? [project.image, ...project.gallery] : [project.image];

    return (
        <div className="min-h-screen bg-neutral-50">
            <Header
                onCartClick={onCartClick || (() => { })}
                onProfileClick={onProfileClick}
                onLoginClick={onLoginClick}
                onHomeClick={onHomeClick}
            />
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <button
                        onClick={onBack}
                        className="inline-flex items-center text-stone-600 hover:text-stone-800 mb-8 transition-colors font-persian"
                    >
                        {language === 'fa' ? (
                            <ArrowLeft className="w-5 h-5 ml-2" />
                        ) : (
                            <ArrowLeft className="w-5 h-5 mr-2" />
                        )}
                        {language === 'fa' ? 'بازگشت به پروژه‌ها' : 'Back to Projects'}
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Images Section */}
                        <div className="space-y-6">
                            {/* Main Image */}
                            <div className="relative aspect-[4/3] bg-white rounded-4xl overflow-hidden shadow-lg">
                                <img
                                    src={gallery[selectedImage]}
                                    alt={project.title[language]}
                                    className="w-full h-full object-cover"
                                />
                                {project.video && (
                                    <button
                                        onClick={() => setShowVideo(true)}
                                        className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all shadow-lg"
                                    >
                                        <Play className="w-6 h-6 text-stone-700" />
                                    </button>
                                )}
                            </div>

                            {/* Thumbnail Images */}
                            {gallery.length > 1 && (
                                <div className="flex space-x-4 rtl:space-x-reverse overflow-x-auto">
                                    {gallery.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${selectedImage === index
                                                ? 'border-stone-600 shadow-lg'
                                                : 'border-transparent hover:border-stone-300'
                                                }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${project.title[language]} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Project Info Section */}
                        <div className="space-y-8">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                    <div className="bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-sm font-medium">
                                        {project.category[language]}
                                    </div>
                                    <div className="bg-stone-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {project.year}
                                    </div>
                                </div>

                                <h1 className="text-4xl font-bold text-stone-800 font-persian">
                                    {project.title[language]}
                                </h1>

                                <p className="text-xl text-stone-600 font-persian">
                                    {project.description[language]}
                                </p>
                            </div>

                            {/* Project Meta */}
                            <div className="bg-white rounded-4xl p-6 shadow-lg">
                                <h3 className="text-lg font-semibold text-stone-800 mb-4 font-persian">
                                    {language === 'fa' ? 'اطلاعات پروژه' : 'Project Information'}
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center text-stone-600">
                                        <MapPin className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3" />
                                        <span className="font-persian">
                                            <strong>{language === 'fa' ? 'مکان:' : 'Location:'}</strong> {project.location[language]}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-stone-600">
                                        <Calendar className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3" />
                                        <span className="font-persian">
                                            <strong>{language === 'fa' ? 'سال:' : 'Year:'}</strong> {project.year}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-stone-600">
                                        <Building className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3" />
                                        <span className="font-persian">
                                            <strong>{language === 'fa' ? 'دسته‌بندی:' : 'Category:'}</strong> {project.category[language]}
                                        </span>
                                    </div>
                                    {project.client && (
                                        <div className="flex items-center text-stone-600">
                                            <ExternalLink className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3" />
                                            <span className="font-persian">
                                                <strong>{language === 'fa' ? 'مشتری:' : 'Client:'}</strong> {project.client[language]}
                                            </span>
                                        </div>
                                    )}
                                    {project.size && (
                                        <div className="flex items-center text-stone-600">
                                            <Building className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3" />
                                            <span className="font-persian">
                                                <strong>{language === 'fa' ? 'اندازه:' : 'Size:'}</strong> {project.size[language]}
                                            </span>
                                        </div>
                                    )}
                                    {project.duration && (
                                        <div className="flex items-center text-stone-600">
                                            <Calendar className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3" />
                                            <span className="font-persian">
                                                <strong>{language === 'fa' ? 'مدت زمان:' : 'Duration:'}</strong> {project.duration[language]}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Stones Used */}
                            <div className="bg-white rounded-4xl p-6 shadow-lg">
                                <h3 className="text-lg font-semibold text-stone-800 mb-4 font-persian">
                                    {language === 'fa' ? 'سنگ‌های استفاده شده' : 'Stones Used'}
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {project.stones.map((stone, index) => (
                                        <span
                                            key={index}
                                            className="bg-warm-100 text-stone-700 px-4 py-2 rounded-full text-sm font-medium"
                                        >
                                            {stone}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Project Challenges & Solutions */}
                            {(project.challenges || project.solutions) && (
                                <div className="space-y-6">
                                    {project.challenges && (
                                        <div className="bg-white rounded-4xl p-6 shadow-lg">
                                            <h3 className="text-lg font-semibold text-stone-800 mb-4 font-persian">
                                                {language === 'fa' ? 'چالش‌ها' : 'Challenges'}
                                            </h3>
                                            <p className="text-stone-600 leading-relaxed font-persian">
                                                {project.challenges[language]}
                                            </p>
                                        </div>
                                    )}

                                    {project.solutions && (
                                        <div className="bg-white rounded-4xl p-6 shadow-lg">
                                            <h3 className="text-lg font-semibold text-stone-800 mb-4 font-persian">
                                                {language === 'fa' ? 'راه‌حل‌ها' : 'Solutions'}
                                            </h3>
                                            <p className="text-stone-600 leading-relaxed font-persian">
                                                {project.solutions[language]}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Contact Button */}
                            <div className="pt-4">
                                <button className="w-full bg-stone-800 text-white py-4 rounded-2xl hover:bg-stone-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 rtl:space-x-reverse transform hover:-translate-y-1 font-persian">
                                    <span>{language === 'fa' ? 'درخواست پروژه مشابه' : 'Request Similar Project'}</span>
                                    <ExternalLink className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Video Modal */}
                    {showVideo && project.video && (
                        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                            <div className="relative bg-white rounded-4xl overflow-hidden max-w-4xl w-full">
                                <button
                                    onClick={() => setShowVideo(false)}
                                    className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all z-10"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                <video
                                    src={project.video}
                                    controls
                                    autoPlay
                                    className="w-full aspect-video"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;
