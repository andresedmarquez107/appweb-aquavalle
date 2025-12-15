import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { useReservation } from '../context/ReservationContext';

export const FloatingReserveButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { openWizard } = useReservation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Button
      onClick={openWizard}
      className={`fixed bottom-8 right-8 z-50 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-6 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
      size="lg"
    >
      <Calendar className="mr-2" size={24} />
      <span className="font-bold text-lg">Reservar Ahora</span>
    </Button>
  );
};