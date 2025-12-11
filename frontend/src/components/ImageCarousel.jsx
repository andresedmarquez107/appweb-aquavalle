import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { facilityImages } from '../mock';

export const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % facilityImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + facilityImages.length) % facilityImages.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

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
          <div className="relative h-96 md:h-[500px] overflow-hidden rounded-2xl shadow-2xl">
            <img
              src={facilityImages[currentIndex]}
              alt={`Instalación ${currentIndex + 1}`}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent pointer-events-none"></div>

            {/* Navigation buttons */}
            <Button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 rounded-full w-12 h-12 p-0 shadow-lg"
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={24} />
            </Button>
            
            <Button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 rounded-full w-12 h-12 p-0 shadow-lg"
              aria-label="Siguiente imagen"
            >
              <ChevronRight size={24} />
            </Button>

            {/* Counter */}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
              {currentIndex + 1} / {facilityImages.length}
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
    </section>
  );
};