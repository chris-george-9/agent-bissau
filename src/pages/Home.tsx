import React from 'react';
import { useDelivery } from '../context/DeliveryContext';
import { Package, CheckCircle, AlertTriangle, TrendingUp, Navigation } from 'lucide-react';
import { Order } from '../types';

interface HomeProps {
  onNavigateToOrder: (orderId: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigateToOrder }) => {
  const { orders, activityLog } = useDelivery();

  const today = new Date().toDateString();
  const assignedToday = orders.filter(o => new Date(o.assignedAt).toDateString() === today).length;
  const completedToday = orders.filter(o => o.status === 'Delivered' && new Date(o.updatedAt).toDateString() === today).length;
  const failedToday = orders.filter(o => o.status === 'Failed' && new Date(o.updatedAt).toDateString() === today).length;
  
  // Mock earnings calculation
  const earnings = completedToday * 1500; // 1500 XOF per delivery

  const activeOrder = orders.find(o => o.status === 'In Transit');

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
          <div className="text-blue-500 mb-1"><Package size={20} /></div>
          <div className="text-2xl font-bold text-blue-900">{assignedToday}</div>
          <div className="text-xs text-blue-700">Assigned Today</div>
        </div>
        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
          <div className="text-emerald-500 mb-1"><CheckCircle size={20} /></div>
          <div className="text-2xl font-bold text-emerald-900">{completedToday}</div>
          <div className="text-xs text-emerald-700">Completed</div>
        </div>
        <div className="bg-red-50 p-3 rounded-xl border border-red-100">
          <div className="text-red-500 mb-1"><AlertTriangle size={20} /></div>
          <div className="text-2xl font-bold text-red-900">{failedToday}</div>
          <div className="text-xs text-red-700">Failed</div>
        </div>
        <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
          <div className="text-amber-500 mb-1"><TrendingUp size={20} /></div>
          <div className="text-2xl font-bold text-amber-900">{earnings.toLocaleString()}</div>
          <div className="text-xs text-amber-700">Earned (XOF)</div>
        </div>
      </div>

      {/* Active Delivery Banner */}
      {activeOrder && (
        <div className="bg-gray-900 rounded-xl p-4 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Navigation size={80} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              In Progress
            </div>
            <h3 className="text-lg font-bold mb-1">{activeOrder.recipient.name}</h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-1">{activeOrder.recipient.address}</p>
            <button 
              onClick={() => onNavigateToOrder(activeOrder.id)}
              className="w-full bg-white text-gray-900 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
            >
              Continue Delivery
            </button>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3 px-1">Recent Activity</h3>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          {activityLog.slice(0, 5).map(log => (
            <div key={log.id} className="p-3 flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2 shrink-0" />
              <div>
                <p className="text-sm text-gray-700">{log.message}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            </div>
          ))}
          {activityLog.length === 0 && (
            <div className="p-4 text-center text-gray-400 text-sm">No recent activity</div>
          )}
        </div>
      </div>
    </div>
  );
};
