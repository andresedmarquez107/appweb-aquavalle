import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Users, Euro, ArrowLeft, Loader2 } from 'lucide-react';
import { roomsAPI, availabilityAPI } from '../../services/api';
import { toast } from 'sonner';
import { format, addMonths } from 'date-fns';

export const RoomSelector = ({ onSelect, onBack }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await roomsAPI.getAll();
        setRooms(data);
      } catch (error) {
        toast.error('Error al cargar habitaciones');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const toggleRoom = (roomId) => {
    if (selectedRooms.includes(roomId)) {
      setSelectedRooms(selectedRooms.filter(id => id !== roomId));
    } else {
      setSelectedRooms([...selectedRooms, roomId]);
    }
  };

  const handleContinue = async () => {
    if (selectedRooms.length === 0) {
      toast.error('Por favor selecciona al menos una habitación');
      return;
    }
    
    setLoadingAvailability(true);
    try {
      const today = new Date();
      const threeMonthsLater = addMonths(today, 3);
      const startDate = format(today, 'yyyy-MM-dd');
      const endDate = format(threeMonthsLater, 'yyyy-MM-dd');
      
      const availabilityPromises = selectedRooms.map(roomId =>
        availabilityAPI.getRoomAvailability(roomId, startDate, endDate)
      );
      
      const results = await Promise.all(availabilityPromises);
      
      const allUnavailable = new Set();
      results.forEach(result => {
        result.unavailable_dates.forEach(date => allUnavailable.add(date));
      });
      
      onSelect(selectedRooms, Array.from(allUnavailable));
    } catch (error) {
      console.error('Error preloading availability:', error);
      onSelect(selectedRooms, []);
    } finally {
      setLoadingAvailability(false);
    }
  };

  const totalPrice = selectedRooms.reduce((sum, roomId) => {
    const room = rooms.find(r => r.id === roomId);
    return sum + (room?.price_per_night || 0);
  }, 0);

  const totalCapacity = selectedRooms.reduce((sum, roomId) => {
    const room = rooms.find(r => r.id === roomId);
    return sum + (room?.capacity || 0);
  }, 0);

  if (loading) {
    return (
      <div className="py-8 text-center">
        <p className="text-stone-600">Cargando habitaciones...</p>
      </div>
    );
  }

  return (
    <div className="py-2 sm:py-4">
      <p className="text-stone-600 mb-4 text-center text-sm sm:text-base">Puedes seleccionar una o ambas habitaciones</p>
      
      {/* Rooms grid - more compact on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-4">
        {rooms.map((room) => {
          const isSelected = selectedRooms.includes(room.id);
          
          return (
            <Card
              key={room.id}
              className={`cursor-pointer transition-all duration-300 ${
                isSelected 
                  ? 'border-2 border-emerald-600 shadow-lg sm:scale-105' 
                  : 'border-2 border-stone-200 hover:border-emerald-400'
              }`}
              onClick={() => toggleRoom(room.id)}
            >
              {/* Horizontal layout on mobile, vertical on desktop */}
              <div className="flex sm:flex-col">
                {/* Image */}
                <div className="relative w-28 sm:w-full h-28 sm:h-48 flex-shrink-0 overflow-hidden">
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    className="w-full h-full object-cover rounded-l-lg sm:rounded-l-none sm:rounded-t-lg"
                  />
                  
                  {/* Checkbox overlay */}
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-emerald-600' : 'bg-white/80'
                    }`}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleRoom(room.id)}
                        className="pointer-events-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-xl font-bold text-stone-800 mb-1">Habitación {room.name}</h3>
                    <div className="flex items-center gap-1 text-stone-600 text-xs sm:text-sm">
                      <Users className="text-emerald-600" size={16} />
                      <span>{room.capacity} personas</span>
                    </div>
                  </div>
                  
                  {/* Price - always visible */}
                  <div className="mt-2">
                    <div className="inline-flex items-center gap-1 bg-amber-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold">
                      <Euro size={14} />
                      <span>{room.price_per_night}/noche</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Summary - sticky on mobile */}
      <div className="sticky bottom-0 bg-white pt-2 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:static border-t sm:border-t-0 border-stone-200">
        {selectedRooms.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 sm:p-4 mb-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-stone-800 text-sm sm:text-base">
                  {selectedRooms.length} habitación{selectedRooms.length > 1 ? 'es' : ''}
                </p>
                <p className="text-xs sm:text-sm text-stone-600">Capacidad: {totalCapacity} personas</p>
              </div>
              <div className="text-right">
                <p className="text-xl sm:text-2xl font-bold text-emerald-700">€{totalPrice}</p>
                <p className="text-xs text-stone-600">por noche</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={loadingAvailability}
            className="flex items-center gap-1 text-sm"
            size="sm"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Atrás</span>
          </Button>
          
          <Button
            onClick={handleContinue}
            disabled={selectedRooms.length === 0 || loadingAvailability}
            className="bg-emerald-700 hover:bg-emerald-800 text-white flex-1 text-sm"
            size="sm"
          >
            {loadingAvailability ? (
              <>
                <Loader2 className="animate-spin mr-1" size={16} />
                <span className="hidden sm:inline">Cargando...</span>
                <span className="sm:hidden">...</span>
              </>
            ) : (
              'Continuar'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
