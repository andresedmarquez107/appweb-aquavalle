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
  },

  getFulldayAvailability: async (startDate, endDate, numGuests) => {
    try {
      const response = await axios.get(`${API}/availability/fullday`, {
        params: {
          start_date: startDate,
          end_date: endDate,
          num_guests: numGuests
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking fullday availability:', error);
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

// Admin API
export const adminAPI = {
  login: async (email, password) => {
    const response = await axios.post(`${API}/admin/login`, { email, password });
    return response.data;
  },

  getStats: async (month, year) => {
    const token = localStorage.getItem('adminToken');
    const params = {};
    if (month) params.month = month;
    if (year) params.year = year;
    
    const response = await axios.get(`${API}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
      params
    });
    return response.data;
  },

  getReservations: async (status, type, month, year) => {
    const token = localStorage.getItem('adminToken');
    const params = {};
    if (status) params.status_filter = status;
    if (type) params.reservation_type = type;
    if (month) params.month = month;
    if (year) params.year = year;
    
    const response = await axios.get(`${API}/admin/reservations`, {
      headers: { Authorization: `Bearer ${token}` },
      params
    });
    return response.data;
  },

  updateReservation: async (id, data) => {
    const token = localStorage.getItem('adminToken');
    const response = await axios.put(`${API}/admin/reservations/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  cancelReservation: async (id) => {
    const token = localStorage.getItem('adminToken');
    const response = await axios.delete(`${API}/admin/reservations/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Availability Blocks
  getBlocks: async () => {
    const token = localStorage.getItem('adminToken');
    const response = await axios.get(`${API}/admin/blocks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  createBlock: async (data) => {
    const token = localStorage.getItem('adminToken');
    const response = await axios.post(`${API}/admin/blocks`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  deleteBlock: async (id) => {
    const token = localStorage.getItem('adminToken');
    const response = await axios.delete(`${API}/admin/blocks/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
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
