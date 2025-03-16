import React from 'react';
import Image from 'next/image';

interface MongoDBLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function MongoDBLogo({ className = '', width = 150, height = 40 }: MongoDBLogoProps) {
  return (
    <Image
      src="/MongoDB_Logomark_CMYK_Forest-Green-1.png"
      alt="MongoDB Logo"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
} 