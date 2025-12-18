import React, { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle, Calendar, Users, Home, MessageCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { roomsAPI, reservationsAPI, openWhatsApp } from '../../services/api';
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
          num_guests: parseInt(guests, 10),
          room_ids: serviceType === 'hospedaje' ? roomIds : [],
          notes: null
        };

        console.log('Sending reservation data:', reservationData);

        // Create reservation
        const createdReservation = await reservationsAPI.create(reservationData);
        console.log('Reservation created:', createdReservation);
        setReservation(createdReservation);
        toast.success('¡Reserva creada exitosamente!');
      } catch (err) {
        console.error('Error creating reservation:', err);
        console.error('Error response:', err.response?.data);
        
        // Extract error message
        let errorMessage = 'Error desconocido';
        if (err.response?.data) {
          const data = err.response.data;
          if (typeof data.detail === 'string') {
            errorMessage = data.detail;
          } else if (Array.isArray(data.detail)) {
            // Validation errors array
            errorMessage = data.detail.map(e => e.msg || JSON.stringify(e)).join(', ');
          } else if (data.detail) {
            errorMessage = JSON.stringify(data.detail);
          }
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        toast.error(`Error: ${errorMessage}`);
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
    
    // Use new function with fallback
    openWhatsApp(whatsappData);
    
    // Close modal after a short delay
    setTimeout(() => {
      onClose();
    }, 1500);
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
        <div className="text-red-600 mb-4 text-xl font-semibold">Error al crear la reserva</div>
        <div className="text-stone-600 mb-6 max-w-md mx-auto">
          {typeof error === 'string' ? (
            <p>{error}</p>
          ) : (
            <div className="text-left bg-red-50 p-4 rounded-lg">
              <p className="font-semibold mb-2">Detalles del error:</p>
              <pre className="text-xs overflow-auto">{JSON.stringify(error, null, 2)}</pre>
            </div>
          )}
        </div>
        <Button onClick={onClose} variant="outline">
          Cerrar e Intentar de Nuevo
        </Button>
      </div>
    );
  }

  if (!reservation) {
    return null;
  }

  const nights = serviceType === 'hospedaje' && dateRange.to
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
              {serviceType === 'hospedaje' && roomsData.length > 0 && (
                <div className="mt-2 space-y-1">
                  {roomsData.map(room => (
                    <p key={room.id} className="text-sm text-stone-600">
                      • Habitación {room.name} - €{room.price_per_night}/noche ({room.capacity} personas)
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
              {serviceType === 'hospedaje' && nights > 1 && (
                <p className="text-xs text-stone-500">{nights} noche{nights > 1 ? 's' : ''}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-emerald-700">
                €{reservation.total_price}
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