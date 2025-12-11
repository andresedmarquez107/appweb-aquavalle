import React from 'react';
import { Card, CardContent } from './ui/card';
import { Sun, Moon, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

export const QuickServices = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">Nuestros Servicios</h2>
          <p className="text-lg text-stone-600">
            Elige la experiencia perfecta para ti
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Full Day */}
          <Card className="border-2 border-stone-200 hover:border-amber-400 transition-all duration-300 hover:shadow-xl group">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-4 bg-amber-100 rounded-full group-hover:bg-amber-500 transition-colors duration-300">
                  <Sun className="text-amber-600 group-hover:text-white transition-colors duration-300" size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-stone-800 mb-2">Full Day</h3>
                  <p className="text-3xl font-bold text-amber-600 mb-3">€5 <span className="text-base font-normal text-stone-600">por persona</span></p>
                </div>
              </div>
              <p className="text-stone-600 mb-6">
                Disfruta desde las 9am hasta las 7pm de todas nuestras instalaciones recreativas.
              </p>
              <Button
                onClick={() => navigate('/servicios')}
                variant="outline"
                className="w-full border-2 border-amber-500 text-amber-600 hover:bg-amber-50 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300"
              >
                Ver Detalles
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </CardContent>
          </Card>

          {/* Hospedaje */}
          <Card className="border-2 border-stone-200 hover:border-emerald-400 transition-all duration-300 hover:shadow-xl group">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-4 bg-emerald-100 rounded-full group-hover:bg-emerald-600 transition-colors duration-300">
                  <Moon className="text-emerald-600 group-hover:text-white transition-colors duration-300" size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-stone-800 mb-2">Hospedaje</h3>
                  <p className="text-3xl font-bold text-emerald-600 mb-3">Desde €70 <span className="text-base font-normal text-stone-600">por noche</span></p>
                </div>
              </div>
              <p className="text-stone-600 mb-6">
                Alojamiento completo en habitaciones equipadas con todas las comodidades.
              </p>
              <Button
                onClick={() => navigate('/servicios')}
                variant="outline"
                className="w-full border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300"
              >
                Ver Detalles
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};