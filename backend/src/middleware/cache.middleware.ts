import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/express.types';

// Simple in-memory cache (for development)
const cacheStore = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Cache middleware factory
export const cacheMiddleware = (ttl: number = 5 * 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = `cache:${req.method}:${req.originalUrl}`;
    const now = Date.now();
    const cached = cacheStore.get(key);
    
    // Check if we have a valid cached response
    if (cached && (now - cached.timestamp) < cached.ttl) {
      console.log(`Cache hit for ${key}`);
      res.json(cached.data);
      return;
    }
    
    // Override res.json to cache the response
    const originalJson = res.json;
    res.json = function(data: any) {
      // Only cache successful responses
      if (data && data.success) {
        cacheStore.set(key, {
          data,
          timestamp: now,
          ttl
        });
        console.log(`Cache set for ${key} (TTL: ${ttl}ms)`);
      }
      return originalJson.call(this, data);
    };
    
    next();
  };
};

// Image optimization middleware
export const optimizeImages = (req: Request, res: Response, next: NextFunction): void => {
  const originalJson = res.json;
  
  res.json = function(data: any) {
    if (data && data.data && Array.isArray(data.data)) {
      // Optimize images in product data
      data.data = data.data.map((item: any) => {
        if (item.image_1920) {
          item.image_1920 = optimizeImageUrl(item.image_1920);
        }
        return item;
      });
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};

// Optimize image URL
const optimizeImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return imageUrl;
  
  // If it's already a data URL, compress it
  if (imageUrl.startsWith('data:')) {
    return compressDataUrl(imageUrl);
  }
  
  // If it's an external URL, add optimization parameters
  if (imageUrl.startsWith('http')) {
    return addImageOptimizationParams(imageUrl);
  }
  
  return imageUrl;
};

// Compress data URL images
const compressDataUrl = (dataUrl: string): string => {
  try {
    // Extract the base64 part
    const base64Index = dataUrl.indexOf(',');
    if (base64Index === -1) return dataUrl;
    
    const mimeType = dataUrl.substring(0, base64Index).split(':')[1].split(';')[0];
    const base64Data = dataUrl.substring(base64Index + 1);
    
    // For large images, return a thumbnail
    if (base64Data.length > 500000) { // 500KB threshold
      console.log('Large image detected, returning placeholder');
      return 'https://placehold.co/600x400/eeeeee/999999?text=Large+Image+Optimized';
    }
    
    return dataUrl;
  } catch (error) {
    console.error('Error optimizing image:', error);
    return dataUrl;
  }
};

// Add optimization parameters to image URLs
const addImageOptimizationParams = (url: string): string => {
  try {
    const urlObj = new URL(url);
    
    // Add optimization parameters for common image services
    if (urlObj.hostname.includes('cloudinary')) {
      urlObj.searchParams.set('q', '80'); // Quality 80%
      urlObj.searchParams.set('f', 'auto'); // Auto format
    } else if (urlObj.hostname.includes('images.unsplash')) {
      urlObj.searchParams.set('q', '80');
      urlObj.searchParams.set('fm', 'webp'); // WebP format
    }
    
    return urlObj.toString();
  } catch (error) {
    return url;
  }
};

// Cache cleanup middleware
export const cacheCleanup = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, value] of cacheStore.entries()) {
      if (now - value.timestamp > value.ttl) {
        cacheStore.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`Cleaned ${cleaned} expired cache entries`);
    }
    
    next();
  };
};

// Cache statistics
export const getCacheStats = (): { total: number; hitRate: number; memoryUsage: number } => {
  const total = cacheStore.size;
  const now = Date.now();
  let valid = 0;
  let totalSize = 0;
  
  for (const [key, value] of cacheStore.entries()) {
    if (now - value.timestamp < value.ttl) {
      valid++;
      totalSize += JSON.stringify(value.data).length;
    }
  }
  
  return {
    total,
    hitRate: total > 0 ? valid / total : 0,
    memoryUsage: totalSize
  };
};

// Clear cache endpoint
export const clearCache = (req: Request, res: Response): void => {
  const size = cacheStore.size;
  cacheStore.clear();
  
  const response: ApiResponse = {
    success: true,
    data: { message: `Cleared ${size} cache entries` }
  };
  
  res.json(response);
};

// Cache control headers
export const cacheControlHeaders = (maxAge: number = 3600) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
    res.setHeader('ETag', Date.now().toString());
    next();
  };
};
