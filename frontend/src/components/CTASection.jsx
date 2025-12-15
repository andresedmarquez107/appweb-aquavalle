import React from 'react';
import { Button } from './ui/button';
import { Calendar, Home, Shield, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReservation } from '../context/ReservationContext';

export const CTASection = () => {
  const { openWizard } = useReservation();
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            ¿Listo para tu Próxima Aventura?
          </h2>
          <p className="text-xl text-emerald-50 max-w-2xl mx-auto">
            Reserva ahora y disfruta de una experiencia inolvidable en medio de la naturaleza
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Home className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Instalaciones Premium</h3>
            <p className="text-emerald-50">Piscina climatizada, áreas recreativas y más</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Shield className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Ambiente Seguro</h3>
            <p className="text-emerald-50">Instalaciones bien mantenidas y supervisadas</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <MapPin className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Ubicación Ideal</h3>
            <p className="text-emerald-50">En San Rafael de Tabay, rodeado de naturaleza</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={openWizard}
            size="lg"
            className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <Calendar className="mr-2" size={24} />
            Reservar Ahora
          </Button>
          
          <Button
            onClick={() => navigate('/contacto')}
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-emerald-700 px-8 py-6 text-lg font-semibold transition-all duration-300"
          >
            Contactar
          </Button>
        </div>
      </div>
    </section>
  );
};