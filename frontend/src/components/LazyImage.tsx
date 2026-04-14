import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  placeholder = 'https://placehold.co/600x400/eeeeee/999999?text=Loading...',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <img
        ref={imgRef}
        src={isInView && !hasError ? src : placeholder}
        alt={alt}
        className={cn(
          'w-full h-full object-cover transition-all duration-500',
          isLoaded ? 'opacity-100' : 'opacity-0',
          !isInView && 'blur-sm'
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
      />
      
      {isInView && !isLoaded && !hasError && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse" />
      )}
      
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Image unavailable</span>
        </div>
      )}
    </div>
  );
};
