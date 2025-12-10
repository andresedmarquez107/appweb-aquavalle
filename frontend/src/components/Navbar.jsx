import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { ReservationWizard } from './ReservationWizard';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-emerald-800">Cabañas AquaValle</h1>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex space-x-6">
            <button onClick={() => scrollToSection('inicio')} className="text-stone-700 hover:text-emerald-700 transition-colors font-medium">
              Inicio
            </button>
            <button onClick={() => scrollToSection('servicios')} className="text-stone-700 hover:text-emerald-700 transition-colors font-medium">
              Servicios
            </button>
            <button onClick={() => scrollToSection('habitaciones')} className="text-stone-700 hover:text-emerald-700 transition-colors font-medium">
              Habitaciones
            </button>
            <button onClick={() => scrollToSection('galeria')} className="text-stone-700 hover:text-emerald-700 transition-colors font-medium">
              Galería
            </button>
            <button onClick={() => scrollToSection('reglas')} className="text-stone-700 hover:text-emerald-700 transition-colors font-medium">
              Reglas
            </button>
            <Button onClick={() => scrollToSection('reservar')} className="bg-emerald-700 hover:bg-emerald-800 text-white">
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
            <button onClick={() => scrollToSection('inicio')} className="block w-full text-left px-3 py-2 text-stone-700 hover:bg-emerald-50 rounded">
              Inicio
            </button>
            <button onClick={() => scrollToSection('servicios')} className="block w-full text-left px-3 py-2 text-stone-700 hover:bg-emerald-50 rounded">
              Servicios
            </button>
            <button onClick={() => scrollToSection('habitaciones')} className="block w-full text-left px-3 py-2 text-stone-700 hover:bg-emerald-50 rounded">
              Habitaciones
            </button>
            <button onClick={() => scrollToSection('galeria')} className="block w-full text-left px-3 py-2 text-stone-700 hover:bg-emerald-50 rounded">
              Galería
            </button>
            <button onClick={() => scrollToSection('reglas')} className="block w-full text-left px-3 py-2 text-stone-700 hover:bg-emerald-50 rounded">
              Reglas
            </button>
            <button onClick={() => scrollToSection('reservar')} className="block w-full text-left px-3 py-2 bg-emerald-700 text-white hover:bg-emerald-800 rounded">
              Reservar
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};