"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheControlHeaders = exports.clearCache = exports.getCacheStats = exports.cacheCleanup = exports.optimizeImages = exports.cacheMiddleware = void 0;
// Simple in-memory cache (for development)
const cacheStore = new Map();
// Cache middleware factory
const cacheMiddleware = (ttl = 5 * 60 * 1000) => {
    return (req, res, next) => {
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
        res.json = function (data) {
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
exports.cacheMiddleware = cacheMiddleware;
// Image optimization middleware
const optimizeImages = (req, res, next) => {
    const originalJson = res.json;
    res.json = function (data) {
        if (data && data.data && Array.isArray(data.data)) {
            // Optimize images in product data
            data.data = data.data.map((item) => {
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
exports.optimizeImages = optimizeImages;
// Optimize image URL
const optimizeImageUrl = (imageUrl) => {
    if (!imageUrl)
        return imageUrl;
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
const compressDataUrl = (dataUrl) => {
    try {
        // Extract the base64 part
        const base64Index = dataUrl.indexOf(',');
        if (base64Index === -1)
            return dataUrl;
        const mimeType = dataUrl.substring(0, base64Index).split(':')[1].split(';')[0];
        const base64Data = dataUrl.substring(base64Index + 1);
        // For large images, return a thumbnail
        if (base64Data.length > 500000) { // 500KB threshold
            console.log('Large image detected, returning placeholder');
            return 'https://placehold.co/600x400/eeeeee/999999?text=Large+Image+Optimized';
        }
        return dataUrl;
    }
    catch (error) {
        console.error('Error optimizing image:', error);
        return dataUrl;
    }
};
// Add optimization parameters to image URLs
const addImageOptimizationParams = (url) => {
    try {
        const urlObj = new URL(url);
        // Add optimization parameters for common image services
        if (urlObj.hostname.includes('cloudinary')) {
            urlObj.searchParams.set('q', '80'); // Quality 80%
            urlObj.searchParams.set('f', 'auto'); // Auto format
        }
        else if (urlObj.hostname.includes('images.unsplash')) {
            urlObj.searchParams.set('q', '80');
            urlObj.searchParams.set('fm', 'webp'); // WebP format
        }
        return urlObj.toString();
    }
    catch (error) {
        return url;
    }
};
// Cache cleanup middleware
const cacheCleanup = () => {
    return (req, res, next) => {
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
exports.cacheCleanup = cacheCleanup;
// Cache statistics
const getCacheStats = () => {
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
exports.getCacheStats = getCacheStats;
// Clear cache endpoint
const clearCache = (req, res) => {
    const size = cacheStore.size;
    cacheStore.clear();
    const response = {
        success: true,
        data: { message: `Cleared ${size} cache entries` }
    };
    res.json(response);
};
exports.clearCache = clearCache;
// Cache control headers
const cacheControlHeaders = (maxAge = 3600) => {
    return (req, res, next) => {
        res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
        res.setHeader('ETag', Date.now().toString());
        next();
    };
};
exports.cacheControlHeaders = cacheControlHeaders;
