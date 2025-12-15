import React, { createContext, useContext, useState } from 'react';

const ReservationContext = createContext();

export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservation must be used within ReservationProvider');
  }
  return context;
};

export const ReservationProvider = ({ children }) => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const openWizard = () => setIsWizardOpen(true);
  const closeWizard = () => setIsWizardOpen(false);

  return (
    <ReservationContext.Provider value={{ isWizardOpen, openWizard, closeWizard }}>
      {children}
    </ReservationContext.Provider>
  );
};
