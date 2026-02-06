import React, { useEffect, useState, useRef } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle, Calendar, Users, Home, MessageCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { roomsAPI, reservationsAPI, openWhatsApp } from '../../services/api';
import { toast } from 'sonner';

export const ReservationConfirmation = ({ data, onClose, onBack }) => {
  const { serviceType, rooms: roomIds, guests, dateRange, personalData } = data;
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState(null);
  const [roomsData, setRoomsData] = useState([]);
  const [error, setError] = useState(null);
  
  const hasCreatedReservation = useRef(false);

  useEffect(() => {
    if (hasCreatedReservation.current) {
      return;
    }
    hasCreatedReservation.current = true;
    
    const createReservation = async () => {
      try {
        setLoading(true);
        
        const allRooms = await roomsAPI.getAll();
        const selectedRooms = allRooms.filter(r => roomIds.includes(r.id));
        setRoomsData(selectedRooms);

        let numGuests = parseInt(guests, 10);
        if (serviceType === 'hospedaje') {
          numGuests = selectedRooms.reduce((sum, room) => sum + room.capacity, 0);
        }

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

        const createdReservation = await reservationsAPI.create(reservationData);
        setReservation(createdReservation);
        toast.success('¡Reserva creada exitosamente!');
      } catch (err) {
        console.error('Error creating reservation:', err);
        
        let errorMessage = 'Error desconocido';
        if (err.response?.data) {
          const data = err.response.data;
          if (typeof data.detail === 'string') {
            errorMessage = data.detail;
            if (errorMessage.includes('Room not available')) {
              errorMessage = 'La habitación ya está reservada para estas fechas.';
            } else if (errorMessage.includes('capacity exceeded')) {
              errorMessage = 'Capacidad máxima excedida para esta fecha.';
            }
          } else if (Array.isArray(data.detail)) {
            errorMessage = data.detail.map(e => {
              const field = e.loc?.[e.loc.length - 1] || 'campo';
              const msg = e.msg || 'valor inválido';
              return `${field}: ${msg}`;
            }).join(', ');
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
    
    openWhatsApp(whatsappData);
    
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const copyMessage = () => {
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
    
    let message = `Hola! Quiero confirmar mi reserva:\n\n`;
    message += `Tipo: ${whatsappData.reservation_type === 'fullday' ? 'Full Day' : 'Hospedaje'}\n`;
    
    if (whatsappData.reservation_type === 'hospedaje') {
      message += `Habitaciones: ${whatsappData.rooms.join(', ')}\n`;
    } else {
      message += `Personas: ${whatsappData.num_guests}\n`;
    }
    
    message += `Total: €${whatsappData.total_price}\n`;
    message += `Entrada: ${whatsappData.check_in_date}\n`;
    if (whatsappData.check_out_date) {
      message += `Salida: ${whatsappData.check_out_date}\n`;
    }
    message += `\nNombre: ${whatsappData.client_name}\n`;
    message += `Doc: ${whatsappData.client_document}\n`;
    message += `Tel: ${whatsappData.client_phone}\n`;
    if (whatsappData.client_email) {
      message += `Email: ${whatsappData.client_email}\n`;
    }
    
    navigator.clipboard.writeText(message).then(() => {
      toast.success('¡Mensaje copiado!');
    }).catch(() => {
      toast.error('No se pudo copiar');
    });
  };

  if (loading) {
    return (
      <div className="py-8 text-center">
        <Loader2 className="animate-spin mx-auto mb-4 text-emerald-600" size={40} />
        <p className="text-stone-600 text-sm">Creando tu reserva...</p>
      </div>
    );
  }

  if (error) {
    // Check if it's a document/name mismatch error
    const isDocumentError = error.includes('ya está registrado con otro nombre');
    
    return (
      <div className="py-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <div className="text-red-600 mb-2 text-lg font-semibold">Error al crear la reserva</div>
          <p className="text-stone-600 text-sm max-w-md mx-auto">{error}</p>
        </div>
        
        {isDocumentError && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-sm">
            <p className="text-amber-800">
              <strong>💡 Sugerencia:</strong> Verifica que el nombre y documento coincidan con los datos registrados anteriormente, o usa un documento diferente si eres un cliente nuevo.
            </p>
          </div>
        )}
        
        <div className="flex gap-3 justify-center">
          <Button onClick={onBack} variant="default" className="bg-emerald-700 hover:bg-emerald-800">
            ← Corregir Datos
          </Button>
          <Button onClick={onClose} variant="outline">
            Cancelar
          </Button>
        </div>
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
    <div className="py-2 sm:py-6">
      {/* Success header - compact on mobile */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 bg-emerald-100 rounded-full mb-2 sm:mb-4">
          <CheckCircle className="text-emerald-700" size={32} />
        </div>
        <h3 className="text-lg sm:text-2xl font-bold text-stone-800 mb-1">¡Reserva Registrada!</h3>
        <p className="text-stone-600 text-xs sm:text-sm">Confirma por WhatsApp para completar</p>
      </div>

      {/* Details card - compact on mobile */}
      <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-3 sm:p-6 mb-4">
        {/* Service type and dates in a grid on mobile */}
        <div className="grid grid-cols-2 gap-3 sm:block">
          {/* Service */}
          <div className="sm:mb-4 sm:pb-4 sm:border-b sm:border-emerald-200">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 sm:p-2 bg-emerald-200 rounded-lg">
                {serviceType === 'fullday' ? <Calendar size={16} /> : <Home size={16} />}
              </div>
              <span className="font-semibold text-stone-800 text-sm sm:text-lg">
                {serviceType === 'fullday' ? 'Full Day' : 'Hospedaje'}
              </span>
            </div>
            {serviceType === 'hospedaje' && roomsData.length > 0 && (
              <div className="text-xs text-stone-600 ml-8 sm:ml-10">
                {roomsData.map(room => (
                  <p key={room.id}>• {room.name}</p>
                ))}
              </div>
            )}
            {serviceType === 'fullday' && (
              <div className="flex items-center gap-1 text-xs text-stone-600 ml-8 sm:ml-10">
                <Users size={12} />
                <span>{guests} persona{guests > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="sm:mb-4 sm:pb-4 sm:border-b sm:border-emerald-200">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 sm:p-2 bg-emerald-200 rounded-lg">
                <Calendar size={16} />
              </div>
              <span className="font-semibold text-stone-800 text-sm">Fechas</span>
            </div>
            <div className="text-xs text-stone-600 ml-8 sm:ml-10">
              {serviceType === 'fullday' ? (
                <p>{format(dateRange.from, "dd MMM yyyy", { locale: es })}</p>
              ) : (
                <>
                  <p>In: {format(dateRange.from, "dd MMM", { locale: es })}</p>
                  <p>Out: {format(dateRange.to, "dd MMM", { locale: es })}</p>
                  <p className="text-emerald-700 font-medium">{nights} noche{nights > 1 ? 's' : ''}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Client data - collapsible on mobile */}
        <div className="mt-3 pt-3 border-t border-emerald-200 sm:mt-4 sm:pt-4">
          <p className="font-semibold text-stone-800 text-sm mb-1">Cliente</p>
          <div className="text-xs text-stone-600 grid grid-cols-2 gap-1 sm:block sm:space-y-0.5">
            <p>{personalData.name}</p>
            <p>{personalData.idDocument}</p>
            <p>{personalData.phone}</p>
            {personalData.email && <p className="col-span-2">{personalData.email}</p>}
          </div>
        </div>

        {/* Total price - prominent */}
        <div className="mt-3 bg-white rounded-lg p-3 sm:p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-stone-600 text-xs sm:text-sm">Total a pagar</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-700">
              €{reservation.total_price}
            </p>
          </div>
        </div>
      </Card>

      {/* WhatsApp section - prominent and sticky on mobile */}
      <div className="sticky bottom-0 bg-white -mx-4 px-4 py-3 sm:mx-0 sm:px-0 sm:py-0 sm:static border-t sm:border-t-0 border-amber-200">
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-3 sm:p-6">
          <div className="text-center mb-3">
            <div className="inline-flex items-center gap-1 bg-amber-200 text-amber-800 px-3 py-1 rounded-full font-semibold text-xs mb-2">
              <span>⚠️</span> IMPORTANTE
            </div>
            <p className="text-amber-900 font-bold text-sm sm:text-lg">
              Confirma por WhatsApp
            </p>
            <p className="text-amber-800 text-xs hidden sm:block">
              Presiona el botón para completar tu reserva
            </p>
          </div>

          {/* Arrows */}
          <div className="flex justify-center gap-2 mb-2 text-green-600">
            <span className="animate-bounce text-lg">↓</span>
            <span className="animate-bounce text-lg" style={{animationDelay: '0.1s'}}>↓</span>
            <span className="animate-bounce text-lg" style={{animationDelay: '0.2s'}}>↓</span>
          </div>

          <Button
            onClick={handleWhatsAppRedirect}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 sm:py-6 text-sm sm:text-lg font-bold shadow-lg"
          >
            <MessageCircle className="mr-2" size={20} />
            Confirmar vía WhatsApp
          </Button>

          {/* Alternative */}
          <Button
            onClick={copyMessage}
            variant="ghost"
            className="w-full mt-2 text-amber-700 text-xs sm:text-sm"
            size="sm"
          >
            📋 Copiar mensaje (alternativa)
          </Button>
        </div>

        <p className="text-center text-xs text-stone-400 mt-2">
          Tel: +58 424 773 9434
        </p>
      </div>
    </div>
  );
};
