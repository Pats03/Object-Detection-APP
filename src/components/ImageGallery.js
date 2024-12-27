import React from 'react';
import './ImageGallery.css';

const ImageGallery = () => {
  // Array of image URLs
  const images = [
    '/att1.webp',
    '/att2.webp',
  ];

  return (
    <div className="gallery-container">
    
      <div className="image-grid">
        {images.map((src, index) => (
          <div className="image-wrapper" key={index}>
            <img
              src={src}
              alt={`Gallery ${index + 1}`}
              className="gallery-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
