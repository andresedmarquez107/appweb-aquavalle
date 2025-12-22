import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Users, Plus, Minus, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { MAX_FULLDAY_CAPACITY } from '../../mock';
import { toast } from 'sonner';
import { availabilityAPI } from '../../services/api';
import { format, addMonths } from 'date-fns';

export const GuestCounter = ({ onSelect, onBack }) => {
  const [guests, setGuests] = useState(1);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  const increment = () => {
    if (guests < MAX_FULLDAY_CAPACITY) {
      setGuests(guests + 1);
    } else {
      toast.error(`La capacidad máxima es de ${MAX_FULLDAY_CAPACITY} personas por día`);
    }
  };

  const decrement = () => {
    if (guests > 1) {
      setGuests(guests - 1);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 1 && value <= MAX_FULLDAY_CAPACITY) {
      setGuests(value);
    } else if (value > MAX_FULLDAY_CAPACITY) {
      toast.error(`La capacidad máxima es de ${MAX_FULLDAY_CAPACITY} personas por día`);
      setGuests(MAX_FULLDAY_CAPACITY);
    }
  };

  const handleContinue = async () => {
    if (guests < 1) {
      toast.error('Debes ingresar al menos 1 persona');
      return;
    }
    
    // Preload fullday availability before continuing
    setLoadingAvailability(true);
    try {
      const today = new Date();
      const threeMonthsLater = addMonths(today, 3);
      const startDate = format(today, 'yyyy-MM-dd');
      const endDate = format(threeMonthsLater, 'yyyy-MM-dd');
      
      const result = await availabilityAPI.getFulldayAvailability(startDate, endDate, guests);
      onSelect(guests, result.unavailable_dates || []);
    } catch (error) {
      console.error('Error loading availability:', error);
      // Continue anyway without preloaded dates
      onSelect(guests, []);
    } finally {
      setLoadingAvailability(false);
    }
  };

  const totalPrice = guests * 5;

  return (
    <div className="py-6">
      <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500 rounded-full mb-4">
            <Users className="text-white" size={40} />
          </div>
          <h3 className="text-2xl font-bold text-stone-800 mb-2">¿Cuántas personas asistirán?</h3>
          <p className="text-stone-600">Precio: €5 por persona</p>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <Button
            onClick={decrement}
            disabled={guests <= 1}
            variant="outline"
            size="lg"
            className="w-16 h-16 rounded-full border-2 border-amber-600 hover:bg-amber-100"
          >
            <Minus className="text-amber-600" size={24} />
          </Button>

          <div className="text-center min-w-[120px]">
            <Input
              type="number"
              value={guests}
              onChange={handleInputChange}
              min="1"
              max={MAX_FULLDAY_CAPACITY}
              className="text-5xl font-bold text-center border-2 border-amber-300 h-24 text-amber-700"
            />
            <Label className="text-stone-600 text-sm mt-2">personas</Label>
          </div>

          <Button
            onClick={increment}
            disabled={guests >= MAX_FULLDAY_CAPACITY}
            variant="outline"
            size="lg"
            className="w-16 h-16 rounded-full border-2 border-amber-600 hover:bg-amber-100"
          >
            <Plus className="text-amber-600" size={24} />
          </Button>
        </div>

        {/* Price summary */}
        <div className="bg-white rounded-lg p-6 mb-6 border-2 border-amber-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-stone-600">Total a pagar</p>
              <p className="text-sm text-stone-500">{guests} persona{guests > 1 ? 's' : ''} × €5</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-amber-600">€{totalPrice}</p>
            </div>
          </div>
        </div>

        {/* Capacity warning */}
        <div className="bg-amber-100 border border-amber-400 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-amber-700 flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="text-sm text-amber-900">
              <strong>Capacidad máxima:</strong> {MAX_FULLDAY_CAPACITY} personas por día
            </p>
            <p className="text-xs text-amber-800 mt-1">
              Disponibilidad sujeta a confirmación según otras reservas del mismo día.
            </p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-between gap-4 mt-6">
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
          className="bg-amber-600 hover:bg-amber-700 text-white flex-1"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};