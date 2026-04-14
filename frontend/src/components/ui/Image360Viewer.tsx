import { useRef, useEffect, useState } from 'react';
import { X, Maximize2, RotateCw } from 'lucide-react';

interface Image360ViewerProps {
  images: {
    front: string;
    back?: string;
    left?: string;
    right?: string;
    top?: string;
    bottom?: string;
  };
  className?: string;
}

export function Image360Viewer({ images, className = "" }: Image360ViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [imageError, setImageError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    if (isRotating) {
      const interval = setInterval(() => {
        setRotation(prev => (prev + 2) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isRotating]);

  const handleImageError = () => {
    console.warn('Image failed to load, showing fallback');
    setImageError(true);
  };

  const getImageSrc = () => {
    if (imageError || !images.front) {
      return '';
    }
    return images.front;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative bg-white rounded-lg overflow-hidden shadow-lg ${className} ${isFullscreen ? 'fixed inset-0 z-50 w-full h-full' : ''}`}
      tabIndex={0}
    >
      {/* Main Image Display */}
      <div className={`relative ${isFullscreen ? 'w-full h-full' : 'aspect-square w-full'}`}>
        {getImageSrc() ? (
          <img
            src={getImageSrc()}
            alt="Product front view"
            className="w-full h-full object-contain transition-transform duration-300"
            style={{ transform: `rotate(${rotation}deg)` }}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4 4m0 0l4-4m0 0l-4-4m4 4l4-4m0 0l-4 4" opacity="0.5"/>
                  <circle cx="12" cy="12" r="8" strokeWidth="2" opacity="0.3"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Product Image</h3>
              <p className="text-gray-500 text-sm mb-2">The product image is currently unavailable</p>
              <p className="text-gray-400 text-xs">Please check back later or contact support</p>
            </div>
          </div>
        )}
        
        {/* View Label Overlay */}
        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {getImageSrc() ? 'Front View' : 'No Image'}
        </div>

        {/* Rotation Indicator */}
        {isRotating && getImageSrc() && (
          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
            <RotateCw className="h-4 w-4 animate-spin" />
            Auto-Rotating
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`p-2 rounded-full transition-all ${
                isRotating
                  ? 'bg-red-500 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              title={isRotating ? 'Stop Rotation' : 'Start Rotation'}
            >
              <RotateCw className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <X className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
