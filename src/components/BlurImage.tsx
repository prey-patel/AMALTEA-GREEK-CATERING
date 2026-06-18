import React, { useState } from 'react';

interface BlurImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function BlurImage({ src, alt, className = '', width, height }: BlurImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-900/10">
      {/* Background soft placeholder / skeleton overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200/80 animate-pulse flex items-center justify-center">
          {/* Elegant geometric spinner inside */}
          <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-700 rounded-full animate-spin opacity-45" />
        </div>
      )}

      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
        referrerPolicy="no-referrer"
        className={`${className} transition-all duration-1000 ease-out ${
          isLoaded 
            ? 'blur-0 opacity-100 scale-100' 
            : 'blur-lg opacity-40 scale-102'
        }`}
      />
    </div>
  );
}
