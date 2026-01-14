import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Sun, Moon } from 'lucide-react';

export const ServiceSelector = ({ onSelect }) => {
  const [hoveredService, setHoveredService] = useState(null);

  const services = [
    {
      id: 'fullday',
      title: 'Full Day',
      price: '€5 por persona',
      description: 'Disfruta de todas nuestras instalaciones desde las 9am hasta las 7pm.',
      image: 'https://customer-assets.emergentagent.com/job_valley-cabins/artifacts/wo7fptz2_WhatsApp%20Image%202025-12-09%20at%208.00.01%20PM.jpeg',
      icon: Sun,
      color: 'from-amber-400 to-orange-500'
    },
    {
      id: 'hospedaje',
      title: 'Hospedaje',
      price: 'Desde €70/noche',
      description: 'Alojamiento completo con habitaciones equipadas y acceso a todas las áreas.',
      image: 'https://customer-assets.emergentagent.com/job_valley-cabins/artifacts/16fe3e80_WhatsApp%20Image%202025-12-09%20at%208.00.01%20PM%20%283%29.jpeg',
      icon: Moon,
      color: 'from-emerald-500 to-teal-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6 py-2 sm:py-6">
      {services.map((service) => {
        const Icon = service.icon;
        const isHovered = hoveredService === service.id;
        
        return (
          <Card
            key={service.id}
            className="relative overflow-hidden cursor-pointer border-2 hover:border-emerald-500 transition-all duration-300 group"
            onMouseEnter={() => setHoveredService(service.id)}
            onMouseLeave={() => setHoveredService(null)}
            onClick={() => onSelect(service.id)}
          >
            {/* Image with grayscale effect */}
            <div className="relative h-32 sm:h-80 overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  isHovered ? 'grayscale-0 scale-110' : 'grayscale-0 sm:grayscale scale-100'
                }`}
              />
              
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${service.color} transition-opacity duration-300 pointer-events-none opacity-30 sm:${
                isHovered ? 'opacity-0' : 'opacity-40'
              }`}></div>
              
              {/* Icon */}
              <div className={`absolute top-2 right-2 sm:top-4 sm:right-4 p-2 sm:p-3 bg-white rounded-full shadow-lg transition-transform duration-300 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}>
                <Icon className={`${
                  service.id === 'fullday' ? 'text-amber-600' : 'text-emerald-600'
                }`} size={20} />
              </div>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-6">
              <h3 className="text-base sm:text-2xl font-bold text-stone-800 mb-1">{service.title}</h3>
              <p className={`text-sm sm:text-lg font-semibold ${
                service.id === 'fullday' ? 'text-amber-600' : 'text-emerald-600'
              }`}>
                {service.price}
              </p>
              
              {/* Description - hidden on mobile, visible on hover for desktop */}
              <div className={`hidden sm:block transition-all duration-300 overflow-hidden ${
                isHovered ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'
              }`}>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
              
              {/* Click indicator - always visible on mobile */}
              <div className={`mt-3 text-center sm:transition-all sm:duration-300 ${
                isHovered ? 'sm:opacity-100' : 'sm:opacity-0'
              }`}>
                <span className={`inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-white text-xs sm:text-sm font-semibold bg-gradient-to-r ${service.color}`}>
                  Seleccionar
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
