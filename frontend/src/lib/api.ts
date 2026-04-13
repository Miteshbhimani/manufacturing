import axios from 'axios';
import type { Product, ApiResponse, LeadData, LoginCredentials, LoginResponse, OdooSession, DynamicPage } from '../types/api.types';

const isDevelopment = import.meta.env.DEV;

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 30000,
});

// Add request interceptor for debugging and JWT token (development only)
api.interceptors.request.use(
  (config) => {
    // Add JWT token if available
    const token = localStorage.getItem('nucleus_auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      if (isDevelopment) {
        console.log('JWT token found and added to headers:', token.substring(0, 20) + '...');
      }
    } else {
      if (isDevelopment) {
        console.log('No JWT token found in localStorage');
      }
    }
    
    // Legacy user ID for compatibility
    const userId = localStorage.getItem('nucleus_user_id');
    if (userId) {
      config.headers['x-user-id'] = userId;
    }
    
    if (isDevelopment) {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
        data: config.data,
        hasToken: !!token
      });
    }
    return config;
  },
  (error) => {
    if (isDevelopment) {
      console.error('API Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging (development only)
api.interceptors.response.use(
  (response) => {
    if (isDevelopment) {
      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    if (isDevelopment) {
      console.error('API Response Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data
      });
    }
    return Promise.reject(error);
  }
);

// Mock products for fallback
const mockProducts: Product[] = [
  {
    id: "1",
    slug: "bearing-housing",
    name: "Bearing Housing",
    shortDescription: "High-quality pump component - Bearing Housing. Precision engineered for durability and optimal performance in industrial applications.",
    category: "Pump Parts",
    industry: "Pump Parts",
    heroImage: "https://images.unsplash.com/photo-1565514020179-026b92b217ac?auto=format&fit=crop&w=800&q=80",
    has3D: false,
    price: null,
    specs: [
      "Material: Cast Iron",
      "Precision: ±0.01mm",
      "Surface Finish: Machined",
      "Temperature Range: -20°C to 120°C"
    ]
  },
  {
    id: "2",
    slug: "pump-shaft",
    name: "Pump Shaft",
    shortDescription: "Precision-machined pump shaft for industrial applications. Made from high-grade stainless steel with corrosion resistance.",
    category: "Pump Parts", 
    industry: "Pump Parts",
    heroImage: "https://images.unsplash.com/photo-1581091226825-a6a312a84e5c?auto=format&fit=crop&w=800&q=80",
    has3D: false,
    price: null,
    specs: [
      "Material: Stainless Steel 304",
      "Diameter: 25mm",
      "Length: 300mm",
      "Surface Treatment: Polished"
    ]
  },
  {
    id: "3",
    slug: "impeller",
    name: "Impeller",
    shortDescription: "Efficient pump impeller designed for optimal fluid dynamics and maximum flow rates.",
    category: "Pump Parts",
    industry: "Pump Parts", 
    heroImage: "https://images.unsplash.com/photo-1579546923918-04170d17dfe1?auto=format&fit=crop&w=800&q=80",
    has3D: false,
    price: null,
    specs: [
      "Type: Semi-Open",
      "Blades: 6",
      "Diameter: 200mm",
      "Material: Bronze Alloy"
    ]
  },
  {
    id: "4",
    slug: "valve-body",
    name: "Valve Body",
    shortDescription: "Robust valve body construction for high-pressure applications. Precision cast and machined.",
    category: "Pump Parts",
    industry: "Pump Parts",
    heroImage: "https://images.unsplash.com/photo-15187092688092-a0c9d8a6b3e?auto=format&fit=crop&w=800&q=80",
    has3D: false,
    price: null,
    specs: [
      "Material: Ductile Iron",
      "Pressure Rating: 150 Bar",
      "Connection: Flanged",
      "Temperature: 200°C Max"
    ]
  },
  {
    id: "5",
    slug: "seal-ring",
    name: "Seal Ring",
    shortDescription: "High-performance seal ring for pump applications. Chemical resistant and durable.",
    category: "Pump Parts",
    industry: "Pump Parts",
    heroImage: "https://images.unsplash.com/photo-1581091226825-a6a312a84e5c?auto=format&fit=crop&w=800&q=80",
    has3D: false,
    price: null,
    specs: [
      "Material: NBR Rubber",
      "Hardness: 70 Shore A",
      "Temperature Range: -30°C to 100°C",
      "Compatibility: Water, Oil"
    ]
  }
];

export const getProducts = async (): Promise<Product[]> => {
  try {
    if (isDevelopment) {
      console.log('Fetching products from Odoo API...');
    }
    const response = await api.get<ApiResponse<Product[]>>('/products');
    
    if (isDevelopment) {
      console.log('Products API response:', response.data);
    }

    if (response.data?.success && response.data.data && response.data.data.length > 0) {
      if (isDevelopment) {
        console.log(`Successfully fetched ${response.data.data.length} products from Odoo`);
      }

      const processedProducts = response.data.data.map((p: any) => {
        if (isDevelopment) {
          console.log('Processing product:', p);
        }

        // Handle image processing with mobile-friendly URLs
        let heroImage = 'https://images.unsplash.com/photo-1565514020179-026b92b217ac?auto=format&fit=crop&w=800&q=80';

        if (p.image_1920 && p.image_1920.trim() !== '') {
          if (p.image_1920.startsWith('http')) {
            // Handle HTTP URLs - convert to HTTPS and remove localhost
            heroImage = p.image_1920
              .replace('http://localhost:8069', '')
              .replace('http://', 'https://');
          } else if (p.image_1920.startsWith('iVBORw0KGgo') || p.image_1920.startsWith('/9j/') || p.image_1920.startsWith('R0lGOD')) {
            // Handle base64 images (JPEG, PNG, GIF)
            heroImage = `data:image/jpeg;base64,${p.image_1920}`;
          } else if (p.image_1920.startsWith('data:image')) {
            // Handle already formatted data URLs
            heroImage = p.image_1920;
          } else {
            // Handle Odoo image field paths - only create if we have a valid image
            heroImage = `/web/image/product.product/${p.id}/image_1920`;
          }
        } else {
          // No image available, use fallback
          heroImage = '';
        }
        
        if (isDevelopment) {
          console.log('Final image URL for product:', p.name, heroImage);
        }
        
        return {
          id: p.id.toString(),
          slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          name: p.name,
          shortDescription: p.description_sale || (p.description ? p.description.split('.')[0] : 'Precision industrial component.'),
          category: p.categ_id ? (Array.isArray(p.categ_id) ? p.categ_id[1].split('/').pop().trim() : p.categ_id) : 'General',
          industry: p.categ_id ? (Array.isArray(p.categ_id) ? p.categ_id[1] : p.categ_id) : 'General',
          heroImage: heroImage,
          has3D: p.has3D || false,
          price: null, // Remove price display - enquiry only
          specs: p.description ? p.description.split('|').map((s: string) => s.trim()) : []
        } as Product;
      });
      
      if (isDevelopment) {
        console.log('Processed products:', processedProducts);
      }
      return processedProducts;
    } else {
      if (isDevelopment) {
        console.warn('No products data in response, falling back to mock products');
      }
      return mockProducts;
    }
  } catch (err: any) {
    if (isDevelopment) {
      console.error("Failed to fetch products from Odoo:", {
        error: err,
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
        config: err?.config
      });
      console.warn("Falling back to mock products");
    }
    return mockProducts;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/products');
    if (response.data && response.data.success && response.data.data) {
      const categories = response.data.data
        .map((p: any) => p.categ_id ? (Array.isArray(p.categ_id) ? p.categ_id[1] : p.categ_id) : 'General')
        .filter(Boolean);
      return [...new Set(categories)];
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
};

export const createLead = async (leadData: LeadData): Promise<ApiResponse> => {
  try {
    if (isDevelopment) {
      console.log('Submitting lead:', leadData);
    }
    const userId = localStorage.getItem('nucleus_user_id');
    if (isDevelopment) {
      console.log('User ID from localStorage:', userId);
    }
    
    // Sanitize and validate data before sending
    const sanitizedData = {
      fullName: leadData.fullName?.trim() || '',
      companyName: leadData.companyName?.trim() || '',
      email: leadData.email?.trim().toLowerCase() || '',
      phone: leadData.phone?.trim() || '',
      message: leadData.message?.trim() || '',
      userId: userId ? parseInt(userId) : null
    };
    
    if (isDevelopment) {
      console.log('Sanitized data being sent:', sanitizedData);
    }
    
    const response = await api.post<ApiResponse>('/leads', sanitizedData);
    if (isDevelopment) {
      console.log('API response:', response.data);
    }
    return response.data;
  } catch (error: any) {
    if (isDevelopment) {
      console.error('Lead submission error:', {
        error: error,
        status: error?.response?.status,
        data: error?.response?.data,
        config: error?.config
      });
    }
    throw error; // Re-throw to let caller handle
  }
};

export const debugMobileImages = async () => {
  console.log('=== MOBILE DEBUG START ===');
  
  // Check if we're on mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  console.log('Is mobile device:', isMobile);
  console.log('User agent:', navigator.userAgent);
  console.log('Screen size:', window.screen.width + 'x' + window.screen.height);
  
  // Test image loading with CORS
  const testImageUrl = 'https://images.unsplash.com/photo-1565514020179-026b92b217ac?auto=format&fit=crop&w=800&q=80';
  console.log('Testing fallback image URL:', testImageUrl);
  
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => console.log('Fallback image loaded successfully');
  img.onerror = (e) => console.error('Fallback image failed to load:', e);
  img.src = testImageUrl;
  
  // Test products
  try {
    const products = await getProducts();
    products.forEach((product, index) => {
      console.log(`Product ${index + 1}:`, {
        name: product.name,
        imageUrl: product.heroImage,
        imageType: product.heroImage.startsWith('data:') ? 'base64' : 
                  product.heroImage.startsWith('http') ? 'url' : 'relative'
      });
    });
  } catch (error) {
    console.error('Failed to get products for mobile debug:', error);
  }
  
  console.log('=== END MOBILE DEBUG ===');
};

export const testAPIConnection = async () => {
  try {
    console.log('Testing API connection...');
    const response = await api.get('/test');
    console.log('API test response:', response.data);
    return { success: true, data: response.data };
  } catch (err: any) {
    console.error('API connection test failed:', {
      error: err,
      status: err?.response?.status,
      statusText: err?.response?.statusText,
      data: err?.response?.data,
      config: err?.config
    });
    return { success: false, error: err };
  }
};

export const getDynamicPage = async (slug: string): Promise<DynamicPage> => {
  try {
    const response = await api.get<DynamicPage>(`/pages/${slug}`);
    return response.data;
  } catch (error) {
    if (isDevelopment) {
      console.error('Failed to fetch dynamic page:', error);
    }
    return { success: false, error, content: 'Page not found' };
  }
};

export const login = async ({ email, password, isRegistering }: LoginCredentials): Promise<LoginResponse> => {
  try {
    if (isDevelopment) {
      console.log('Attempting login with:', { email, isRegistering });
    }

    let response;
    
    if (isRegistering) {
      // Register new user
      response = await api.post('/auth/register', { 
        email, 
        password, 
        firstName: email.split('@')[0], 
        lastName: '' 
      });
      
      if (isDevelopment) {
        console.log('Registration response:', response.data);
      }
      
      // Return success for registration (user needs to verify email)
      return {
        success: true,
        requiresVerification: true,
        message: response.data.message || 'Registration successful. Please check your email for verification.'
      };
    } else {
      // Login existing user
      response = await api.post('/auth/login', { email, password });
      
      if (isDevelopment) {
        console.log('Login response:', response.data);
      }
      
      if (response.data.success) {
        // Transform the response to match expected format
        const userData = response.data.data.user;
        const token = response.data.data.token;
        
        // Store JWT token for future API calls
        if (token) {
          localStorage.setItem('nucleus_auth_token', token);
        }
        
        return {
          success: true,
          data: {
            id: userData.id,
            name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.email,
            email: userData.email,
            role: userData.role
          }
        };
      } else {
        return {
          success: false,
          message: response.data.error || 'Login failed'
        };
      }
    }
  } catch (error: any) {
    if (isDevelopment) {
      console.error('API Login error details:', {
        error: error,
        response: error.response,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config
      });
    }
    
    // Return error in expected format
    return {
      success: false,
      message: error.response?.data?.error || error.message || 'Login failed'
    };
  }
};

export const createOdooSession = async (email: string, password: string): Promise<{ success: boolean; session?: OdooSession }> => {
  try {
    const response = await api.post<{ success: boolean; session?: OdooSession }>('/auth/create-odoo-session', { email, password });
    return response.data;
  } catch (error) {
    if (isDevelopment) {
      console.error('Odoo session creation error:', error);
    }
    throw error;
  }
};
