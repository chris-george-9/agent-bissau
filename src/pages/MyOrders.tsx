import React, { useState } from 'react';
import { useDelivery } from '../context/DeliveryContext';
import { OrderCard } from '../components/OrderCard';
import { Search, Filter, Package } from 'lucide-react';

interface MyOrdersProps {
  onNavigateToOrder: (orderId: string) => void;
}

export const MyOrders: React.FC<MyOrdersProps> = ({ onNavigateToOrder }) => {
  const { orders } = useDelivery();
  const [filter, setFilter] = useState<'All' | 'Assigned' | 'In Transit' | 'Completed' | 'Failed'>('All');
  const [search, setSearch] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'All' 
      ? true 
      : filter === 'Completed' 
        ? order.status === 'Delivered' 
        : order.status === filter;
    
    const matchesSearch = 
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.recipient.name.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Sort: In Transit first, then Assigned, then others by date
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const statusPriority = { 'In Transit': 0, 'Assigned': 1, 'Delivered': 2, 'Failed': 3 };
    if (statusPriority[a.status] !== statusPriority[b.status]) {
      return statusPriority[a.status] - statusPriority[b.status];
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 bg-gray-50 pt-2 pb-4 z-10 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search Order ID or Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {['All', 'Assigned', 'In Transit', 'Completed', 'Failed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filter === f 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3 flex-1 overflow-y-auto">
        {sortedOrders.length > 0 ? (
          sortedOrders.map(order => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onClick={() => onNavigateToOrder(order.id)} 
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Package size={48} className="mb-3 opacity-20" />
            <p className="text-sm">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};
