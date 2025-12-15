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
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <button onClick={() => navigate('/')} className="text-2xl font-bold text-emerald-800 hover:text-emerald-900 transition-colors">
              Cabañas AquaValle
            </button>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex space-x-6">
            <button 
              onClick={() => navigate('/')} 
              className={`transition-colors font-medium ${
                location.pathname === '/' ? 'text-emerald-700' : 'text-stone-700 hover:text-emerald-700'
              }`}
            >
              Inicio
            </button>
            <button 
              onClick={() => navigate('/servicios')} 
              className={`transition-colors font-medium ${
                location.pathname === '/servicios' ? 'text-emerald-700' : 'text-stone-700 hover:text-emerald-700'
              }`}
            >
              Servicios
            </button>
            <button 
              onClick={() => navigate('/habitaciones')} 
              className={`transition-colors font-medium ${
                location.pathname === '/habitaciones' ? 'text-emerald-700' : 'text-stone-700 hover:text-emerald-700'
              }`}
            >
              Habitaciones
            </button>
            <button 
              onClick={() => navigate('/reglas')} 
              className={`transition-colors font-medium ${
                location.pathname === '/reglas' ? 'text-emerald-700' : 'text-stone-700 hover:text-emerald-700'
              }`}
            >
              Reglas
            </button>
            <button 
              onClick={() => navigate('/contacto')} 
              className={`transition-colors font-medium ${
                location.pathname === '/contacto' ? 'text-emerald-700' : 'text-stone-700 hover:text-emerald-700'
              }`}
            >
              Contacto
            </button>
            <Button onClick={() => setIsWizardOpen(true)} className="bg-emerald-700 hover:bg-emerald-800 text-white">
              Reservar
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-stone-700">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button onClick={() => { navigate('/'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-stone-700 hover:bg-emerald-50 rounded">
              Inicio
            </button>
            <button onClick={() => { navigate('/servicios'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-stone-700 hover:bg-emerald-50 rounded">
              Servicios
            </button>
            <button onClick={() => { navigate('/habitaciones'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-stone-700 hover:bg-emerald-50 rounded">
              Habitaciones
            </button>
            <button onClick={() => { navigate('/reglas'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-stone-700 hover:bg-emerald-50 rounded">
              Reglas
            </button>
            <button onClick={() => { navigate('/contacto'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-stone-700 hover:bg-emerald-50 rounded">
              Contacto
            </button>
            <button onClick={() => { setIsWizardOpen(true); setIsOpen(false); }} className="block w-full text-left px-3 py-2 bg-emerald-700 text-white hover:bg-emerald-800 rounded">
              Reservar
            </button>
          </div>
        </div>
      )}
      
      <ReservationWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
    </nav>
  );
};