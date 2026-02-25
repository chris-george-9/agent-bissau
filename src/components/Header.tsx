import React from 'react';
import { useDelivery } from '../context/DeliveryContext';
import { Wifi, WifiOff, MapPin } from 'lucide-react';

export const Header: React.FC = () => {
  const { agent, isOffline, toggleOnlineStatus } = useDelivery();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm px-4 py-3">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <div className="flex items-center gap-3">
          <img 
            src={agent.avatarUrl} 
            alt={agent.name} 
            className="w-10 h-10 rounded-full border-2 border-emerald-100"
          />
          <div>
            <h1 className="font-bold text-gray-900 leading-tight">{agent.name}</h1>
            <div className="flex items-center text-xs text-gray-500 gap-1">
              <MapPin size={12} />
              <span>{agent.zone}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={toggleOnlineStatus}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            agent.isOnline 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {agent.isOnline ? 'Online' : 'Offline'}
          <div className={`w-2 h-2 rounded-full ${agent.isOnline ? 'bg-emerald-500' : 'bg-gray-400'}`} />
        </button>
      </div>
      
      {isOffline && (
        <div className="absolute top-full left-0 right-0 bg-amber-500 text-white text-xs py-1 px-4 text-center flex items-center justify-center gap-2">
          <WifiOff size={12} />
          <span>You are currently offline. Changes will sync when connected.</span>
        </div>
      )}
    </header>
  );
};
