import React, { useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { facilityImages } from '../mock';
import { X } from 'lucide-react';

export const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

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
              onClick={() => setSelectedImage(image)}
            >
              <img 
                src={image}
                alt={`Instalación ${index + 1}`}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/30 transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Image modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute right-4 top-4 z-50 bg-white/90 rounded-full p-2 hover:bg-white transition-colors"
          >
            <X size={20} />
          </button>
          {selectedImage && (
            <img 
              src={selectedImage}
              alt="Vista ampliada"
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};