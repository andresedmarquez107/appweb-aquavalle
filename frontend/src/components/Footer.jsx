import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-stone-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold text-emerald-400 mb-4">Cabañas AquaValle</h3>
            <p className="text-stone-300 leading-relaxed">
              Tu escape perfecto en San Rafael de Tabay, Mérida. Disfruta de la naturaleza y el confort en un solo lugar.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-emerald-400">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="text-emerald-400 flex-shrink-0 mt-1" size={18} />
                <span className="text-stone-300 text-sm">
                  Calle principal la capea baja, San Rafael de Tabay, Mérida, Venezuela
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-emerald-400 flex-shrink-0" size={18} />
                <a href="https://wa.me/584247739434?text=Hola%20Cabañas%20AquaValle,%20quisiera%20más%20información" className="text-stone-300 hover:text-emerald-400 transition-colors text-sm">
                  +58 424 773 9434
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-emerald-400 flex-shrink-0" size={18} />
                <span className="text-stone-300 text-sm">info@aquavalle.com</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-emerald-400">Horarios</h4>
            <div className="space-y-2 text-stone-300 text-sm">
              <p><strong>Full Day:</strong></p>
              <p>9:00 AM - 7:00 PM</p>
              <p className="pt-2"><strong>Hospedaje:</strong></p>
              <p>Check-in: 2:00 PM</p>
              <p>Check-out: 12:00 PM</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-stone-700 text-center">
          <p className="text-stone-400 text-sm">
            © {new Date().getFullYear()} Cabañas AquaValle. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};