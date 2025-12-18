import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Users, Euro, Wifi, Tv, Flame, Droplets } from 'lucide-react';
import { useRooms } from '../hooks/useRooms';

export const Rooms = () => {
  const { rooms, loading, error } = useRooms();
  
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
          {rooms.map((room, index) => (
            <Card key={room.id} className="overflow-hidden border-2 border-stone-200 hover:border-emerald-500 transition-all duration-300 hover:shadow-xl">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={room.images[0]} 
                  alt={room.name}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <Badge className={`${index === 0 ? 'bg-amber-600' : 'bg-emerald-700'} text-white px-4 py-2 text-lg`}>
                    €{room.price}/noche
                  </Badge>
                </div>
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
                    {room.features.map((feature, idx) => (
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
          ))}
        </div>
      </div>
    </section>
  );
};