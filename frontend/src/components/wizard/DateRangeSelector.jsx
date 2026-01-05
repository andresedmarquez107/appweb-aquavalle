import React, { useState, useMemo } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

export const DateRangeSelector = ({ serviceType, onSelect, onBack, roomIds, preloadedUnavailableDates = [] }) => {
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
  
  // Use preloaded dates directly - no need to fetch again
  const unavailableDates = preloadedUnavailableDates;

  // For hospedaje: find the first unavailable date after check-in
  // This will be the maximum allowed check-out date
  const maxCheckoutDate = useMemo(() => {
    if (serviceType !== 'hospedaje' || !dateRange.from || unavailableDates.length === 0) {
      return null;
    }
    
    const checkInStr = format(dateRange.from, 'yyyy-MM-dd');
    
    // Sort unavailable dates and find the first one after check-in
    const sortedUnavailable = [...unavailableDates].sort();
    const firstBlockedAfterCheckin = sortedUnavailable.find(d => d > checkInStr);
    
    if (firstBlockedAfterCheckin) {
      // The checkout can be ON the blocked date (guest leaves that day)
      // So max checkout is the day AFTER the first blocked date
      const blockedDate = new Date(firstBlockedAfterCheckin + 'T00:00:00');
      return addDays(blockedDate, 1);
    }
    
    return null;
  }, [dateRange.from, unavailableDates, serviceType]);

  const handleContinue = () => {
    if (!dateRange.from) {
      toast.error('Por favor selecciona al menos una fecha');
      return;
    }

    // For full day, only one date is needed
    if (serviceType === 'fullday') {
      onSelect({ from: dateRange.from, to: dateRange.from });
    } else {
      // For hospedaje, we need a range
      if (!dateRange.to) {
        toast.error('Por favor selecciona la fecha de salida');
        return;
      }
      onSelect(dateRange);
    }
  };

  const disabledDates = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable past dates
    if (date < today) return true;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // For hospedaje mode with a selected check-in date
    if (serviceType === 'hospedaje' && dateRange.from) {
      const checkInStr = format(dateRange.from, 'yyyy-MM-dd');
      
      // If this date is AFTER our check-in date, it could be a checkout date
      if (dateStr > checkInStr) {
        // Allow selecting dates up to and including the first blocked date as checkout
        // But disable dates AFTER the first blocked date
        if (maxCheckoutDate) {
          return date >= maxCheckoutDate;
        }
        // No blocked dates ahead, allow all future dates
        return false;
      }
    }
    
    // For check-in selection or fullday: disable unavailable dates
    if (unavailableDates.length > 0) {
      return unavailableDates.includes(dateStr);
    }
    
    return false;
  };

  return (
    <div className="py-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
          <CalendarIcon className="text-emerald-700" size={32} />
        </div>
        <h3 className="text-xl font-bold text-stone-800 mb-2">
          {serviceType === 'fullday' 
            ? 'Selecciona el día de tu visita' 
            : 'Selecciona las fechas de tu estadía'
          }
        </h3>
        <p className="text-stone-600">
          {serviceType === 'fullday'
            ? unavailableDates.length > 0
              ? 'Las fechas en gris no tienen cupos disponibles'
              : 'Elige un día para disfrutar del Full Day'
            : unavailableDates.length > 0
              ? 'Las fechas en gris no están disponibles'
              : 'Selecciona tus fechas de entrada y salida'
          }
        </p>
      </div>

      <Card className="border-2 border-stone-200 p-6">
        <div className="flex justify-center">
          <Calendar
            mode={serviceType === 'fullday' ? 'single' : 'range'}
            selected={serviceType === 'fullday' ? dateRange.from : dateRange}
            onSelect={(value) => {
              if (serviceType === 'fullday') {
                setDateRange({ from: value, to: value });
              } else {
                setDateRange(value || { from: undefined, to: undefined });
              }
            }}
            disabled={disabledDates}
            numberOfMonths={2}
            locale={es}
            className="rounded-md"
          />
        </div>

        {/* Date display */}
        {dateRange.from && (
          <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-600 mb-1">
                  {serviceType === 'fullday' ? 'Fecha seleccionada' : 'Check-in'}
                </p>
                <p className="font-semibold text-stone-800">
                  {format(dateRange.from, 'dd MMMM yyyy', { locale: es })}
                </p>
                {serviceType === 'hospedaje' && <p className="text-xs text-stone-500 mt-1">2:00 PM</p>}
              </div>
              
              {serviceType === 'hospedaje' && dateRange.to && (
                <>
                  <div className="text-stone-400">→</div>
                  <div className="text-right">
                    <p className="text-sm text-stone-600 mb-1">Check-out</p>
                    <p className="font-semibold text-stone-800">
                      {format(dateRange.to, 'dd MMMM yyyy', { locale: es })}
                    </p>
                    <p className="text-xs text-stone-500 mt-1">12:00 PM</p>
                  </div>
                </>
              )}
            </div>
            
            {serviceType === 'hospedaje' && dateRange.from && dateRange.to && (
              <div className="mt-3 pt-3 border-t border-emerald-200">
                <p className="text-sm text-stone-600">
                  Total: <span className="font-semibold">
                    {Math.ceil((dateRange.to - dateRange.from) / (1000 * 60 * 60 * 24))} noche{Math.ceil((dateRange.to - dateRange.from) / (1000 * 60 * 60 * 24)) > 1 ? 's' : ''}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
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
          disabled={!dateRange.from || (serviceType === 'hospedaje' && !dateRange.to)}
          className="bg-emerald-700 hover:bg-emerald-800 text-white flex-1"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};