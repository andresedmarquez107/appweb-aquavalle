import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ServiceSelector } from './wizard/ServiceSelector';
import { RoomSelector } from './wizard/RoomSelector';
import { GuestCounter } from './wizard/GuestCounter';
import { DateRangeSelector } from './wizard/DateRangeSelector';
import { PersonalDataForm } from './wizard/PersonalDataForm';
import { ReservationConfirmation } from './wizard/ReservationConfirmation';

export const ReservationWizard = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [reservationData, setReservationData] = useState({
    serviceType: null,
    rooms: [],
    guests: 0,
    dateRange: { from: null, to: null },
    personalData: {
      name: '',
      idDocument: '',
      email: '',
      phone: ''
    }
  });

  const handleServiceSelect = (serviceType) => {
    setReservationData({ ...reservationData, serviceType });
    setStep(2);
  };

  const handleRoomSelect = (rooms) => {
    setReservationData({ ...reservationData, rooms });
    setStep(3);
  };

  const handleGuestSelect = (guests) => {
    setReservationData({ ...reservationData, guests });
    setStep(3);
  };

  const handleDateSelect = (dateRange) => {
    setReservationData({ ...reservationData, dateRange });
    setStep(4);
  };

  const handlePersonalDataSubmit = (personalData) => {
    setReservationData({ ...reservationData, personalData });
    setStep(5);
  };

  const handleClose = () => {
    setStep(1);
    setReservationData({
      serviceType: null,
      rooms: [],
      guests: 0,
      dateRange: { from: null, to: null },
      personalData: {
        name: '',
        idDocument: '',
        email: '',
        phone: ''
      }
    });
    onClose();
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setReservationData({ ...reservationData, serviceType: null, rooms: [], guests: 0 });
    } else if (step === 3) {
      setStep(2);
      setReservationData({ ...reservationData, dateRange: { from: null, to: null } });
    } else if (step === 4) {
      setStep(3);
      setReservationData({ ...reservationData, personalData: { name: '', idDocument: '', email: '', phone: '' } });
    } else if (step === 5) {
      setStep(4);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-stone-800">
            {step === 1 && 'Selecciona tu Servicio'}
            {step === 2 && reservationData.serviceType === 'hospedaje' && 'Elige tu Habitación'}
            {step === 2 && reservationData.serviceType === 'fullday' && 'Número de Personas'}
            {step === 3 && 'Selecciona las Fechas'}
            {step === 4 && 'Datos Personales'}
            {step === 5 && 'Confirmación'}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {step === 1 && <ServiceSelector onSelect={handleServiceSelect} />}
          
          {step === 2 && reservationData.serviceType === 'hospedaje' && (
            <RoomSelector onSelect={handleRoomSelect} onBack={handleBack} />
          )}
          
          {step === 2 && reservationData.serviceType === 'fullday' && (
            <GuestCounter onSelect={handleGuestSelect} onBack={handleBack} />
          )}
          
          {step === 3 && (
            <DateRangeSelector 
              serviceType={reservationData.serviceType}
              onSelect={handleDateSelect} 
              onBack={handleBack} 
            />
          )}
          
          {step === 4 && (
            <PersonalDataForm 
              onSubmit={handlePersonalDataSubmit} 
              onBack={handleBack}
              initialData={reservationData.personalData}
            />
          )}
          
          {step === 5 && (
            <ReservationConfirmation 
              data={reservationData}
              onClose={handleClose}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};