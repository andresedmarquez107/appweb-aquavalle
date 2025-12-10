import React from 'react';
import './App.css';
import { Toaster } from './components/ui/sonner';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Rooms } from './components/Rooms';
import { Gallery } from './components/Gallery';
import { Rules } from './components/Rules';
import { Footer } from './components/Footer';
import { FloatingReserveButton } from './components/FloatingReserveButton';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Services />
      <Rooms />
      <Gallery />
      <Rules />
      <Footer />
      <FloatingReserveButton />
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;