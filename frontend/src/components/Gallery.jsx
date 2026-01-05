import React, { useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { facilityImages } from '../mock';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export const Gallery = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openImage = (index) => {
    setSelectedIndex(index);
  };

  const closeImage = () => {
    setSelectedIndex(null);
  };

  const goToPrevious = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : facilityImages.length - 1));
  };

  const goToNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev < facilityImages.length - 1 ? prev + 1 : 0));
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowLeft') goToPrevious(e);
      if (e.key === 'ArrowRight') goToNext(e);
      if (e.key === 'Escape') closeImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  return (
    <section id="galeria" className="py-20 bg-gradient-to-b from-stone-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-stone-800 mb-4">Galería</h2>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Descubre nuestras instalaciones y espacios recreativos
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {facilityImages.map((image, index) => (
            <div 
              key={index}
              className="relative overflow-hidden rounded-lg cursor-pointer group aspect-square"
              onClick={() => openImage(index)}
            >
              <img 
                src={image}
                alt={`Instalación ${index + 1}`}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/30 transition-all duration-300 flex items-center justify-center">
                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Image Lightbox */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeImage}
        >
          {/* Close button */}
          <button 
            onClick={closeImage}
            className="absolute right-4 top-4 z-50 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
          >
            <X size={24} className="text-white" />
          </button>

          {/* Previous button */}
          <button 
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
          >
            <ChevronLeft size={32} className="text-white" />
          </button>

          {/* Next button */}
          <button 
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
          >
            <ChevronRight size={32} className="text-white" />
          </button>

          {/* Image */}
          <div 
            className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={facilityImages[selectedIndex]}
              alt={`Vista ampliada ${selectedIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
            {selectedIndex + 1} / {facilityImages.length}
          </div>
        </div>
      )}
    </section>
  );
};