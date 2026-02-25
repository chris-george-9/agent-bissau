import React from 'react';
import { Order } from '../types';
import { useDelivery } from '../context/DeliveryContext';
import { MapPin, Package, Clock, ChevronRight, RefreshCw } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onClick: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  const { isOrderPendingSync } = useDelivery();
  const isPendingSync = isOrderPendingSync(order.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Assigned': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'In Transit': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Failed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 active:scale-[0.98] transition-transform cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-medium text-gray-500">#{order.id}</span>
          {isPendingSync && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
              <RefreshCw size={10} className="animate-spin" />
              Sync
            </span>
          )}
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      <h3 className="font-bold text-gray-900 mb-1">{order.recipient.name}</h3>
      
      <div className="space-y-2 mb-3">
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin size={16} className="mt-0.5 shrink-0 text-gray-400" />
          <span className="line-clamp-2">{order.recipient.address}, {order.recipient.landmark}</span>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Package size={14} />
            <span>{order.items.length} Items</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>{new Date(order.assignedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="p-1.5 bg-gray-50 rounded-full text-gray-400">
          <ChevronRight size={16} />
        </div>
      </div>
    </div>
  );
};
