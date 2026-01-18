import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ArrowLeft, User, CreditCard, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';

export const PersonalDataForm = ({ onSubmit, onBack, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    idDocument: initialData?.idDocument || '',
    email: initialData?.email || '',
    phone: initialData?.phone || ''
  });

  // Función para capitalizar cada palabra (primera letra mayúscula)
  const capitalizeWords = (text) => {
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Función para filtrar solo letras y espacios (sin números)
  const onlyLetters = (text) => {
    return text.replace(/[0-9]/g, '');
  };

  // Función para filtrar solo números
  const onlyNumbers = (text) => {
    return text.replace(/[^0-9]/g, '');
  };

  const handleChange = (field, value) => {
    let processedValue = value;

    // Validaciones específicas por campo
    if (field === 'name') {
      // Eliminar números y capitalizar cada palabra
      processedValue = capitalizeWords(onlyLetters(value));
    } else if (field === 'idDocument') {
      // Solo permitir números
      processedValue = onlyNumbers(value);
    }

    setFormData({ ...formData, [field]: processedValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error('Por favor ingresa tu nombre completo');
      return;
    }
    if (!formData.idDocument.trim()) {
      toast.error('Por favor ingresa tu documento de identidad');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Por favor ingresa tu número de teléfono');
      return;
    }

    // Email validation (if provided)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="py-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
          <User className="text-emerald-700" size={32} />
        </div>
        <h3 className="text-xl font-bold text-stone-800 mb-2">Tus Datos Personales</h3>
        <p className="text-stone-600">Necesitamos algunos datos para confirmar tu reserva</p>
      </div>

      <Card className="border-2 border-stone-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-stone-700 font-semibold flex items-center gap-2">
              <User size={18} className="text-emerald-600" />
              Nombre Completo *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ej: Juan Pérez"
              className="border-2"
              required
            />
          </div>

          {/* ID Document */}
          <div className="space-y-2">
            <Label htmlFor="idDocument" className="text-stone-700 font-semibold flex items-center gap-2">
              <CreditCard size={18} className="text-emerald-600" />
              Documento de Identidad *
            </Label>
            <Input
              id="idDocument"
              type="text"
              inputMode="numeric"
              value={formData.idDocument}
              onChange={(e) => handleChange('idDocument', e.target.value)}
              placeholder="Ej: 12345678"
              className="border-2"
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-stone-700 font-semibold flex items-center gap-2">
              <Phone size={18} className="text-emerald-600" />
              Teléfono *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Ej: +58 424 1234567"
              className="border-2"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-stone-700 font-semibold flex items-center gap-2">
              <Mail size={18} className="text-emerald-600" />
              Correo Electrónico (opcional)
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Ej: juan@email.com"
              className="border-2"
            />
          </div>

          {/* Privacy notice */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
            <p className="text-xs text-stone-600 leading-relaxed">
              Tus datos serán utilizados únicamente para gestionar tu reserva y contactarte en caso de ser necesario. 
              No compartimos tu información con terceros.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-between gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Atrás
            </Button>
            
            <Button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white flex-1"
            >
              Confirmar Reserva
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};