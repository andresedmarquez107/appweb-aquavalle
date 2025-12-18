import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Rooms API
export const roomsAPI = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API}/rooms/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API}/rooms/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching room:', error);
      throw error;
    }
  }
};

// Availability API
export const availabilityAPI = {
  getRoomAvailability: async (roomId, startDate, endDate) => {
    try {
      const response = await axios.get(`${API}/availability/rooms/${roomId}`, {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking room availability:', error);
      throw error;
    }
  },

  getAllRoomsAvailability: async (startDate, endDate) => {
    try {
      const response = await axios.get(`${API}/availability/rooms`, {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  }
};

// Reservations API
export const reservationsAPI = {
  create: async (reservationData) => {
    try {
      const response = await axios.post(`${API}/reservations/`, reservationData);
      return response.data;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  },

  getAll: async (skip = 0, limit = 100) => {
    try {
      const response = await axios.get(`${API}/reservations/`, {
        params: { skip, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API}/reservations/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reservation:', error);
      throw error;
    }
  },

  checkAvailability: async (availabilityData) => {
    try {
      const response = await axios.post(`${API}/reservations/check-availability/`, availabilityData);
      return response.data;
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  }
};

// WhatsApp Integration
export const generateWhatsAppLink = (reservationData) => {
  const WHATSAPP_NUMBER = '584247739434';
  
  let message = `Hola! Quiero confirmar mi reserva:\n\n`;
  message += `Tipo de Servicio: ${reservationData.reservation_type === 'fullday' ? 'Full Day' : 'Hospedaje'}\n\n`;
  
  if (reservationData.reservation_type === 'hospedaje') {
    message += `Habitaciones:\n`;
    reservationData.rooms.forEach(room => {
      message += `   - ${room}\n`;
    });
    message += `\n`;
  } else {
    message += `Personas: ${reservationData.num_guests}\n`;
    message += `Total: €${reservationData.total_price}\n\n`;
  }
  
  message += `Fecha de entrada: ${reservationData.check_in_date}\n`;
  if (reservationData.check_out_date) {
    message += `Fecha de salida: ${reservationData.check_out_date}\n`;
  }
  message += `\n`;
  
  message += `Datos del Cliente:\n`;
  message += `   Nombre: ${reservationData.client_name}\n`;
  message += `   Documento: ${reservationData.client_document}\n`;
  message += `   Telefono: ${reservationData.client_phone}\n`;
  if (reservationData.client_email) {
    message += `   Email: ${reservationData.client_email}\n`;
  }
  
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

// Open WhatsApp with error handling
export const openWhatsApp = (reservationData) => {
  const link = generateWhatsAppLink(reservationData);
  
  // Try to open in new window
  const newWindow = window.open(link, '_blank', 'noopener,noreferrer');
  
  // If popup was blocked, try location.href as fallback
  if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
    window.location.href = link;
  }
};
