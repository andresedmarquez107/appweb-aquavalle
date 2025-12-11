import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingReserveButton } from './components/FloatingReserveButton';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { RoomsPage } from './pages/RoomsPage';
import { RulesPage } from './pages/RulesPage';
import { ContactPage } from './pages/ContactPage';

function App() {
  return (
    <BrowserRouter>
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
        <Toaster position="top-center" richColors />
      </div>
    </BrowserRouter>
  );
}

export default App;