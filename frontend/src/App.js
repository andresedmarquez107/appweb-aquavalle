import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingReserveButton } from './components/FloatingReserveButton';
import { ReservationWizard } from './components/ReservationWizard';
import { ReservationProvider, useReservation } from './context/ReservationContext';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { RoomsPage } from './pages/RoomsPage';
import { RulesPage } from './pages/RulesPage';
import { ContactPage } from './pages/ContactPage';

function AppContent() {
  const { isWizardOpen, closeWizard } = useReservation();

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/servicios" element={<ServicesPage />} />
        <Route path="/habitaciones" element={<RoomsPage />} />
        <Route path="/reglas" element={<RulesPage />} />
        <Route path="/contacto" element={<ContactPage />} />
      </Routes>
      <Footer />
      <FloatingReserveButton />
      <ReservationWizard isOpen={isWizardOpen} onClose={closeWizard} />
      <Toaster position="top-center" richColors />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ReservationProvider>
        <AppContent />
      </ReservationProvider>
    </BrowserRouter>
  );
}

export default App;