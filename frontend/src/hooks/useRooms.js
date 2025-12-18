import { useState, useEffect } from 'react';
import { roomsAPI } from '../services/api';

export const useRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const data = await roomsAPI.getAll();
        setRooms(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error loading rooms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return { rooms, loading, error };
};
