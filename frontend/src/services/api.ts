// API Service for Stone Store
const API_BASE_URL = 'http://localhost:8000/api';

// Types for API responses
export interface ApiStone {
  id: number;
  name_en: string;
  name_fa: string;
  description_en: string;
  description_fa: string;
  category: {
    id: number;
    name_en: string;
    name_fa: string;
    slug: string;
  };
  price?: string;
  origin?: string;
  images: Array<{
    id: number;
    image: string;
    alt_text?: string;
  }>;
  videos?: Array<{
    id: number;
    video: string;
    thumbnail?: string;
  }>;
  finishes: string[];
  thickness_options: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiProject {
  id: number;
  title_en: string;
  title_fa: string;
  description_en: string;
  description_fa: string;
  location_en: string;
  location_fa: string;
  category_en: string;
  category_fa: string;
  year: string;
  client_en?: string;
  client_fa?: string;
  size_en?: string;
  size_fa?: string;
  duration_en?: string;
  duration_fa?: string;
  challenges_en?: string;
  challenges_fa?: string;
  solutions_en?: string;
  solutions_fa?: string;
  images: Array<{
    id: number;
    image: string;
    alt_text?: string;
  }>;
  videos?: Array<{
    id: number;
    video: string;
    thumbnail?: string;
  }>;
  project_stones: Array<{
    stone: ApiStone;
    quantity_used?: string;
    area_covered?: string;
  }>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  date_joined: string;
}

export interface ApiCartItem {
  id: number;
  stone: ApiStone;
  quantity: number;
  selected_finish: string;
  selected_thickness: string;
  notes: string;
}

export interface ApiCart {
  id: number;
  items: ApiCartItem[];
  total_amount: string;
  created_at: string;
  updated_at: string;
}

export interface ApiOrder {
  id: number;
  order_number: string;
  tracking_code?: string;
  total_amount: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'completed' | 'failed' | 'cancelled';
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_phone: string;
  payment_id?: string;
  payment_date?: string;
  items: Array<{
    id: number;
    stone: ApiStone;
    quantity: number;
    price: string;
    selected_finish: string;
    selected_thickness: string;
    notes: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface ApiQuote {
  id: number;
  user?: number;
  name: string;
  email: string;
  company: string;
  phone?: string;
  project_type: string;
  project_location: string;
  timeline?: string;
  additional_notes?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  items?: Array<{
    id: number;
    stone: ApiStone;
    quantity: number;
    notes: string;
  }>;
  created_at: string;
  updated_at: string;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper function to set auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Token ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorData;
    try {
      const text = await response.text();
      if (text.trim()) {
        errorData = JSON.parse(text);
      } else {
        errorData = {};
      }
    } catch (parseError) {
      // If response is not JSON (e.g., HTML error page), create a generic error
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Handle different types of error responses from Django REST Framework
    let errorMessage = `HTTP error! status: ${response.status}`;
    
    if (errorData.error) {
      // Custom error field (used in our backend views)
      errorMessage = errorData.error;
    } else if (errorData.detail) {
      // Single error message (common for authentication errors)
      errorMessage = errorData.detail;
    } else if (errorData.message) {
      // Custom message field
      errorMessage = errorData.message;
    } else if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
      // Field validation errors (common for login/registration)
      errorMessage = errorData.non_field_errors[0];
    } else if (typeof errorData === 'object' && errorData !== null) {
      // Field-specific errors - get the first error
      const firstErrorKey = Object.keys(errorData)[0];
      if (firstErrorKey && Array.isArray(errorData[firstErrorKey])) {
        errorMessage = errorData[firstErrorKey][0];
      } else if (firstErrorKey) {
        errorMessage = errorData[firstErrorKey];
      }
    }
    
    throw new Error(errorMessage);
  }
  
  const text = await response.text();
  if (!text.trim()) {
    return {};
  }
  
  try {
    return JSON.parse(text);
  } catch (parseError) {
    console.error('Failed to parse JSON response:', text);
    throw new Error(`Invalid JSON response from server: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`);
  }
};

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password })
    });
    const data = await handleResponse(response);
    
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    
    return data;
  },

  register: async (email: string, password: string, firstName: string, lastName?: string) => {
    const response = await fetch(`${API_BASE_URL}/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: email,
        email,
        password,
        password_confirm: password, // Add the required password_confirm field
        first_name: firstName,
        last_name: lastName || ''
      })
    });
    const data = await handleResponse(response);
    
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    
    return data;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/users/profile/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  updateProfile: async (profileData: Partial<ApiUser>) => {
    const response = await fetch(`${API_BASE_URL}/users/profile/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    return handleResponse(response);
  },

  getQuotes: async (): Promise<ApiQuote[]> => {
    const response = await fetch(`${API_BASE_URL}/users/quotes/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Stones API
export const stonesApi = {
  getAll: async (): Promise<ApiStone[]> => {
    const response = await fetch(`${API_BASE_URL}/stones/`);
    return handleResponse(response);
  },

  getById: async (id: number): Promise<ApiStone> => {
    const response = await fetch(`${API_BASE_URL}/stones/${id}/`);
    return handleResponse(response);
  },

  getFeatured: async (): Promise<ApiStone[]> => {
    const response = await fetch(`${API_BASE_URL}/stones/featured/`);
    return handleResponse(response);
  },

  getByCategory: async () => {
    const response = await fetch(`${API_BASE_URL}/stones/by_category/`);
    return handleResponse(response);
  },

  search: async (query: string): Promise<ApiStone[]> => {
    const response = await fetch(`${API_BASE_URL}/stones/?search=${encodeURIComponent(query)}`);
    return handleResponse(response);
  }
};

// Projects API
export const projectsApi = {
  getAll: async (): Promise<ApiProject[]> => {
    const response = await fetch(`${API_BASE_URL}/projects/`);
    return handleResponse(response);
  },

  getById: async (id: number): Promise<ApiProject> => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}/`);
    return handleResponse(response);
  },

  getFeatured: async (): Promise<ApiProject[]> => {
    const response = await fetch(`${API_BASE_URL}/projects/featured/`);
    return handleResponse(response);
  }
};

