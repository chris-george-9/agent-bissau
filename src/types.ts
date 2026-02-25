
export type OrderStatus = 'Assigned' | 'In Transit' | 'Delivered' | 'Failed';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  isBundle: boolean;
  items?: string[]; // If it's a bundle, list contents
}

export interface Recipient {
  name: string;
  phone: string;
  whatsapp: string;
  address: string;
  landmark: string;
  coordinates: { lat: number; lng: number };
}

export interface Order {
  id: string;
  recipient: Recipient;
  items: OrderItem[];
  status: OrderStatus;
  assignedAt: string;
  updatedAt: string;
  otp: string; // The 4-digit code the recipient gives
  notes?: string;
  failureReason?: string;
  reattemptTime?: string;
  proofOfDelivery?: {
    photoUrl: string;
    timestamp: string;
    coordinates: { lat: number; lng: number };
    confirmedBy: string;
  };
}

export interface Agent {
  id: string;
  name: string;
  phone: string;
  zone: string;
  isOnline: boolean;
  avatarUrl: string;
  stats: {
    weeklyDeliveries: number;
    successRate: number;
    avgTimePerDelivery: string;
  };
}

export interface ActivityLog {
  id: string;
  type: 'status_change' | 'system';
  message: string;
  timestamp: string;
  orderId?: string;
}
