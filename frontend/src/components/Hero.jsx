import React from 'react';
import { MapPin, Phone, Star } from 'lucide-react';
import { Button } from './ui/button';
import { useReservation } from '../context/ReservationContext';
import { useNavigate } from 'react-router-dom';

export const Hero = () => {
  const { openWizard } = useReservation();
  const navigate = useNavigate();

  return (
    <section id="inicio" className="relative pt-16 min-h-screen flex items-center overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://customer-assets.emergentagent.com/job_valley-cabins/artifacts/wo7fptz2_WhatsApp%20Image%202025-12-09%20at%208.00.01%20PM.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/50 to-stone-900/70"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="space-y-8 animate-fade-in">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src="https://customer-assets.emergentagent.com/job_valley-cabins/artifacts/5wzmkq3j_Dise%C3%B1o%20sin%20t%C3%ADtulo.png"
              alt="AquaValle Logo"
              className="h-32 md:h-40 w-auto drop-shadow-2xl"
            />
          </div>
          
          {/* Welcome text */}
          <div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-4">
              Bienvenido a <br />
              <span className="text-emerald-400">Cabañas AquaValle</span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-emerald-200 font-light italic mb-8">
              "El descanso que mereces"
            </p>
          </div>

          {/* Description */}
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Disfruta de un escape perfecto en el corazón de San Rafael de Tabay, Mérida. 
            Rodeado de naturaleza, tranquilidad y confort.
          </p>

          {/* Features badges */}
          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 flex items-center gap-2">
              <Star className="text-amber-400" size={20} />
              <span className="text-white font-medium">Piscina Climatizada</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 flex items-center gap-2">
              <Star className="text-amber-400" size={20} />
              <span className="text-white font-medium">Áreas Recreativas</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 flex items-center gap-2">
              <Star className="text-amber-400" size={20} />
              <span className="text-white font-medium">Ambiente Familiar</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8 text-white/80">
            <div className="flex items-center gap-2">
              <MapPin className="text-emerald-400" size={20} />
              <span className="text-sm">San Rafael de Tabay, Mérida</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="text-emerald-400" size={20} />
              <a href="tel:+584247739434" className="text-sm hover:text-emerald-400 transition-colors">+58 424 773 9434</a>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-8">
            <Button 
              onClick={openWizard}
              size="lg" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-7 text-xl font-bold shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
            >
              Reservar Ahora
            </Button>
            <Button 
              onClick={() => navigate('/servicios')}
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-emerald-700 px-10 py-7 text-xl font-bold transition-all duration-300 hover:scale-105"
            >
              Ver Servicios
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};