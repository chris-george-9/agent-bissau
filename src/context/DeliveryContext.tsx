import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order, Agent, ActivityLog, OrderStatus } from '../types';
import { MOCK_ORDERS, MOCK_AGENT, MOCK_ACTIVITY } from '../data/mockData';

interface DeliveryContextType {
  agent: Agent;
  orders: Order[];
  activityLog: ActivityLog[];
  isOffline: boolean;
  toggleOnlineStatus: () => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, details?: Partial<Order>) => void;
  addActivityLog: (message: string, orderId?: string) => void;
  pendingSyncCount: number;
  isOrderPendingSync: (orderId: string) => boolean;
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

export const DeliveryProvider = ({ children }: { children: ReactNode }) => {
  const [agent, setAgent] = useState<Agent>(MOCK_AGENT);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [pendingSyncQueue, setPendingSyncQueue] = useState<any[]>([]);

  // Load initial data
  useEffect(() => {
    // Check local storage first
    const storedOrders = localStorage.getItem('bissau_orders');
    const storedLogs = localStorage.getItem('bissau_logs');
    const storedAgent = localStorage.getItem('bissau_agent');

    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      setOrders(MOCK_ORDERS);
      localStorage.setItem('bissau_orders', JSON.stringify(MOCK_ORDERS));
    }

    if (storedLogs) {
      setActivityLog(JSON.parse(storedLogs));
    } else {
      setActivityLog(MOCK_ACTIVITY);
      localStorage.setItem('bissau_logs', JSON.stringify(MOCK_ACTIVITY));
    }

    if (storedAgent) {
      setAgent(JSON.parse(storedAgent));
    }
  }, []);

  // Network listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Sync queue would happen here
      if (pendingSyncQueue.length > 0) {
        console.log('Syncing pending updates...', pendingSyncQueue);
        setPendingSyncQueue([]);
      }
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingSyncQueue]);

  // Persist changes
  useEffect(() => {
    if (orders.length > 0) localStorage.setItem('bissau_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (activityLog.length > 0) localStorage.setItem('bissau_logs', JSON.stringify(activityLog));
  }, [activityLog]);

  useEffect(() => {
    localStorage.setItem('bissau_agent', JSON.stringify(agent));
  }, [agent]);

  const toggleOnlineStatus = () => {
    setAgent(prev => ({ ...prev, isOnline: !prev.isOnline }));
  };

  const addActivityLog = (message: string, orderId?: string) => {
    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      type: 'status_change',
      message,
      timestamp: new Date().toISOString(),
      orderId,
    };
    setActivityLog(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, details?: Partial<Order>) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status,
          updatedAt: new Date().toISOString(),
          ...details,
        };
      }
      return order;
    }));

    // If offline, add to sync queue (simulated)
    if (isOffline) {
      setPendingSyncQueue(prev => [...prev, { orderId, status, details, timestamp: new Date().toISOString() }]);
    }
    
    // Add log
    addActivityLog(`Updated Order #${orderId} to ${status}`, orderId);
  };

  const isOrderPendingSync = (orderId: string) => {
    return pendingSyncQueue.some(item => item.orderId === orderId);
  };

  return (
    <DeliveryContext.Provider value={{
      agent,
      orders,
      activityLog,
      isOffline,
      toggleOnlineStatus,
      updateOrderStatus,
      addActivityLog,
      pendingSyncCount: pendingSyncQueue.length,
      isOrderPendingSync
    }}>
      {children}
    </DeliveryContext.Provider>
  );
};

export const useDelivery = () => {
  const context = useContext(DeliveryContext);
  if (context === undefined) {
    throw new Error('useDelivery must be used within a DeliveryProvider');
  }
  return context;
};
