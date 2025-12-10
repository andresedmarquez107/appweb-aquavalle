import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarIcon, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { mockRooms, WHATSAPP_NUMBER } from '../mock';
import { toast } from 'sonner';

export const ReservationForm = () => {
  const [serviceType, setServiceType] = useState('');
  const [date, setDate] = useState();
  const [guests, setGuests] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  // Disable past dates
  const disabledDates = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (date) => date < today;
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!serviceType || !date || !guests || !clientName || !clientPhone) {
      toast.error('¡Por favor completa todos los campos!');
      return;
    }

    if (serviceType === 'hospedaje' && !selectedRoom) {
      toast.error('¡Por favor selecciona una habitación!');
      return;
    }

    // Create WhatsApp message
    const room = mockRooms.find(r => r.id === selectedRoom);
    let message = `¡Hola! Quiero hacer una reserva:\n\n`;
    message += `📅 Tipo: ${serviceType === 'fullday' ? 'Full Day' : 'Hospedaje'}\n`;
    
    if (serviceType === 'hospedaje' && room) {
      message += `🏠 Habitación: ${room.name} (€${room.price})\n`;
    }
    
    message += `📆 Fecha: ${format(date, 'dd/MM/yyyy', { locale: es })}\n`;
    message += `👥 Número de personas: ${guests}\n\n`;
    message += `👤 Nombre: ${clientName}\n`;
    message += `📞 Teléfono: ${clientPhone}\n`;
    
    if (clientEmail) {
      message += `📧 Email: ${clientEmail}\n`;
    }

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Show success message
    toast.success('¡Redirigiendo a WhatsApp para confirmar tu reserva!');

    // Reset form
    setTimeout(() => {
      setServiceType('');
      setDate(undefined);
      setGuests('');
      setSelectedRoom('');
      setClientName('');
      setClientEmail('');
      setClientPhone('');
    }, 1000);
  };

  return (
    <section id="reservar" className="py-20 bg-gradient-to-b from-white to-emerald-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-stone-800 mb-4">Reserva Tu Experiencia</h2>
          <p className="text-xl text-stone-600">
            Completa el formulario y confirmaremos tu reserva por WhatsApp
          </p>
        </div>

        <Card className="border-2 border-emerald-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle className="text-2xl text-stone-800">Formulario de Reserva</CardTitle>
            <CardDescription>Todos los campos son obligatorios</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Type */}
              <div className="space-y-2">
                <Label htmlFor="serviceType" className="text-stone-700 font-semibold">Tipo de Servicio</Label>
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona el tipo de servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fullday">Full Day (€5 por persona)</SelectItem>
                    <SelectItem value="hospedaje">Hospedaje (desde €70)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Room selection for hospedaje */}
              {serviceType === 'hospedaje' && (
                <div className="space-y-2">
                  <Label htmlFor="room" className="text-stone-700 font-semibold">Habitación</Label>
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona una habitación" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockRooms.map(room => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name} - {room.capacity} personas (€{room.price}/noche)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Date */}
              <div className="space-y-2">
                <Label className="text-stone-700 font-semibold">Fecha</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP', { locale: es }) : <span>Selecciona una fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={disabledDates}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Guests */}
              <div className="space-y-2">
                <Label htmlFor="guests" className="text-stone-700 font-semibold">Número de Personas</Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max={serviceType === 'fullday' ? '20' : '8'}
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  placeholder="Número de personas"
                />
                {serviceType === 'fullday' && (
                  <p className="text-xs text-stone-500">Máximo 20 personas por día</p>
                )}
              </div>

              {/* Client Info */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold text-stone-800">Datos del Cliente</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="clientName" className="text-stone-700 font-semibold">Nombre Completo *</Label>
                  <Input
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientPhone" className="text-stone-700 font-semibold">Teléfono *</Label>
                  <Input
                    id="clientPhone"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+58 424 1234567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientEmail" className="text-stone-700 font-semibold">Email (opcional)</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              {/* Submit */}
              <Button 
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MessageCircle className="mr-2" size={20} />
                Confirmar Reserva por WhatsApp
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};