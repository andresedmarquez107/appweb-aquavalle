import React from 'react';
import { Rooms } from '../components/Rooms';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RoomsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Volver al Inicio
        </Button>
      </div>
      <Rooms />
    </div>
  );
};