import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
// AQUÍ ESTABA EL ERROR: Agregué los iconos que faltaban (ZoomIn, ChevronLeft, etc.)
import { Users, Euro, Wifi, Tv, Flame, Droplets, ZoomIn, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useRooms } from '../hooks/useRooms';

// Room Image Carousel Component
const RoomCarousel = ({ images, roomName, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // PROTECCIÓN: Si no hay imágenes, mostramos un recuadro gris en vez de romper la app
  if (!images || images.length === 0) {
    return (
      <div className="h-64 w-full bg-stone-200 flex items-center justify-center text-stone-500">
        Sin imagen disponible
      </div>
    );
  }

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative h-64 overflow-hidden group">
      <img 
        src={images[currentIndex]} 
        alt={`${roomName} - Imagen ${currentIndex + 1}`}
        className="w-full h-full object-cover cursor-pointer transform group-hover:scale-105 transition-transform duration-500"
        onClick={() => onImageClick(currentIndex)}
      />
      
      {/* Zoom indicator */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
        <div className="bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ZoomIn size={20} className="text-stone-800" />
        </div>
      </div>

      {/* Navigation arrows - only show if more than 1 image */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 rounded-full w-8 h-8 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 rounded-full w-8 h-8 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white w-4' : 'bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
};

// Lightbox Component
const Lightbox = ({ images, currentIndex, onClose, onNavigate }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') onNavigate('prev');
    if (e.key === 'ArrowRight') onNavigate('next');
    if (e.key === 'Escape') onClose();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, []); // El array vacío está bien aquí

  // Protección por si images es undefined
  if (!images || images.length === 0) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute right-4 top-4 z-50 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
      >
        <X size={24} className="text-white" />
      </button>

      {/* Previous button */}
      {images.length > 1 && (
        <button 
          onClick={(e) => { e.stopPropagation(); onNavigate('prev'); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
        >
          <ChevronLeft size={32} className="text-white" />
        </button>
      )}

      {/* Next button */}
      {images.length > 1 && (
        <button 
          onClick={(e) => { e.stopPropagation(); onNavigate('next'); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
        >
          <ChevronRight size={32} className="text-white" />
        </button>
      )}

      {/* Image */}
      <div 
        className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={images[currentIndex]}
          alt={`Vista ampliada ${currentIndex + 1}`}
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
        />
      </div>

      {/* Image counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
        {currentIndex + 1} / {images.length}
      </div>
      
      {/* Keyboard hint */}
      <div className="absolute bottom-4 right-4 text-white/50 text-xs hidden md:block">
        Usa ← → para navegar · ESC para cerrar
      </div>
    </div>
  );
};

export const Rooms = () => {
  const { rooms, loading, error } = useRooms();
  
  const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0 });
  
  const openLightbox = (images, index) => {
    // Protección: asegurarnos de que hay imágenes antes de abrir
    if (images && images.length > 0) {
      setLightbox({ open: true, images, index });
    }
  };

  const closeLightbox = () => {
    setLightbox({ open: false, images: [], index: 0 });
  };

  const navigateLightbox = (direction) => {
    setLightbox(prev => ({
      ...prev,
      index: direction === 'next' 
        ? (prev.index + 1) % prev.images.length
        : (prev.index - 1 + prev.images.length) % prev.images.length
    }));
  };

  if (loading) {
    return (
      <section id="habitaciones" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-stone-600">Cargando habitaciones...</p>
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section id="habitaciones" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-600">Error al cargar habitaciones</p>
        </div>
      </section>
    );
  }

  const iconMap = {
    'WiFi': <Wifi size={18} />,
    'TV': <Tv size={18} />,
    'Parrillera': <Flame size={18} />,
    'Agua caliente': <Droplets size={18} />
  };

  return (
    <section id="habitaciones" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-stone-800 mb-4">Nuestras Habitaciones</h2>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Espacios cómodos y equipados para tu estadía perfecta
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* --- BLOQUE SEGURO INICIO --- */}
          {Array.isArray(rooms) && rooms.length > 0 ? (
            rooms.map((room, index) => (
              <Card key={room.id} className="overflow-hidden border-2 border-stone-200 hover:border-emerald-500 transition-all duration-300 hover:shadow-xl">
                {/* AQUI USAMOS EL NUEVO CARRUSEL */}
                <RoomCarousel 
                  images={room.images} 
                  roomName={room.name}
                  onImageClick={(imgIndex) => openLightbox(room.images, imgIndex)}
                />
                
                <div className="relative">
                  {/* Badge de precio movido un poco para no tapar flechas si es necesario, 
                      o puedes dejarlo dentro del carrusel si prefieres */}
                </div>
                
                <CardHeader>
                  <CardTitle className="text-2xl text-stone-800">Habitación {room.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-lg">
                    <Users className="text-emerald-600" size={20} />
                    <span>Capacidad: {room.capacity} personas</span>
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-stone-600 mb-4">{room.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-stone-800 mb-3">Características:</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Array.isArray(room.features) && room.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-stone-700">
                          <span className="text-emerald-600">
                            {iconMap[feature] || <Users size={18} />}
                          </span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-2 text-center p-12 border-2 border-dashed border-stone-300 rounded-lg">
              <p className="text-xl text-stone-500 mb-2">Cargando habitaciones...</p>
              <p className="text-xs text-stone-400">Si esto tarda mucho, hay un error de conexión.</p>
              {console.log("DEBUG - Datos recibidos en rooms:", rooms)}
            </div>
          )}
          {/* --- BLOQUE SEGURO FIN --- */}
        </div>
      </div>
      
      {/* Lightbox Modal */}
      {lightbox.open && (
        <Lightbox 
          images={lightbox.images}
          currentIndex={lightbox.index}
          onClose={closeLightbox}
          onNavigate={navigateLightbox}
        />
      )}
    </section>
  );
};