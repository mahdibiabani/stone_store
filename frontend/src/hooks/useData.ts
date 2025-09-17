import { useState, useEffect } from 'react';
import { stones } from '../data/stones';
import { Stone } from '../types';

// Mock projects data - you can move this to a separate file later
const projects = [
  {
    id: 1,
    title: {
      en: 'Luxury Hotel Lobby',
      fa: 'لابی هتل لوکس'
    },
    description: {
      en: 'A stunning lobby design featuring premium stone materials and modern architecture.',
      fa: 'طراحی لابی خیره‌کننده با استفاده از مصالح سنگی ممتاز و معماری مدرن.'
    },
    location: {
      en: 'Tehran, Iran',
      fa: 'تهران، ایران'
    },
    year: '2023',
    category: {
      en: 'Commercial',
      fa: 'تجاری'
    },
    stones: ['Royal Onyx', 'Silver Marble'],
    image: 'https://images.pexels.com/photos/6207358/pexels-photo-6207358.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/6207358/pexels-photo-6207358.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7764983/pexels-photo-7764983.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    client: {
      en: 'Grand Hotel Group',
      fa: 'گروه هتل گرند'
    },
    size: {
      en: '500 sqm',
      fa: '۵۰۰ متر مربع'
    },
    duration: {
      en: '6 months',
      fa: '۶ ماه'
    }
  },
  {
    id: 2,
    title: {
      en: 'Modern Office Building',
      fa: 'ساختمان اداری مدرن'
    },
    description: {
      en: 'Contemporary office design with sustainable stone materials and innovative architecture.',
      fa: 'طراحی اداری معاصر با مصالح سنگی پایدار و معماری نوآورانه.'
    },
    location: {
      en: 'Isfahan, Iran',
      fa: 'اصفهان، ایران'
    },
    year: '2022',
    category: {
      en: 'Commercial',
      fa: 'تجاری'
    },
    stones: ['Persian Travertine', 'Silver Marble'],
    image: 'https://images.pexels.com/photos/6207329/pexels-photo-6207329.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery: [
      'https://images.pexels.com/photos/6207329/pexels-photo-6207329.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7768197/pexels-photo-7768197.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    client: {
      en: 'Tech Solutions Inc.',
      fa: 'شرکت راه‌حل‌های فناوری'
    },
    size: {
      en: '1200 sqm',
      fa: '۱۲۰۰ متر مربع'
    },
    duration: {
      en: '8 months',
      fa: '۸ ماه'
    }
  }
];

export interface Project {
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

export const useStone = (id: string) => {
  const [stone, setStone] = useState<Stone | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundStone = stones.find(s => s.id === id);
    setStone(foundStone || null);
    setLoading(false);
  }, [id]);

  return { stone, loading };
};

export const useProject = (id: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundProject = projects.find(p => p.id.toString() === id);
    setProject(foundProject || null);
    setLoading(false);
  }, [id]);

  return { project, loading };
};

export const getAllStones = () => stones;
export const getAllProjects = () => projects;
