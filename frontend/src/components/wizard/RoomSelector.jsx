import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Users, Euro, ArrowLeft } from 'lucide-react';
import { roomsAPI } from '../../services/api';
import { toast } from 'sonner';

export const RoomSelector = ({ onSelect, onBack }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleContinue = () => {
    if (selectedRooms.length === 0) {
      toast.error('Por favor selecciona al menos una habitación');
      return;
    }
    onSelect(selectedRooms);
  };

  const totalPrice = selectedRooms.reduce((sum, roomId) => {
    const room = mockRooms.find(r => r.id === roomId);
    return sum + (room?.price || 0);
  }, 0);

  const totalCapacity = selectedRooms.reduce((sum, roomId) => {
    const room = mockRooms.find(r => r.id === roomId);
    return sum + (room?.capacity || 0);
  }, 0);

  return (
    <div className="py-4">
      <p className="text-stone-600 mb-6 text-center">Puedes seleccionar una o ambas habitaciones</p>
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {mockRooms.map((room) => {
          const isSelected = selectedRooms.includes(room.id);
          
          return (
            <Card
              key={room.id}
              className={`cursor-pointer transition-all duration-300 ${
                isSelected 
                  ? 'border-2 border-emerald-600 shadow-lg scale-105' 
                  : 'border-2 border-stone-200 hover:border-emerald-400'
              }`}
              onClick={() => toggleRoom(room.id)}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={room.images[0]}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Checkbox overlay */}
                <div className="absolute top-4 right-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-emerald-600' : 'bg-white/80'
                  }`}>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleRoom(room.id)}
                      className="pointer-events-none"
                    />
                  </div>
                </div>

                {/* Price badge */}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-amber-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2">
                    <Euro size={18} />
                    <span>{room.price}/noche</span>
                  </div>
                </div>
              </div>

              <CardContent className="pt-4">
                <h3 className="text-xl font-bold text-stone-800 mb-2">Habitación {room.name}</h3>
                <div className="flex items-center gap-2 text-stone-600 mb-3">
                  <Users className="text-emerald-600" size={20} />
                  <span>Capacidad: {room.capacity} personas</span>
                </div>
                <p className="text-sm text-stone-600">{room.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      {selectedRooms.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-stone-800">
                {selectedRooms.length} habitación{selectedRooms.length > 1 ? 'es' : ''} seleccionada{selectedRooms.length > 1 ? 's' : ''}
              </p>
              <p className="text-sm text-stone-600">Capacidad total: {totalCapacity} personas</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-700">€{totalPrice}</p>
              <p className="text-xs text-stone-600">por noche</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Atrás
        </Button>
        
        <Button
          onClick={handleContinue}
          disabled={selectedRooms.length === 0}
          className="bg-emerald-700 hover:bg-emerald-800 text-white flex-1"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};