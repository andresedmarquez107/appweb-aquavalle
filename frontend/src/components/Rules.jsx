import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { rules } from '../mock';
import { 
  AlertCircle, Clock, Shield, Heart, TreePine, Ban, 
  Waves, ShowerHead, UtensilsCrossed, Volume2, AlertTriangle 
} from 'lucide-react';

// Reglas de la piscina
const poolRules = [
  {
    category: 'Horario',
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    rules: [
      'La piscina está disponible de 8:00 a.m. a 10:00 p.m.',
      'Fuera de este horario, el acceso está prohibido por seguridad.',
      'A partir de las 8:00 p.m. se debe moderar el ruido en la piscina y sus alrededores, de no moderar el ruido la piscina se cerrará inmediatamente.'
    ]
  },
  {
    category: 'Normas de Seguridad',
    icon: Shield,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    rules: [
      'Niños menores de 12 años deben estar supervisados por un adulto en todo momento.',
      'No se permite correr, empujar o jugar bruscamente dentro o alrededor de la piscina.',
      'No está permitido zambullirse o realizar clavados en zonas de poca profundidad.'
    ]
  },
  {
    category: 'Normas de Higiene y Salud',
    icon: Heart,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    rules: [
      'Es obligatorio ducharse antes de ingresar a la piscina.',
      'No se permite el ingreso de personas con heridas abiertas, infecciones en la piel o enfermedades contagiosas.',
      'Se prohíbe orinar o escupir en la piscina.',
      'No se permite el uso de cremas o aceites bronceadores sin antes ducharse, ya que pueden afectar la calidad del agua.'
    ]
  },
  {
    category: 'Cuidado del Entorno',
    icon: TreePine,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    rules: [
      'No se permite consumir alimentos ni bebidas dentro de la piscina.',
      'Se prohíben envases de vidrio en el área de la piscina.',
      'No se permite fumar dentro del área de la piscina.',
      'Mantenga el área limpia, deposite la basura en los recipientes adecuados.',
      'No extraer agua de la piscina con cubetas u otros recipientes.',
      'Se requiere traje de baño apropiado para ingresar a la piscina. No se permite ropa de calle dentro del agua.',
      'No se permite el uso de equipos de sonido alrededor del área de la piscina.'
    ]
  },
  {
    category: 'Responsabilidad del Huésped',
    icon: AlertTriangle,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    rules: [
      'El establecimiento no se hace responsable por objetos perdidos o daños personales por incumplimiento de estas normas.',
      'El mal uso de la piscina puede conllevar a la restricción de acceso sin derecho a reembolso.'
    ]
  }
];

export const Rules = () => {
  return (
    <section id="reglas" className="py-20 bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertCircle className="text-emerald-700" size={32} />
            <h2 className="text-4xl font-bold text-stone-800">Reglas de Estadía</h2>
          </div>
          <p className="text-xl text-stone-600">
            Para garantizar una experiencia agradable para todos, te pedimos seguir estas normas
          </p>
        </div>

        {/* Reglas Generales */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200 mb-8">
          <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
            <AlertCircle className="text-emerald-700" size={24} />
            Normas Generales
          </h3>
          <Accordion type="single" collapsible className="w-full">
            {rules.map((rule, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left hover:text-emerald-700 transition-colors">
                  <span className="font-semibold text-stone-800">{rule.title}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-stone-600 leading-relaxed">{rule.description}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Reglas de la Piscina */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200">
          <h3 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
            <Waves className="text-blue-600" size={24} />
            Reglas para el Uso de la Piscina
          </h3>
          
          <div className="space-y-6">
            {poolRules.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <div key={index} className={`${section.bgColor} rounded-lg p-4 border`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 bg-white rounded-lg shadow-sm`}>
                      <IconComponent className={section.color} size={24} />
                    </div>
                    <h4 className={`font-bold text-lg ${section.color.replace('text-', 'text-').replace('-600', '-800').replace('-500', '-700')}`}>
                      {section.category}
                    </h4>
                  </div>
                  <ul className="space-y-2 ml-12">
                    {section.rules.map((rule, ruleIndex) => (
                      <li key={ruleIndex} className="flex items-start gap-2 text-stone-700">
                        <span className={`${section.color} mt-1.5`}>•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 font-medium flex items-center gap-2">
              <Ban size={18} />
              El incumplimiento de estas normas puede conllevar sanciones, incluyendo la expulsión sin derecho a reembolso.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
