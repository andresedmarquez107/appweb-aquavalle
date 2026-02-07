import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ArrowLeft, User, CreditCard, Mail, Phone, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const PersonalDataForm = ({ onSubmit, onBack, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    idDocument: initialData?.idDocument || '',
    email: initialData?.email || '',
    phone: initialData?.phone || ''
  });

  // Estado para el tipo de documento
  const [docType, setDocType] = useState('cedula'); // 'cedula' o 'pasaporte'
  const [cedulaType, setCedulaType] = useState('V'); // 'V' o 'E'
  
  // Estado para el código de país del teléfono
  const [countryCode, setCountryCode] = useState('+58'); // Venezuela por defecto
  
  // Estado para mensajes de error en tiempo real
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    idDocument: '',
    phone: ''
  });

  const MAX_NAME_LENGTH = 50;
  const MAX_EMAIL_LENGTH = 50;

  // Lista de códigos de país con sus longitudes de número local
  const countryCodes = [
    { code: '+58', country: 'Venezuela', flag: '🇻🇪', minLength: 10, maxLength: 10 },
    { code: '+57', country: 'Colombia', flag: '🇨🇴', minLength: 10, maxLength: 10 },
    { code: '+34', country: 'España', flag: '🇪🇸', minLength: 9, maxLength: 9 },
    { code: '+1', country: 'USA/Canadá', flag: '🇺🇸', minLength: 10, maxLength: 10 },
    { code: '+52', country: 'México', flag: '🇲🇽', minLength: 10, maxLength: 10 },
    { code: '+54', country: 'Argentina', flag: '🇦🇷', minLength: 10, maxLength: 10 },
    { code: '+56', country: 'Chile', flag: '🇨🇱', minLength: 9, maxLength: 9 },
    { code: '+51', country: 'Perú', flag: '🇵🇪', minLength: 9, maxLength: 9 },
    { code: '+593', country: 'Ecuador', flag: '🇪🇨', minLength: 9, maxLength: 9 },
    { code: '+55', country: 'Brasil', flag: '🇧🇷', minLength: 10, maxLength: 11 },
    { code: '+39', country: 'Italia', flag: '🇮🇹', minLength: 9, maxLength: 10 },
    { code: '+33', country: 'Francia', flag: '🇫🇷', minLength: 9, maxLength: 9 },
    { code: '+49', country: 'Alemania', flag: '🇩🇪', minLength: 10, maxLength: 11 },
    { code: '+44', country: 'Reino Unido', flag: '🇬🇧', minLength: 10, maxLength: 10 },
    { code: '+351', country: 'Portugal', flag: '🇵🇹', minLength: 9, maxLength: 9 },
    { code: '+507', country: 'Panamá', flag: '🇵🇦', minLength: 7, maxLength: 8 },
    { code: '+506', country: 'Costa Rica', flag: '🇨🇷', minLength: 8, maxLength: 8 },
    { code: '+598', country: 'Uruguay', flag: '🇺🇾', minLength: 8, maxLength: 9 },
    { code: '+591', country: 'Bolivia', flag: '🇧🇴', minLength: 8, maxLength: 8 },
    { code: '+595', country: 'Paraguay', flag: '🇵🇾', minLength: 9, maxLength: 9 },
    { code: '+502', country: 'Guatemala', flag: '🇬🇹', minLength: 8, maxLength: 8 },
    { code: '+503', country: 'El Salvador', flag: '🇸🇻', minLength: 8, maxLength: 8 },
    { code: '+504', country: 'Honduras', flag: '🇭🇳', minLength: 8, maxLength: 8 },
    { code: '+53',  country: 'Cuba', flag: '🇨🇺', minLength: 8, maxLength: 8 },
    { code: '+297', country: 'Aruba', flag: '🇦🇼', minLength: 7, maxLength: 7 },
    { code: '+599', country: 'Curazao', flag: '🇨🇼', minLength: 7, maxLength: 8 },
    { code: '+7',   country: 'Rusia', flag: '🇷🇺', minLength: 10, maxLength: 10 },
    { code: '+86',  country: 'China', flag: '🇨🇳', minLength: 11, maxLength: 11 },
    { code: '+31',  country: 'Países Bajos', flag: '🇳🇱', minLength: 9, maxLength: 9 },
    { code: '+41',  country: 'Suiza', flag: '🇨🇭', minLength: 9, maxLength: 9 },
    { code: '+32',  country: 'Bélgica', flag: '🇧🇪', minLength: 9, maxLength: 9 },
    { code: '+43',  country: 'Austria', flag: '🇦🇹', minLength: 10, maxLength: 11 },
    { code: '+47',  country: 'Noruega', flag: '🇳🇴', minLength: 8, maxLength: 8 },
    { code: '+61',  country: 'Australia', flag: '🇦🇺', minLength: 9, maxLength: 9 },
    { code: '+81',  country: 'Japón', flag: '🇯🇵', minLength: 10, maxLength: 10 },
  ];

  // Obtener info del país seleccionado
  const getSelectedCountry = () => {
    return countryCodes.find(c => c.code === countryCode) || countryCodes[0];
  };

  // Función para capitalizar cada palabra
  const capitalizeWords = (text) => {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Función para filtrar solo letras y espacios
  const onlyLettersAndSpaces = (text) => {
    return text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
  };

  // Función para filtrar solo números
  const onlyNumbers = (text) => {
    return text.replace(/[^0-9]/g, '');
  };

  // Función para filtrar números y letras (para pasaporte)
  const onlyAlphanumeric = (text) => {
    return text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  };

  // Validar caracteres de email
  const validateEmailChar = (char) => {
    // Caracteres permitidos en email: letras, números, @, ., _, -, +
    return /^[a-zA-Z0-9@._\-+]$/.test(char);
  };

  const handleNameChange = (value) => {
    // Filtrar solo letras y espacios
    const filtered = onlyLettersAndSpaces(value);
    
    // Limitar longitud
    const limited = filtered.slice(0, MAX_NAME_LENGTH);
    
    // Capitalizar
    const capitalized = capitalizeWords(limited);
    
    // Mostrar error si se intentó escribir algo no permitido
    if (filtered !== value) {
      setErrors(prev => ({ ...prev, name: 'Solo se permiten letras' }));
      setTimeout(() => setErrors(prev => ({ ...prev, name: '' })), 2000);
    }
    
    setFormData({ ...formData, name: capitalized });
  };

  const handleEmailChange = (value) => {
    // Limitar longitud
    if (value.length > MAX_EMAIL_LENGTH) {
      return;
    }
    
    // Verificar el último carácter ingresado
    if (value.length > formData.email.length) {
      const newChar = value.slice(-1);
      if (!validateEmailChar(newChar)) {
        setErrors(prev => ({ ...prev, email: `El carácter "${newChar}" no es permitido` }));
        setTimeout(() => setErrors(prev => ({ ...prev, email: '' })), 2000);
        return; // No actualizar el valor
      }
    }
    
    setFormData({ ...formData, email: value.toLowerCase() });
  };

  const handleDocumentChange = (value) => {
    let processedValue = '';
    let errorMsg = '';
    let maxLength = 8; // default

    if (docType === 'cedula') {
      // Solo números para cédula
      processedValue = onlyNumbers(value);
      
      // Límite según tipo de cédula
      if (cedulaType === 'V') {
        maxLength = 8; // V: máximo 8
      } else {
        maxLength = 10; // E: máximo 10
      }
      
      // Verificar si se ingresó un carácter no numérico (antes de truncar)
      if (value.length > formData.idDocument.length && processedValue.length === formData.idDocument.length) {
        // Se intentó agregar un carácter pero no se agregó nada válido
        errorMsg = 'Solo se permiten números';
      }
      
      processedValue = processedValue.slice(0, maxLength);
      
    } else {
      // Pasaporte: números y letras
      processedValue = onlyAlphanumeric(value);
      
      maxLength = 9;
      
      // Verificar si se ingresó un carácter no alfanumérico (antes de truncar)
      if (value.length > formData.idDocument.length && processedValue.length === formData.idDocument.length) {
        errorMsg = 'Solo se permiten letras y números';
      }
      
      processedValue = processedValue.slice(0, maxLength);
    }

    if (errorMsg) {
      setErrors(prev => ({ ...prev, idDocument: errorMsg }));
      setTimeout(() => setErrors(prev => ({ ...prev, idDocument: '' })), 2000);
    }

    setFormData({ ...formData, idDocument: processedValue });
  };

  // Limpiar documento cuando cambia el tipo
  const handleDocTypeChange = (newType) => {
    setDocType(newType);
    setFormData({ ...formData, idDocument: '' });
    setErrors(prev => ({ ...prev, idDocument: '' }));
  };

  const handleCedulaTypeChange = (newType) => {
    setCedulaType(newType);
    // Limpiar documento si excede el nuevo límite
    if (newType === 'V' && formData.idDocument.length > 8) {
      setFormData({ ...formData, idDocument: formData.idDocument.slice(0, 8) });
    }
  };

  const handlePhoneChange = (value) => {
    // Solo permitir números
    const numbersOnly = onlyNumbers(value);
    const country = getSelectedCountry();
    
    // Limitar a la longitud máxima del país
    const limited = numbersOnly.slice(0, country.maxLength);
    
    // Mostrar error si se intentó escribir algo no permitido
    if (value !== numbersOnly && value.length > formData.phone.length) {
      setErrors(prev => ({ ...prev, phone: 'Solo se permiten números' }));
      setTimeout(() => setErrors(prev => ({ ...prev, phone: '' })), 2000);
    }
    
    setFormData({ ...formData, phone: limited });
  };

  const handleCountryCodeChange = (newCode) => {
    setCountryCode(newCode);
    // Ajustar el número si excede la longitud del nuevo país
    const newCountry = countryCodes.find(c => c.code === newCode);
    if (newCountry && formData.phone.length > newCountry.maxLength) {
      setFormData({ ...formData, phone: formData.phone.slice(0, newCountry.maxLength) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación de nombre
    if (!formData.name.trim()) {
      toast.error('Por favor ingresa tu nombre completo');
      return;
    }
    if (formData.name.trim().length < 3) {
      toast.error('El nombre debe tener al menos 3 caracteres');
      return;
    }

    // Validación de documento
    if (!formData.idDocument.trim()) {
      toast.error('Por favor ingresa tu documento de identidad');
      return;
    }

    if (docType === 'cedula') {
      if (cedulaType === 'V') {
        // Cédula venezolana: 7-8 números
        if (formData.idDocument.length < 7) {
          toast.error('La cédula venezolana debe tener al menos 7 números');
          return;
        }
        if (formData.idDocument.length > 8) {
          toast.error('La cédula venezolana no puede tener más de 8 números');
          return;
        }
      } else {
        // Cédula extranjera: 8-10 números
        if (formData.idDocument.length < 8) {
          toast.error('La cédula de extranjero debe tener al menos 8 números');
          return;
        }
        if (formData.idDocument.length > 10) {
          toast.error('La cédula de extranjero no puede tener más de 10 números');
          return;
        }
      }
    } else {
      if (formData.idDocument.length < 8) {
        toast.error('El pasaporte debe tener al menos 8 caracteres');
        return;
      }
      if (formData.idDocument.length > 9) {
        toast.error('El pasaporte no puede tener más de 9 caracteres');
        return;
      }
    }

    // Validación de teléfono
    if (!formData.phone.trim()) {
      toast.error('Por favor ingresa tu número de teléfono');
      return;
    }
    
    const country = getSelectedCountry();
    if (formData.phone.length < country.minLength) {
      toast.error(`El número debe tener al menos ${country.minLength} dígitos para ${country.country}`);
      return;
    }
    if (formData.phone.length > country.maxLength) {
      toast.error(`El número no puede tener más de ${country.maxLength} dígitos para ${country.country}`);
      return;
    }

    // Validación de email (si se proporciona)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    // Formatear el documento final
    let finalDocument = formData.idDocument;
    if (docType === 'cedula') {
      finalDocument = `${cedulaType}-${formData.idDocument}`;
    }

    // Formatear el teléfono final con código de país
    const finalPhone = `${countryCode} ${formData.phone}`;

    onSubmit({
      ...formData,
      idDocument: finalDocument,
      phone: finalPhone
    });
  };

  return (
    <div className="py-2 sm:py-6">
      <div className="text-center mb-4 sm:mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 rounded-full mb-2 sm:mb-4">
          <User className="text-emerald-700" size={24} />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-stone-800 mb-1">Tus Datos Personales</h3>
        <p className="text-stone-600 text-sm">Necesitamos algunos datos para confirmar tu reserva</p>
      </div>

      <Card className="border-2 border-stone-200 p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-stone-700 font-semibold flex items-center gap-2 text-sm">
              <User size={16} className="text-emerald-600" />
              Nombre Completo *
            </Label>
            <div>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej: Juan Pérez"
                className={`border-2 ${errors.name ? 'border-red-400' : ''}`}
                maxLength={MAX_NAME_LENGTH}
                required
              />
            </div>
            {errors.name ? (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.name}
              </p>
            ) : (
              <p className="text-xs text-stone-400 text-right">{formData.name.length}/{MAX_NAME_LENGTH}</p>
            )}
          </div>

          {/* ID Document */}
          <div className="space-y-2">
            <Label className="text-stone-700 font-semibold flex items-center gap-2 text-sm">
              <CreditCard size={16} className="text-emerald-600" />
              Documento de Identidad *
            </Label>
            
            {/* Tipo de documento */}
            <div className="flex gap-2 mb-2">
              <Select value={docType} onValueChange={handleDocTypeChange}>
                <SelectTrigger className="w-32 sm:w-40 border-2">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cedula">Cédula</SelectItem>
                  <SelectItem value="pasaporte">Pasaporte</SelectItem>
                </SelectContent>
              </Select>

              {/* Tipo de cédula (V o E) - solo si es cédula */}
              {docType === 'cedula' && (
                <Select value={cedulaType} onValueChange={handleCedulaTypeChange}>
                  <SelectTrigger className="w-20 border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="V">V</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Input del documento */}
            <div>
              <Input
                id="idDocument"
                type="text"
                inputMode={docType === 'cedula' ? 'numeric' : 'text'}
                value={formData.idDocument}
                onChange={(e) => handleDocumentChange(e.target.value)}
                placeholder={docType === 'cedula' ? 'Ej: 12345678' : 'Ej: AB1234567'}
                className={`border-2 ${errors.idDocument ? 'border-red-400' : ''}`}
                required
              />
            </div>
            {errors.idDocument ? (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.idDocument}
              </p>
            ) : (
              <p className="text-xs text-stone-400">
                {docType === 'cedula' 
                  ? (cedulaType === 'V' 
                      ? `Mínimo 7, máximo 8 números (${formData.idDocument.length}/8)`
                      : `Mínimo 8, máximo 10 números (${formData.idDocument.length}/10)`)
                  : `Mínimo 8, máximo 9 caracteres (${formData.idDocument.length}/9)`
                }
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-stone-700 font-semibold flex items-center gap-2 text-sm">
              <Phone size={16} className="text-emerald-600" />
              Teléfono *
            </Label>
            <div className="flex gap-2">
              {/* Selector de código de país */}
              <Select value={countryCode} onValueChange={handleCountryCodeChange}>
                <SelectTrigger className="w-28 sm:w-36 border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countryCodes.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <span className="flex items-center gap-2">
                        <span>{country.flag}</span>
                        <span>{country.code}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Input del número */}
              <div className="flex-1">
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder={`Ej: ${'0'.repeat(getSelectedCountry().minLength)}`}
                  className={`border-2 ${errors.phone ? 'border-red-400' : ''}`}
                  required
                />
              </div>
            </div>
            {errors.phone ? (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.phone}
              </p>
            ) : (
              <p className="text-xs text-stone-400">
                {getSelectedCountry().country}: {getSelectedCountry().minLength === getSelectedCountry().maxLength 
                  ? `${getSelectedCountry().minLength} dígitos`
                  : `${getSelectedCountry().minLength}-${getSelectedCountry().maxLength} dígitos`
                } ({formData.phone.length}/{getSelectedCountry().maxLength})
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-stone-700 font-semibold flex items-center gap-2 text-sm">
              <Mail size={16} className="text-emerald-600" />
              Correo Electrónico (opcional)
            </Label>
            <div>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="Ej: juan@email.com"
                className={`border-2 ${errors.email ? 'border-red-400' : ''}`}
                maxLength={MAX_EMAIL_LENGTH}
              />
            </div>
            {errors.email ? (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.email}
              </p>
            ) : (
              <p className="text-xs text-stone-400 text-right">{formData.email.length}/{MAX_EMAIL_LENGTH}</p>
            )}
          </div>

          {/* Privacy notice */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 sm:p-4 mt-6">
            <p className="text-xs text-stone-600 leading-relaxed">
              Tus datos serán utilizados únicamente para gestionar tu reserva y contactarte en caso de ser necesario. 
              No compartimos tu información con terceros.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-between gap-3 pt-2 sm:pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-1 text-sm"
              size="sm"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Atrás</span>
            </Button>
            
            <Button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white flex-1 text-sm"
            >
              Confirmar Reserva
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
