import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { CheckCircle, Moon, Sun } from 'lucide-react';
import { hospedajeIncludes, fulldayIncludes, FULLDAY_PRICE } from '../mock';

export const Services = () => {
  return (
    <section id="servicios" className="py-20 bg-gradient-to-b from-white to-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-stone-800 mb-4">Nuestros Servicios</h2>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Ofrecemos dos modalidades para que disfrutes de nuestras instalaciones
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Full Day */}
          <Card className="border-2 border-stone-200 hover:border-emerald-500 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="bg-gradient-to-br from-amber-50 to-yellow-50 pb-8">
              <div className="flex items-center justify-center w-16 h-16 bg-amber-500 rounded-full mb-4 mx-auto">
                <Sun className="text-white" size={32} />
              </div>
              <CardTitle className="text-3xl text-center text-stone-800">Full Day</CardTitle>
              <CardDescription className="text-center text-lg">
                <span className="text-3xl font-bold text-amber-600">€{FULLDAY_PRICE}</span>
                <span className="text-stone-600"> por persona</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {fulldayIncludes.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-amber-600 flex-shrink-0 mt-1" size={20} />
                    <span className="text-stone-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-stone-700">
                  <strong>Capacidad máxima:</strong> 20 personas por día
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Hospedaje */}
          <Card className="border-2 border-stone-200 hover:border-emerald-500 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50 pb-8">
              <div className="flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-full mb-4 mx-auto">
                <Moon className="text-white" size={32} />
              </div>
              <CardTitle className="text-3xl text-center text-stone-800">Hospedaje</CardTitle>
              <CardDescription className="text-center text-lg">
                <span className="text-stone-600">Desde </span>
                <span className="text-3xl font-bold text-emerald-700">€70</span>
                <span className="text-stone-600"> por noche</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {hospedajeIncludes.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                    <span className="text-stone-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm text-stone-700">
                  <strong>2 habitaciones disponibles:</strong> Pacho (7 personas) y D'Jesus (8 personas)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};