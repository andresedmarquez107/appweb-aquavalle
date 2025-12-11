import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MapPin, Phone, Mail, Clock, ArrowLeft, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ContactPage = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Volver al Inicio
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-stone-800 mb-4">Ubicación y Contacto</h1>
          <p className="text-xl text-stone-600">
            Estamos ubicados en San Rafael de Tabay, Mérida, Venezuela
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Info */}
          <Card className="border-2 border-emerald-200">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
              <CardTitle className="text-2xl text-stone-800">Información de Contacto</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-100 rounded-full">
                  <MapPin className="text-emerald-700" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800 mb-1">Dirección</h3>
                  <p className="text-stone-600">
                    Calle principal la capea baja<br />
                    San Rafael de Tabay<br />
                    Mérida, Venezuela
                  </p>
                  <a
                    href="https://maps.google.com/?q=Cabañas+AquaValle+San+Rafael+de+Tabay+Mérida"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mt-2 text-sm font-medium"
                  >
                    <Navigation size={16} />
                    Ver en Google Maps
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-100 rounded-full">
                  <Phone className="text-emerald-700" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800 mb-1">Teléfono</h3>
                  <a href="tel:+584247739434" className="text-stone-600 hover:text-emerald-700">
                    +58 424 773 9434
                  </a>
                  <p className="text-sm text-stone-500 mt-1">
                    También disponible por WhatsApp
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-100 rounded-full">
                  <Mail className="text-emerald-700" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800 mb-1">Correo Electrónico</h3>
                  <a href="mailto:info@aquavalle.com" className="text-stone-600 hover:text-emerald-700">
                    info@aquavalle.com
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hours */}
          <Card className="border-2 border-amber-200">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50">
              <CardTitle className="text-2xl text-stone-800">Horarios de Atención</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Full Day Hours */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 rounded-full">
                  <Clock className="text-amber-700" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800 mb-2">Full Day</h3>
                  <div className="space-y-1 text-stone-600">
                    <p className="flex justify-between">
                      <span>Entrada:</span>
                      <span className="font-medium">9:00 AM</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Salida:</span>
                      <span className="font-medium">7:00 PM</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Hospedaje Hours */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-100 rounded-full">
                  <Clock className="text-emerald-700" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800 mb-2">Hospedaje</h3>
                  <div className="space-y-1 text-stone-600">
                    <p className="flex justify-between">
                      <span>Check-in:</span>
                      <span className="font-medium">2:00 PM</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Check-out:</span>
                      <span className="font-medium">12:00 PM</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-stone-600">
                  <strong>Nota:</strong> Recomendamos hacer reservas con anticipación para garantizar disponibilidad.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <Card className="border-2 border-stone-200">
          <CardHeader>
            <CardTitle className="text-2xl text-stone-800">Cómo Llegar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full bg-stone-200 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3933.1234567890!2d-71.234567!3d8.567890!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMzQnMDQuNCJOIDcxwrAxNCcwNC40Ilc!5e0!3m2!1ses!2sve!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Cabañas AquaValle"
              ></iframe>
            </div>
            <p className="text-sm text-stone-600 mt-4">
              Estamos ubicados en la vía principal de San Rafael de Tabay, fácil acceso desde la ciudad de Mérida.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};