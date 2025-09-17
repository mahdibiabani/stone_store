import React, { useState } from 'react';
import { Send, User, Mail, Building, Phone, Calendar, MapPin, FileText } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';
import { api } from '../services/api';

const QuoteSection: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    projectType: '',
    projectLocation: '',
    timeline: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.quotes.submit({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
        project_type: formData.projectType,
        project_location: formData.projectLocation,
        timeline: formData.timeline,
        notes: formData.notes
      });

      setSuccess(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        projectType: '',
        projectLocation: '',
        timeline: '',
        notes: ''
      });

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting quote:', error);
      alert(language === 'fa' ? 'خطا در ارسال درخواست' : 'Error submitting quote request');
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { name: 'name', label: t.quote.name, type: 'text', icon: User, required: true },
    { name: 'email', label: t.quote.email, type: 'email', icon: Mail, required: true },
    { name: 'company', label: t.quote.company, type: 'text', icon: Building, required: true },
    { name: 'phone', label: t.quote.phone, type: 'tel', icon: Phone, required: false },
    { name: 'projectType', label: t.quote.projectType, type: 'text', icon: FileText, required: true },
    { name: 'projectLocation', label: t.quote.projectLocation, type: 'text', icon: MapPin, required: true },
    { name: 'timeline', label: t.quote.timeline, type: 'text', icon: Calendar, required: false }
  ];

  return (
    <section id="quote" className="py-20 bg-gradient-to-br from-warm-100 to-warm-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-stone-800 font-persian">
            {t.quote.title}
          </h2>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto font-persian">
            {language === 'fa' 
              ? 'فرم زیر را پر کنید تا متخصصان ما در اسرع وقت با شما تماس بگیرند'
              : 'Fill out the form below and our experts will contact you shortly with a customized quote'
            }
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-5xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inputFields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className="block text-sm font-semibold text-stone-700 font-persian">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <field.icon className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-500" />
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={handleInputChange}
                        required={field.required}
                        className="w-full pl-12 rtl:pl-4 rtl:pr-12 pr-4 py-4 border border-warm-200 rounded-2xl focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all duration-300 font-persian"
                        placeholder={field.label}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-stone-700 font-persian">
                  {t.quote.notes}
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-4 border border-warm-200 rounded-2xl focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all duration-300 resize-none font-persian"
                  placeholder={t.quote.notes}
                />
              </div>

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl text-center font-persian">
                  {language === 'fa' ? 'درخواست شما با موفقیت ارسال شد!' : 'Your quote request has been submitted successfully!'}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-stone-800 text-white py-4 rounded-2xl hover:bg-stone-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl group flex items-center justify-center transform hover:-translate-y-1 font-persian disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="mr-2 rtl:mr-0 rtl:ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  {loading 
                    ? (language === 'fa' ? 'در حال ارسال...' : 'Submitting...')
                    : t.quote.submit
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;