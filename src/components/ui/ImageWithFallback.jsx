import { useState } from 'react';
import logoFallback from '../../assets/logo.png';

const ImageWithFallback = ({
  src,
  alt = 'Image',
  fallbackSrc = logoFallback,
  className = '',
  style = {},
  objectFit = 'cover',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    // Reset error state if image loads successfully
    if (hasError && imgSrc !== fallbackSrc) {
      setHasError(false);
    }
  };

  // If src is empty or null, use fallback directly
  const imageSrc = imgSrc || fallbackSrc;

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      style={{
        objectFit,
        ...style,
      }}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
};

// Avatar variant with circular style
export const AvatarWithFallback = ({
  src,
  alt = 'Avatar',
  size = 40,
  className = '',
  ...props
}) => {
  return (
    <ImageWithFallback
      src={src}
      alt={alt}
      className={`rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
      }}
      objectFit="cover"
      {...props}
    />
  );
};

// Thumbnail variant with rounded corners
export const ThumbnailWithFallback = ({
  src,
  alt = 'Thumbnail',
  width = 100,
  height = 100,
  className = '',
  ...props
}) => {
  return (
    <ImageWithFallback
      src={src}
      alt={alt}
      className={`rounded-lg ${className}`}
      style={{
        width,
        height,
        minWidth: width,
        minHeight: height,
      }}
      objectFit="cover"
      {...props}
    />
  );
};

// Card image variant
export const CardImageWithFallback = ({
  src,
  alt = 'Card Image',
  aspectRatio = '16/9',
  className = '',
  ...props
}) => {
  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ aspectRatio }}
    >
      <ImageWithFallback
        src={src}
        alt={alt}
        className="w-full h-full"
        objectFit="cover"
        {...props}
      />
    </div>
  );
};

export default ImageWithFallback;
