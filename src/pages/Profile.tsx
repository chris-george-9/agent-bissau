import React from 'react';
import { useDelivery } from '../context/DeliveryContext';
import { User, Phone, MapPin, LogOut, Shield, Bell } from 'lucide-react';

export const Profile: React.FC = () => {
  const { agent, toggleOnlineStatus } = useDelivery();

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
        <div className="relative inline-block mb-4">
          <img 
            src={agent.avatarUrl} 
            alt={agent.name} 
            className="w-24 h-24 rounded-full border-4 border-white shadow-md"
          />
          <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white ${agent.isOnline ? 'bg-emerald-500' : 'bg-gray-400'}`} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{agent.name}</h2>
        <p className="text-gray-500 text-sm">ID: {agent.id}</p>

        <div className="grid grid-cols-2 gap-4 mt-6 text-left">
          <div className="bg-gray-50 p-3 rounded-xl">
            <div className="text-xs text-gray-400 mb-1">Phone</div>
            <div className="text-sm font-medium flex items-center gap-2">
              <Phone size={14} />
              {agent.phone}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl">
            <div className="text-xs text-gray-400 mb-1">Zone</div>
            <div className="text-sm font-medium flex items-center gap-2">
              <MapPin size={14} />
              {agent.zone}
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Shield size={18} />
            </div>
            <span className="font-medium text-gray-700">Online Status</span>
          </div>
          <button 
            onClick={toggleOnlineStatus}
            className={`w-12 h-7 rounded-full transition-colors relative ${agent.isOnline ? 'bg-emerald-500' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${agent.isOnline ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
        
        <div className="p-4 flex items-center justify-between border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Bell size={18} />
            </div>
            <span className="font-medium text-gray-700">Notifications</span>
          </div>
          <div className="text-xs text-gray-400">On</div>
        </div>

        <button className="w-full p-4 flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors text-left">
          <div className="p-2 bg-red-50 text-red-600 rounded-lg">
            <LogOut size={18} />
          </div>
          <span className="font-medium">Sign Out</span>
        </button>
      </div>

      <div className="text-center text-xs text-gray-400">
        Bissau Express Agent App v1.0.2
      </div>
    </div>
  );
};
