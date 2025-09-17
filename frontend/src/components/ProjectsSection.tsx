import { Building, Calendar, ExternalLink, MapPin } from 'lucide-react';
import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface ProjectsSectionProps {
  onViewAllProjects: () => void;
  onViewProject: (project: any) => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onViewAllProjects, onViewProject }) => {
  const { language } = useLanguage();

  const projects = [
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
      image: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800'
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
      image: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=800'
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
    }
  ];

  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-white to-warm-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-stone-800 font-persian">
            {language === 'fa' ? 'پروژه‌های ما' : 'Our Projects'}
          </h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto font-persian">
            {language === 'fa'
              ? 'نمونه‌ای از پروژه‌های موفق ما در سراسر جهان با استفاده از بهترین سنگ‌های طبیعی ایران'
              : 'Showcase of our successful projects worldwide using the finest Iranian natural stones'
            }
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-4xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group transform hover:-translate-y-2">
              {/* Project Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
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
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-stone-800 font-persian">
                    {project.title[language]}
                  </h3>
                  <p className="text-stone-600 text-sm line-clamp-2 font-persian">
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

        {/* View All Projects Button */}
        <div className="text-center mt-12">
          <button
            onClick={onViewAllProjects}
            className="inline-flex items-center px-8 py-4 bg-stone-800 text-white rounded-2xl hover:bg-stone-700 transition-all duration-300 font-semibold text-lg group transform hover:-translate-y-1 shadow-lg hover:shadow-xl font-persian"
          >
            {language === 'fa' ? 'مشاهده همه پروژه‌ها' : 'View All Projects'}
            <ExternalLink className="ml-2 rtl:ml-0 rtl:mr-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;