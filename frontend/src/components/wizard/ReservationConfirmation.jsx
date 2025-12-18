import React, { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle, Calendar, Users, Home, MessageCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { roomsAPI, reservationsAPI, generateWhatsAppLink } from '../../services/api';
import { toast } from 'sonner';

export const ReservationConfirmation = ({ data, onClose }) => {
  const { serviceType, rooms: roomIds, guests, dateRange, personalData } = data;
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState(null);
  const [roomsData, setRoomsData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const createReservation = async () => {
      try {
        setLoading(true);
        
        // Fetch room details
        const allRooms = await roomsAPI.getAll();
        const selectedRooms = allRooms.filter(r => roomIds.includes(r.id));
        setRoomsData(selectedRooms);

        // Prepare reservation data
        const reservationData = {
          client_name: personalData.name,
          client_document: personalData.idDocument,
          client_email: personalData.email || null,
          client_phone: personalData.phone,
          reservation_type: serviceType,
          check_in_date: format(dateRange.from, 'yyyy-MM-dd'),
          check_out_date: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : null,
          num_guests: guests,
          room_ids: serviceType === 'hospedaje' ? roomIds : [],
          notes: null
        };

        // Create reservation
        const createdReservation = await reservationsAPI.create(reservationData);
        setReservation(createdReservation);
        toast.success('¡Reserva creada exitosamente!');
      } catch (err) {
        console.error('Error creating reservation:', err);
        setError(err.message);
        toast.error('Error al crear la reserva. Por favor intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    createReservation();
  }, []);

  const handleWhatsAppRedirect = () => {
    if (!reservation) return;
    
    const whatsappData = {
      reservation_type: serviceType,
      rooms: roomsData.map(r => r.name),
      num_guests: guests,
      total_price: reservation.total_price,
      check_in_date: format(dateRange.from, 'dd/MM/yyyy', { locale: es }),
      check_out_date: dateRange.to ? format(dateRange.to, 'dd/MM/yyyy', { locale: es }) : null,
      client_name: personalData.name,
      client_document: personalData.idDocument,
      client_phone: personalData.phone,
      client_email: personalData.email
    };
    
    const whatsappUrl = generateWhatsAppLink(whatsappData);
    window.open(whatsappUrl, '_blank');
    
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <Loader2 className="animate-spin mx-auto mb-4 text-emerald-600" size={48} />
        <p className="text-stone-600">Creando tu reserva...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="text-red-600 mb-4">Error al crear la reserva</div>
        <p className="text-stone-600 mb-6">{error}</p>
        <Button onClick={onClose} variant="outline">
          Cerrar
        </Button>
      </div>
    );
  }

  if (!reservation) {
    return null;
  }

  const handleWhatsAppRedirectOld = () => {
    let message = `¡Hola! Quiero confirmar mi reserva:\n\n`;
    
    // Service type
    message += `🎯 *Tipo de Servicio:* ${serviceType === 'fullday' ? 'Full Day' : 'Hospedaje'}\n\n`;
    
    // Room or guests
    if (serviceType === 'hospedaje') {
      const selectedRooms = mockRooms.filter(r => rooms.includes(r.id));
      message += `🏠 *Habitaciones:*\n`;
      selectedRooms.forEach(room => {
        message += `   - ${room.name} (€${room.price}/noche, ${room.capacity} personas)\n`;
      });
      const totalPrice = selectedRooms.reduce((sum, room) => sum + room.price, 0);
      message += `   Total por noche: €${totalPrice}\n\n`;
    } else {
      const totalPrice = guests * FULLDAY_PRICE;
      message += `👥 *Personas:* ${guests}\n`;
      message += `💰 *Total:* €${totalPrice}\n\n`;
    }
    
    // Dates
    if (serviceType === 'fullday') {
      message += `📅 *Fecha:* ${format(dateRange.from, 'dd/MM/yyyy', { locale: es })}\n`;
      message += `   Horario: 9:00 AM - 7:00 PM\n\n`;
    } else {
      const nights = Math.ceil((dateRange.to - dateRange.from) / (1000 * 60 * 60 * 24));
      message += `📅 *Check-in:* ${format(dateRange.from, 'dd/MM/yyyy', { locale: es })} a las 2:00 PM\n`;
      message += `📆 *Check-out:* ${format(dateRange.to, 'dd/MM/yyyy', { locale: es })} a las 12:00 PM\n`;
      message += `   (${nights} noche${nights > 1 ? 's' : ''})\n\n`;
    }
    
    // Personal data
    message += `👤 *Datos del Cliente:*\n`;
    message += `   Nombre: ${personalData.name}\n`;
    message += `   Documento: ${personalData.idDocument}\n`;
    message += `   Teléfono: ${personalData.phone}\n`;
    if (personalData.email) {
      message += `   Email: ${personalData.email}\n`;
    }

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Close modal after a delay
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const selectedRooms = serviceType === 'hospedaje' 
    ? mockRooms.filter(r => rooms.includes(r.id))
    : [];

  const totalPrice = serviceType === 'hospedaje'
    ? selectedRooms.reduce((sum, room) => sum + room.price, 0)
    : guests * FULLDAY_PRICE;

  const nights = serviceType === 'hospedaje'
    ? Math.ceil((dateRange.to - dateRange.from) / (1000 * 60 * 60 * 24))
    : 1;

  return (
    <div className="py-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4 animate-bounce">
          <CheckCircle className="text-emerald-700" size={48} />
        </div>
        <h3 className="text-2xl font-bold text-stone-800 mb-2">¡Reserva Confirmada!</h3>
        <p className="text-stone-600">Revisa los detalles de tu reserva</p>
      </div>

      <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 mb-6">
        {/* Service type */}
        <div className="mb-6 pb-6 border-b border-emerald-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-200 rounded-lg">
              {serviceType === 'fullday' ? <Calendar size={24} /> : <Home size={24} />}
            </div>
            <div>
              <p className="font-semibold text-stone-800 text-lg">
                {serviceType === 'fullday' ? 'Full Day' : 'Hospedaje'}
              </p>
              {serviceType === 'hospedaje' && (
                <div className="mt-2 space-y-1">
                  {selectedRooms.map(room => (
                    <p key={room.id} className="text-sm text-stone-600">
                      • Habitación {room.name} - €{room.price}/noche ({room.capacity} personas)
                    </p>
                  ))}
                </div>
              )}
              {serviceType === 'fullday' && (
                <div className="flex items-center gap-2 mt-2">
                  <Users size={18} className="text-stone-600" />
                  <p className="text-sm text-stone-600">{guests} persona{guests > 1 ? 's' : ''}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="mb-6 pb-6 border-b border-emerald-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-200 rounded-lg">
              <Calendar size={24} />
            </div>
            <div>
              <p className="font-semibold text-stone-800">Fechas</p>
              {serviceType === 'fullday' ? (
                <p className="text-sm text-stone-600 mt-1">
                  {format(dateRange.from, "dd 'de' MMMM yyyy", { locale: es })}
                  <br />
                  <span className="text-xs">9:00 AM - 7:00 PM</span>
                </p>
              ) : (
                <div className="text-sm text-stone-600 mt-1">
                  <p>Check-in: {format(dateRange.from, "dd 'de' MMMM yyyy", { locale: es })} - 2:00 PM</p>
                  <p>Check-out: {format(dateRange.to, "dd 'de' MMMM yyyy", { locale: es })} - 12:00 PM</p>
                  <p className="text-xs mt-1">{nights} noche{nights > 1 ? 's' : ''}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Personal data */}
        <div className="mb-6 pb-6 border-b border-emerald-200">
          <p className="font-semibold text-stone-800 mb-2">Datos del Cliente</p>
          <div className="space-y-1 text-sm text-stone-600">
            <p><strong>Nombre:</strong> {personalData.name}</p>
            <p><strong>Documento:</strong> {personalData.idDocument}</p>
            <p><strong>Teléfono:</strong> {personalData.phone}</p>
            {personalData.email && <p><strong>Email:</strong> {personalData.email}</p>}
          </div>
        </div>

        {/* Total price */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-stone-600">Total a pagar</p>
              {serviceType === 'hospedaje' && (
                <p className="text-xs text-stone-500">€{totalPrice} × {nights} noche{nights > 1 ? 's' : ''}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-emerald-700">
                €{serviceType === 'hospedaje' ? totalPrice * nights : totalPrice}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* WhatsApp button */}
      <Button
        onClick={handleWhatsAppRedirect}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold"
      >
        <MessageCircle className="mr-2" size={24} />
        Confirmar por WhatsApp
      </Button>

      <p className="text-center text-sm text-stone-500 mt-4">
        Serás redirigido a WhatsApp para confirmar tu reserva
      </p>
    </div>
  );
};