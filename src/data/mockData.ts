import { Order, Agent, ActivityLog } from '../types';

export const MOCK_AGENT: Agent = {
  id: 'AG-001',
  name: 'Antonio Silva',
  phone: '+245 96 123 4567',
  zone: 'Bissau Central',
  isOnline: true,
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Antonio',
  stats: {
    weeklyDeliveries: 42,
    successRate: 95,
    avgTimePerDelivery: '25m',
  },
};

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-7829',
    recipient: {
      name: 'Maria Da Silva',
      phone: '+245 95 555 0101',
      whatsapp: '+245 95 555 0101',
      address: 'Rua 14, Bairro de Ajuda',
      landmark: 'Near the yellow pharmacy',
      coordinates: { lat: 11.8636, lng: -15.5977 },
    },
    items: [
      { id: 'ITM-1', name: 'Family Essentials Pack', quantity: 1, isBundle: true, items: ['Rice 5kg', 'Oil 1L', 'Sugar 2kg'] },
      { id: 'ITM-2', name: 'Nido Milk Powder', quantity: 2, isBundle: false },
    ],
    status: 'Assigned',
    assignedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    otp: '1234',
  },
  {
    id: 'ORD-7830',
    recipient: {
      name: 'Joao Pereira',
      phone: '+245 96 555 0202',
      whatsapp: '+245 96 555 0202',
      address: 'Avenida dos Combatentes',
      landmark: 'Behind the main market',
      coordinates: { lat: 11.8600, lng: -15.6000 },
    },
    items: [
      { id: 'ITM-3', name: 'Hygiene Bundle', quantity: 1, isBundle: true, items: ['Soap x4', 'Toothpaste x2', 'Shampoo'] },
    ],
    status: 'In Transit',
    assignedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    otp: '5678',
  },
  {
    id: 'ORD-7825',
    recipient: {
      name: 'Fatima Gomes',
      phone: '+245 95 555 0303',
      whatsapp: '+245 95 555 0303',
      address: 'Bairro Militar',
      landmark: 'Blue gate house',
      coordinates: { lat: 11.8700, lng: -15.5800 },
    },
    items: [
      { id: 'ITM-4', name: 'Rice 20kg', quantity: 1, isBundle: false },
    ],
    status: 'Delivered',
    assignedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    otp: '9012',
    proofOfDelivery: {
      photoUrl: 'https://picsum.photos/seed/delivery1/400/300',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      coordinates: { lat: 11.8700, lng: -15.5800 },
      confirmedBy: 'Antonio Silva',
    },
  },
  {
    id: 'ORD-7820',
    recipient: {
      name: 'Paulo Mendez',
      phone: '+245 96 555 0404',
      whatsapp: '+245 96 555 0404',
      address: 'Praca Che Guevara',
      landmark: 'Next to the cafe',
      coordinates: { lat: 11.8500, lng: -15.5700 },
    },
    items: [
      { id: 'ITM-5', name: 'Cooking Oil 5L', quantity: 2, isBundle: false },
    ],
    status: 'Failed',
    assignedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    otp: '3456',
    failureReason: 'Recipient not available',
    notes: 'Called 3 times, no answer.',
  },
];

export const MOCK_ACTIVITY: ActivityLog[] = [
  {
    id: 'LOG-1',
    type: 'status_change',
    message: 'Marked Order #ORD-7830 as In Transit',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    orderId: 'ORD-7830',
  },
  {
    id: 'LOG-2',
    type: 'status_change',
    message: 'Delivered Order #ORD-7825',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    orderId: 'ORD-7825',
  },
  {
    id: 'LOG-3',
    type: 'system',
    message: 'Shift started - Online',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
];
