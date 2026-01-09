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
      description: 'Disfruta de todas nuestras instalaciones desde las 9am hasta las 7pm. Incluye piscina climatizada, parrillera, mesa de pool, ping pong, dominó y cancha de bolas criollas.',
      image: 'https://customer-assets.emergentagent.com/job_valley-cabins/artifacts/wo7fptz2_WhatsApp%20Image%202025-12-09%20at%208.00.01%20PM.jpeg',
      icon: Sun,
      color: 'from-amber-400 to-orange-500'
    },
    {
      id: 'hospedaje',
      title: 'Hospedaje',
      price: 'Desde €70 por noche',
      description: 'Alojamiento completo con check-in a las 2pm y check-out al mediodía. Habitaciones equipadas con cocina, agua caliente, TV, WiFi y acceso a todas las áreas recreativas.',
      image: 'https://customer-assets.emergentagent.com/job_valley-cabins/artifacts/16fe3e80_WhatsApp%20Image%202025-12-09%20at%208.00.01%20PM%20%283%29.jpeg',
      icon: Moon,
      color: 'from-emerald-500 to-teal-600'
    }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6 py-6">
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
            <div className="relative h-80 overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  isHovered ? 'grayscale-0 scale-110' : 'grayscale scale-100'
                }`}
              />
              
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${service.color} transition-opacity duration-300 pointer-events-none ${
                isHovered ? 'opacity-0' : 'opacity-40'
              }`}></div>
              
              {/* Icon */}
              <div className={`absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg transition-transform duration-300 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}>
                <Icon className={`${
                  service.id === 'fullday' ? 'text-amber-600' : 'text-emerald-600'
                }`} size={28} />
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-stone-800 mb-2">{service.title}</h3>
              <p className={`text-lg font-semibold mb-4 ${
                service.id === 'fullday' ? 'text-amber-600' : 'text-emerald-600'
              }`}>
                {service.price}
              </p>
              
              {/* Description appears on hover */}
              <div className={`transition-all duration-300 overflow-hidden ${
                isHovered ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
              
              {/* Click indicator */}
              <div className={`mt-4 text-center transition-all duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}>
                <span className={`inline-block px-4 py-2 rounded-full text-white font-semibold bg-gradient-to-r ${service.color}`}>
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