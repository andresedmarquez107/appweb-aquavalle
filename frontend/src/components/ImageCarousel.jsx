import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { Button } from './ui/button';
import { facilityImages } from '../mock';

export const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % facilityImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + facilityImages.length) % facilityImages.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const openLightbox = () => {
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  // Handle keyboard navigation in lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  return (
    <section className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-stone-800 mb-4">Nuestras Instalaciones</h2>
          <p className="text-xl text-stone-600">
            Descubre la belleza natural y comodidad de Cabañas AquaValle
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Main image container */}
          <div 
            className="relative h-96 md:h-[500px] overflow-hidden rounded-2xl shadow-2xl cursor-pointer group"
            onClick={openLightbox}
          >
            <img
              src={facilityImages[currentIndex]}
              alt={`Instalación ${currentIndex + 1}`}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent pointer-events-none"></div>
            
            {/* Zoom indicator on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
              <div className="bg-white/90 rounded-full p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                <ZoomIn size={32} className="text-stone-800" />
              </div>
            </div>

            {/* Navigation buttons */}
            <Button
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 rounded-full w-12 h-12 p-0 shadow-lg"
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={24} />
            </Button>
            
            <Button
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 rounded-full w-12 h-12 p-0 shadow-lg"
              aria-label="Siguiente imagen"
            >
              <ChevronRight size={24} />
            </Button>

            {/* Counter */}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
              {currentIndex + 1} / {facilityImages.length}
            </div>
            
            {/* Click to expand hint */}
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Click para ampliar
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {facilityImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-8 h-3 bg-emerald-600'
                    : 'w-3 h-3 bg-stone-300 hover:bg-stone-400'
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>

          {/* Thumbnail preview */}
          <div className="hidden md:grid grid-cols-5 gap-3 mt-6">
            {facilityImages.map((image, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                  index === currentIndex
                    ? 'ring-4 ring-emerald-600 scale-105'
                    : 'ring-2 ring-stone-200 hover:ring-emerald-400 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={image}
                  alt={`Miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button 
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-50 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
          >
            <X size={24} className="text-white" />
          </button>

          {/* Previous button */}
          <button 
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
          >
            <ChevronLeft size={32} className="text-white" />
          </button>

          {/* Next button */}
          <button 
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
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
              src={facilityImages[currentIndex]}
              alt={`Vista ampliada ${currentIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
            {currentIndex + 1} / {facilityImages.length}
          </div>
          
          {/* Keyboard hint */}
          <div className="absolute bottom-4 right-4 text-white/50 text-xs hidden md:block">
            Usa ← → para navegar · ESC para cerrar
          </div>
        </div>
      )}
    </section>
  );
};