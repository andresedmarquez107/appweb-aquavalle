// Mock data para Cabañas Aquavalle

export const mockRooms = [
  {
    id: '1',
    name: 'Pacho',
    capacity: 7,
    price: 70,
    description: 'Habitación acogedora con capacidad para 7 personas',
    features: ['Cocina equipada', 'Agua caliente', 'TV', 'WiFi', 'Parrillera'],
    images: [
      'https://customer-assets.emergentagent.com/job_valley-cabins/artifacts/x2asbc54_WhatsApp%20Image%202025-12-09%20at%208.00.00%20PM%20%283%29.jpeg'
    ]
  },
  {
    id: '2',
    name: 'D\'Jesus',
    capacity: 8,
    price: 80,
    description: 'Habitación espaciosa con capacidad para 8 personas',
    features: ['Cocina equipada', 'Agua caliente', 'TV', 'WiFi', 'Parrillera'],
    images: [
      'https://customer-assets.emergentagent.com/job_valley-cabins/artifacts/x2asbc54_WhatsApp%20Image%202025-12-09%20at%208.00.00%20PM%20%283%29.jpeg'
    ]
  }
];

export const mockReservations = [
  {
    id: '1',
    type: 'hospedaje',
    room: 'Pacho',
    date: '2025-01-15',
    guests: 6,
    clientName: 'María González',
    clientEmail: 'maria@example.com',
    clientPhone: '+58 424 1234567',
    status: 'confirmed'
  },
  {
    id: '2',
    type: 'fullday',
    date: '2025-01-20',
    guests: 12,
    clientName: 'Carlos Pérez',
    clientEmail: 'carlos@example.com',
    clientPhone: '+58 414 7654321',
    status: 'confirmed'
  }
];

export const facilityImages = [
  'https://customer-assets.emergentagent.com/job_valley-cabins/artifacts/wo7fptz2_WhatsApp%20Image%202025-12-09%20at%208.00.01%20PM.jpeg',
  'https://customer-assets.emergentagent.com/job_valley-cabins/artifacts/rr6x5djj_WhatsApp%20Image%202025-12-09%20at%208.00.01%20PM%20%281%29.jpeg',
  'https://customer-assets.emergentagent.com/job_valley-cabins/artifacts/fdso9lve_WhatsApp%20Image%202025-12-09%20at%208.00.01%20PM%20%282%29.jpeg',
  'https://customer-assets.emergentagent.com/job_valley-cabins/artifacts/16fe3e80_WhatsApp%20Image%202025-12-09%20at%208.00.01%20PM%20%283%29.jpeg',
  'https://customer-assets.emergentagent.com/job_b332f2ac-25a2-4e76-957a-76b6f8f629f5/artifacts/971usz7d_Captura%20de%20pantalla%202025-12-09%20191206.png'
];

export const rules = [
  {
    title: 'Horario de silencio',
    description: 'Para respetar el descanso de todos, el volumen de la música y ruidos fuertes debe moderarse a partir de las 10:00 p.m. La música debe apagarse por completo a las 12am en las áreas comunes.'
  },
  {
    title: 'Cuidado de las instalaciones',
    description: 'Mantenga las cabañas y áreas comunes en buen estado. Cualquier daño ocasionado será responsabilidad del huésped.'
  },
  {
    title: 'Conducta apropiada',
    description: 'No se permiten conductas inapropiadas o inmorales en las áreas exteriores de las cabañas ni en espacios comunes.'
  },
  {
    title: 'Uso de áreas comunes',
    description: 'Respete el mobiliario y evite dejar basura fuera de los espacios designados.'
  },
  {
    title: 'No fumar',
    description: 'No fumar dentro de las cabañas.'
  },
  {
    title: 'Capacidad de reserva',
    description: 'No se permite el ingreso de más personas de las establecidas en la reserva.'
  },
  {
    title: 'Equipo de sonido',
    description: 'Prohibido el ingreso de cualquier tipo de equipo de sonido, solo se permite el uso del sonido proporcionado por las instalaciones.'
  },
  {
    title: 'Sustancias prohibidas',
    description: 'Prohibido el uso de drogas y sustancias ilícitas. El incumplimiento será motivo de desalojo inmediato.'
  },
  {
    title: 'Objetos de valor',
    description: 'Cabañas AquaValle no se hace responsable por objetos de valor olvidados dentro de las instalaciones.'
  },
  {
    title: 'Sanciones',
    description: 'El incumplimiento de estas normas puede conllevar sanciones, incluyendo la expulsión sin derecho a reembolso.'
  }
];

export const hospedajeIncludes = [
  'Check-in: 2pm',
  'Check out: 12pm',
  'Cocina equipada',
  'Parrillera',
  'Agua caliente',
  'TV',
  'WiFi',
  'Mesa de pool',
  'Ping pong y dominó',
  'Piscina climatizada',
  'Cancha de bolas criollas'
];

export const fulldayIncludes = [
  'Entrada: 9am',
  'Salida: 7pm',
  'Parrillera',
  'Mesa de pool',
  'Ping pong y dominó',
  'Piscina climatizada',
  'Cancha de bolas criollas'
];

export const WHATSAPP_NUMBER = '584247739434';
export const FULLDAY_PRICE = 5;
export const MAX_FULLDAY_CAPACITY = 20;