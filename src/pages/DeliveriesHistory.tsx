import React from 'react';
import { useDelivery } from '../context/DeliveryContext';
import { Truck, XCircle, CheckCircle } from 'lucide-react';

export const DeliveriesHistory: React.FC = () => {
  const { orders } = useDelivery();
  const history = orders.filter(o => o.status === 'Delivered' || o.status === 'Failed')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const total = history.length;
  const delivered = history.filter(o => o.status === 'Delivered').length;
  const failed = history.filter(o => o.status === 'Failed').length;
  const successRate = total > 0 ? Math.round((delivered / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Performance</h2>
        <div className="flex justify-between text-center">
          <div>
            <div className="text-3xl font-bold">{total}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Total</div>
          </div>
          <div className="w-px bg-gray-700"></div>
          <div>
            <div className="text-3xl font-bold text-emerald-400">{successRate}%</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Success Rate</div>
          </div>
          <div className="w-px bg-gray-700"></div>
          <div>
            <div className="text-3xl font-bold text-red-400">{failed}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Failed</div>
          </div>
        </div>
      </div>

      {/* List */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3 px-1">History</h3>
        <div className="space-y-3">
          {history.map(order => (
            <div key={order.id} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-gray-500">#{order.id}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{new Date(order.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="font-bold text-gray-900">{order.recipient.name}</div>
                {order.status === 'Failed' && (
                  <div className="mt-1">
                    <div className="text-xs text-red-600 font-medium">Reason: {order.failureReason}</div>
                    {order.notes && (
                      <div className="text-xs text-gray-500 italic mt-0.5">"{order.notes}"</div>
                    )}
                  </div>
                )}
              </div>
              <div className={`p-2 rounded-full ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {order.status === 'Delivered' ? <CheckCircle size={20} /> : <XCircle size={20} />}
              </div>
            </div>
          ))}
          {history.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Truck size={48} className="mx-auto mb-3 opacity-20" />
              <p>No delivery history yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
