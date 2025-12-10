import React from 'react';
import './App.css';
import { Toaster } from './components/ui/sonner';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Rooms } from './components/Rooms';
import { Gallery } from './components/Gallery';
import { Rules } from './components/Rules';
import { ReservationForm } from './components/ReservationForm';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Services />
      <Rooms />
      <Gallery />
      <Rules />
      <ReservationForm />
      <Footer />
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;