import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from './ui/button';

export const LocationSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-stone-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full">
              <MapPin className="text-emerald-700" size={20} />
              <span className="text-emerald-800 font-semibold">Encúéntranos</span>
            </div>
            
            <h2 className="text-4xl font-bold text-stone-800 leading-tight">
              En el Corazón del Valle
            </h2>
            
            <p className="text-xl text-stone-600 leading-relaxed">
              Ubicados en San Rafael de Tabay, Mérida, Venezuela. Un lugar privilegiado 
              rodeado de montañas y naturaleza, perfecto para tu descanso y recreación.
            </p>

            <div className="bg-white rounded-xl p-6 border-2 border-stone-200 shadow-lg">
              <h3 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
                <MapPin className="text-emerald-600" size={20} />
                Dirección
              </h3>
              <p className="text-stone-600 mb-4">
                Calle principal la capea baja<br />
                San Rafael de Tabay<br />
                Mérida, Venezuela
              </p>
              <Button
                onClick={() => window.open('https://maps.google.com/?q=Cabañas+AquaValle+San+Rafael+de+Tabay+Mérida', '_blank')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white w-full"
              >
                <Navigation className="mr-2" size={18} />
                Ver en Google Maps
              </Button>
            </div>
          </div>

          {/* Right side - Stylized Map Illustration */}
          <div className="relative">
            <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl p-8 shadow-2xl">
              <div className="relative aspect-square">
                {/* Stylized map background */}
                <div className="absolute inset-0 opacity-20">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <path d="M 20 100 Q 60 60, 100 100 T 180 100" stroke="currentColor" strokeWidth="2" fill="none" className="text-emerald-600" />
                    <path d="M 100 20 Q 60 60, 100 100 T 100 180" stroke="currentColor" strokeWidth="2" fill="none" className="text-emerald-600" />
                    <circle cx="60" cy="60" r="3" fill="currentColor" className="text-emerald-600" />
                    <circle cx="140" cy="60" r="3" fill="currentColor" className="text-emerald-600" />
                    <circle cx="60" cy="140" r="3" fill="currentColor" className="text-emerald-600" />
                    <circle cx="140" cy="140" r="3" fill="currentColor" className="text-emerald-600" />
                  </svg>
                </div>

                {/* Center pin */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Pulsing circle */}
                    <div className="absolute inset-0 -m-8">
                      <div className="w-full h-full rounded-full bg-emerald-500/20 animate-ping"></div>
                    </div>
                    
                    {/* Pin */}
                    <div className="relative bg-white rounded-full p-6 shadow-2xl border-4 border-emerald-600">
                      <MapPin className="text-emerald-600" size={48} />
                    </div>
                    
                    {/* Label */}
                    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-xl border-2 border-emerald-600 whitespace-nowrap">
                      <p className="font-bold text-emerald-700">Cabañas AquaValle</p>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 bg-white/80 rounded-full p-3 shadow-lg">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};