// Cart API
export const cartApi = {
  get: async (): Promise<ApiCart> => {
    const response = await fetch(`${API_BASE_URL}/cart/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  addItem: async (stoneId: number, quantity: number = 1, options?: {
    selected_finish?: string;
    selected_thickness?: string;
    notes?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/cart/add_item/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        stone_id: stoneId,
        quantity,
        selected_finish: options?.selected_finish || '',
        selected_thickness: options?.selected_thickness || '',
        notes: options?.notes || ''
      })
    });
    return handleResponse(response);
  },

  updateItem: async (itemId: number, quantity: number) => {
    const response = await fetch(`${API_BASE_URL}/cart/update_item/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ item_id: itemId, quantity })
    });
    return handleResponse(response);
  },

  removeItem: async (itemId: number) => {
    const response = await fetch(`${API_BASE_URL}/cart/remove_item/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ item_id: itemId })
    });
    return handleResponse(response);
  },

  clear: async () => {
    const response = await fetch(`${API_BASE_URL}/cart/clear/`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  checkout: async (shippingData: {
    address: string;
    city: string;
    postal_code: string;
    phone: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/cart/checkout/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ shipping: shippingData })
    });
    return handleResponse(response);
  }
};

// Orders API
export const ordersApi = {
  getAll: async (): Promise<ApiOrder[]> => {
    const response = await fetch(`${API_BASE_URL}/orders/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getById: async (id: number): Promise<ApiOrder> => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Quotes API
export const quotesApi = {
  submit: async (quoteData: {
    name: string;
    email: string;
    company: string;
    phone?: string;
    project_type: string;
    project_location: string;
    timeline?: string;
    additional_notes?: string;
    items?: Array<{
      stone_id: number;
      quantity: number;
      notes: string;
    }>;
  }) => {
    const response = await fetch(`${API_BASE_URL}/quotes/submit_quote/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ...quoteData,
        project_type: quoteData.project_type,
        project_location: quoteData.project_location
      })
    });
    return handleResponse(response);
  },

  getAll: async (): Promise<ApiQuote[]> => {
    const response = await fetch(`${API_BASE_URL}/quotes/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getById: async (id: number): Promise<ApiQuote> => {
    const response = await fetch(`${API_BASE_URL}/quotes/${id}/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Payment API
export const paymentApi = {
  handleCallback: async (authority: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/payment/callback/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Authority: authority, Status: status })
    });
    return handleResponse(response);
  }
};

// Export all APIs
export const api = {
  auth: authApi,
  stones: stonesApi,
  projects: projectsApi,
  cart: cartApi,
  orders: ordersApi,
  quotes: quotesApi,
  payment: paymentApi
};

export default api;
