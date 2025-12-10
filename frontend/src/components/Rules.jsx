import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { rules } from '../mock';
import { AlertCircle } from 'lucide-react';

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

        <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200">
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

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-900 font-medium">
              ⚠️ El incumplimiento de estas normas puede conllevar sanciones, incluyendo la expulsión sin derecho a reembolso.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};