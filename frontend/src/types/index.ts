export interface Stone {
  id: string;
  name: {
    en: string;
    fa: string;
  };
  category: {
    en: string;
    fa: string;
  };
  description: {
    en: string;
    fa: string;
  };
  images: string[];
  videos?: string[];
  finishes?: string[];
  thickness?: string[];
  applications?: string[];
  specifications?: Record<string, any>;
  technicalData: {
    density: string;
    porosity: string;
    compressiveStrength: string;
    flexuralStrength: string;
  };
  origin: string;
  price?: string;
}

export interface QuoteItem {
  stone: Stone;
  quantity: number;
  notes: string;
}

export interface RFQForm {
  name: string;
  email: string;
  company: string;
  phone: string;
  projectType: string;
  projectLocation: string;
  timeline: string;
  additionalNotes: string;
  items: QuoteItem[];
}

export interface CartItem {
  id?: number;
  stone: Stone;
  quantity: number;
  selectedFinish?: string;
  selectedThickness?: string;
  notes?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export type Language = 'en' | 'fa';