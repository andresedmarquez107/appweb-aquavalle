import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useReservation } from '../context/ReservationContext';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { openWizard } = useReservation();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button onClick={() => navigate('/')} className="flex items-center hover:opacity-80 transition-opacity">
              <img 
                src="https://customer-assets.emergentagent.com/job_valley-cabins/artifacts/5wzmkq3j_Dise%C3%B1o%20sin%20t%C3%ADtulo.png"
                alt="AquaValle Logo"
                className="h-16 w-auto"
              />
            </button>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => navigate('/')} 
              className={`transition-colors font-medium text-lg ${
                location.pathname === '/' ? 'text-emerald-700' : 'text-stone-700 hover:text-emerald-700'
              }`}
            >
              Inicio
            </button>
            <button 
              onClick={() => navigate('/servicios')} 
              className={`transition-colors font-medium text-lg ${
                location.pathname === '/servicios' ? 'text-emerald-700' : 'text-stone-700 hover:text-emerald-700'
              }`}
            >
              Servicios
            </button>
            <button 
              onClick={() => navigate('/habitaciones')} 
              className={`transition-colors font-medium text-lg ${
                location.pathname === '/habitaciones' ? 'text-emerald-700' : 'text-stone-700 hover:text-emerald-700'
              }`}
            >
              Habitaciones
            </button>
            <button 
              onClick={() => navigate('/reglas')} 
              className={`transition-colors font-medium text-lg ${
                location.pathname === '/reglas' ? 'text-emerald-700' : 'text-stone-700 hover:text-emerald-700'
              }`}
            >
              Reglas
            </button>
            <button 
              onClick={() => navigate('/contacto')} 
              className={`transition-colors font-medium text-lg ${
                location.pathname === '/contacto' ? 'text-emerald-700' : 'text-stone-700 hover:text-emerald-700'
              }`}
            >
              Contacto
            </button>
            <Button onClick={openWizard} className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-5 text-base">
              Reservar
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-stone-700 p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button onClick={() => { navigate('/'); setIsOpen(false); }} className="block w-full text-left px-4 py-3 text-stone-700 hover:bg-emerald-50 rounded text-lg">
              Inicio
            </button>
            <button onClick={() => { navigate('/servicios'); setIsOpen(false); }} className="block w-full text-left px-4 py-3 text-stone-700 hover:bg-emerald-50 rounded text-lg">
              Servicios
            </button>
            <button onClick={() => { navigate('/habitaciones'); setIsOpen(false); }} className="block w-full text-left px-4 py-3 text-stone-700 hover:bg-emerald-50 rounded text-lg">
              Habitaciones
            </button>
            <button onClick={() => { navigate('/reglas'); setIsOpen(false); }} className="block w-full text-left px-4 py-3 text-stone-700 hover:bg-emerald-50 rounded text-lg">
              Reglas
            </button>
            <button onClick={() => { navigate('/contacto'); setIsOpen(false); }} className="block w-full text-left px-4 py-3 text-stone-700 hover:bg-emerald-50 rounded text-lg">
              Contacto
            </button>
            <button onClick={() => { openWizard(); setIsOpen(false); }} className="block w-full text-left px-4 py-3 bg-emerald-700 text-white hover:bg-emerald-800 rounded text-lg">
              Reservar
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};