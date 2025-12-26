import React, { useEffect, useState, useRef } from 'react';
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
  
  // Prevent double execution in StrictMode
  const hasCreatedReservation = useRef(false);

  useEffect(() => {
    // Skip if already created (StrictMode double-run protection)
    if (hasCreatedReservation.current) {
      return;
    }
    hasCreatedReservation.current = true;
    
    const createReservation = async () => {
      try {
        setLoading(true);
        
        // Fetch room details
        const allRooms = await roomsAPI.getAll();
        const selectedRooms = allRooms.filter(r => roomIds.includes(r.id));
        setRoomsData(selectedRooms);

        // Calculate num_guests for hospedaje (sum of room capacities)
        let numGuests = parseInt(guests, 10);
        if (serviceType === 'hospedaje') {
          numGuests = selectedRooms.reduce((sum, room) => sum + room.capacity, 0);
        }

        // Prepare reservation data
        const reservationData = {
          client_name: personalData.name,
          client_document: personalData.idDocument,
          client_email: personalData.email || null,
          client_phone: personalData.phone,
          reservation_type: serviceType,
          check_in_date: format(dateRange.from, 'yyyy-MM-dd'),
          check_out_date: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : null,
          num_guests: numGuests,
          room_ids: serviceType === 'hospedaje' ? roomIds : [],
          notes: null
        };

        console.log('=== SENDING RESERVATION ===');
        console.log('Data:', JSON.stringify(reservationData, null, 2));

        // Create reservation
        const createdReservation = await reservationsAPI.create(reservationData);
        console.log('=== RESERVATION CREATED ===');
        console.log('Response:', createdReservation);
        setReservation(createdReservation);
        toast.success('¡Reserva creada exitosamente!');
      } catch (err) {
        console.error('=== ERROR CREATING RESERVATION ===');
        console.error('Full error:', err);
        console.error('Error response:', err.response);
        console.error('Error data:', err.response?.data);
        
        // Extract error message
        let errorMessage = 'Error desconocido';
        if (err.response?.data) {
          const data = err.response.data;
          if (typeof data.detail === 'string') {
            errorMessage = data.detail;
            
            // Translate common errors
            if (errorMessage.includes('Room not available')) {
              errorMessage = 'La habitación ya está reservada para estas fechas. Por favor selecciona otras fechas.';
            } else if (errorMessage.includes('capacity exceeded')) {
              errorMessage = 'Capacidad máxima excedida para esta fecha.';
            }
          } else if (Array.isArray(data.detail)) {
            // Validation errors array
            errorMessage = data.detail.map(e => {
              const field = e.loc?.[e.loc.length - 1] || 'campo';
              const msg = e.msg || 'valor inválido';
              return `${field}: ${msg}`;
            }).join(', ');
          } else if (data.detail) {
            errorMessage = JSON.stringify(data.detail);
          }
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        toast.error(`Error: ${errorMessage}`, { duration: 5000 });
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
        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
          <CheckCircle className="text-emerald-700" size={48} />
        </div>
        <h3 className="text-2xl font-bold text-stone-800 mb-2">¡Reserva Registrada!</h3>
        <p className="text-stone-600">Revisa los detalles y confirma por WhatsApp</p>
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

      {/* WhatsApp Confirmation Section */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 mb-4">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-amber-200 text-amber-800 px-4 py-2 rounded-full font-semibold text-sm mb-3">
            <span className="animate-pulse">⚠️</span>
            IMPORTANTE
          </div>
          <h4 className="text-lg font-bold text-amber-900 mb-2">
            Tu reserva aún no está confirmada
          </h4>
          <p className="text-amber-800 text-sm">
            Para completar tu reserva, debes enviar los datos por WhatsApp presionando el botón de abajo
          </p>
        </div>

        {/* Flechas animadas apuntando al botón */}
        <div className="flex justify-center gap-4 mb-4 text-green-600">
          <span className="animate-bounce text-2xl">↓</span>
          <span className="animate-bounce text-2xl" style={{animationDelay: '0.1s'}}>↓</span>
          <span className="animate-bounce text-2xl" style={{animationDelay: '0.2s'}}>↓</span>
        </div>

        <Button
          onClick={handleWhatsAppRedirect}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
        >
          <MessageCircle className="mr-2" size={24} />
          Confirmar Reserva vía WhatsApp
        </Button>

        <p className="text-center text-xs text-amber-700 mt-3">
          Al presionar el botón se abrirá WhatsApp con los datos de tu reserva
        </p>
      </div>

      {/* Botón alternativo */}
      <div className="space-y-3">
        <Button
          onClick={() => {
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
            
            // Generate message
            let message = `Hola! Quiero confirmar mi reserva:\n\n`;
            message += `Tipo de Servicio: ${whatsappData.reservation_type === 'fullday' ? 'Full Day' : 'Hospedaje'}\n\n`;
            
            if (whatsappData.reservation_type === 'hospedaje') {
              message += `Habitaciones:\n`;
              whatsappData.rooms.forEach(room => {
                message += `   - ${room}\n`;
              });
              message += `\n`;
            } else {
              message += `Personas: ${whatsappData.num_guests}\n`;
              message += `Total: €${whatsappData.total_price}\n\n`;
            }
            
            message += `Fecha de entrada: ${whatsappData.check_in_date}\n`;
            if (whatsappData.check_out_date) {
              message += `Fecha de salida: ${whatsappData.check_out_date}\n`;
            }
            message += `\n`;
            
            message += `Datos del Cliente:\n`;
            message += `   Nombre: ${whatsappData.client_name}\n`;
            message += `   Documento: ${whatsappData.client_document}\n`;
            message += `   Telefono: ${whatsappData.client_phone}\n`;
            if (whatsappData.client_email) {
              message += `   Email: ${whatsappData.client_email}\n`;
            }
            
            // Copy to clipboard
            navigator.clipboard.writeText(message).then(() => {
              toast.success('¡Mensaje copiado! Ahora pégalo en WhatsApp');
            }).catch(() => {
              toast.error('No se pudo copiar. Usa el botón de arriba.');
            });
          }}
          variant="outline"
          className="w-full border-2 border-stone-300 text-stone-600 hover:bg-stone-50 py-4"
        >
          📋 Copiar Mensaje (alternativa)
        </Button>
      </div>

      <p className="text-center text-sm text-stone-500 mt-4">
        ¿Problemas con el botón? Copia el mensaje y envíalo manualmente al +58 424 773 9434
      </p>
    </div>
  );
};