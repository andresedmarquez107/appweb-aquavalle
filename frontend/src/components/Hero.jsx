import React from 'react';
import { MapPin, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { useReservation } from '../context/ReservationContext';

export const Hero = () => {
  const { openWizard } = useReservation();

  return (
    <section id="inicio" className="relative pt-16 min-h-screen flex items-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-emerald-50 to-stone-50 z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6 animate-fade-in">
            <div className="inline-block">
              <span className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold">
                Centro Recreacional Premium
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-stone-800 leading-tight">
              Cabañas <span className="text-emerald-700">AquaValle</span>
            </h1>
            
            <p className="text-xl text-stone-600 leading-relaxed">
              Tu escape perfecto en San Rafael de Tabay, Mérida. Disfruta de nuestras instalaciones rodeadas de naturaleza y confort.
            </p>

            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 text-stone-700">
                <MapPin className="text-emerald-600" size={20} />
                <span className="text-sm">Calle principal la capea baja, San Rafael de Tabay, Mérida, Venezuela</span>
              </div>
              <div className="flex items-center gap-3 text-stone-700">
                <Phone className="text-emerald-600" size={20} />
                <span className="text-sm">+58 424 773 9434</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-6">
              <Button 
                onClick={openWizard}
                size="lg" 
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Reservar Ahora
              </Button>
              <Button 
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                size="lg" 
                variant="outline" 
                className="border-2 border-stone-300 text-stone-700 hover:bg-stone-50 px-8 py-6 text-lg transition-all duration-300"
              >
                Ver Más
              </Button>
            </div>
          </div>

          {/* Right image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
              <img 
                src="https://customer-assets.emergentagent.com/job_valley-cabins/artifacts/wo7fptz2_WhatsApp%20Image%202025-12-09%20at%208.00.01%20PM.jpeg"
                alt="Piscina Cabañas AquaValle"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 to-transparent"></div>
            </div>
            
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-stone-100">
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-700">€5</p>
                <p className="text-sm text-stone-600">Full Day por persona</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};