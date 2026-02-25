import React, { useState, useRef } from 'react';
import { useDelivery } from '../context/DeliveryContext';
import { Order } from '../types';
import { 
  ArrowLeft, Phone, MessageCircle, MapPin, 
  Package, Clock, Camera, CheckCircle, XCircle, Navigation, RefreshCw 
} from 'lucide-react';

interface OrderDetailsProps {
  orderId: string;
  onBack: () => void;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId, onBack }) => {
  const { orders, updateOrderStatus, isOrderPendingSync } = useDelivery();
  const order = orders.find(o => o.id === orderId);
  const isPendingSync = order ? isOrderPendingSync(order.id) : false;
  
  const [view, setView] = useState<'details' | 'pod' | 'failed'>('details');
  const [photo, setPhoto] = useState<string | null>(null);
  const [failureReason, setFailureReason] = useState('');
  const [failureNotes, setFailureNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!order) return <div>Order not found</div>;

  const handleStartDelivery = () => {
    updateOrderStatus(order.id, 'In Transit');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPOD = () => {
    if (!photo) {
      alert('Please take a photo of the delivery.');
      return;
    }

    setIsSubmitting(true);

    // Simulate getting location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateOrderStatus(order.id, 'Delivered', {
          proofOfDelivery: {
            photoUrl: photo,
            timestamp: new Date().toISOString(),
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            confirmedBy: 'Antonio Silva' // Mock agent name
          }
        });
        setIsSubmitting(false);
        onBack();
      },
      (error) => {
        console.error("Location error", error);
        // Fallback if location fails (e.g. permission denied)
        updateOrderStatus(order.id, 'Delivered', {
          proofOfDelivery: {
            photoUrl: photo,
            timestamp: new Date().toISOString(),
            coordinates: { lat: 0, lng: 0 },
            confirmedBy: 'Antonio Silva'
          }
        });
        setIsSubmitting(false);
        onBack();
      }
    );
  };

  const handleSubmitFailure = () => {
    if (!failureReason) {
      alert('Please select a reason.');
      return;
    }
    updateOrderStatus(order.id, 'Failed', {
      failureReason,
      notes: failureNotes
    });
    onBack();
  };

  if (view === 'pod') {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <button onClick={() => setView('details')} className="p-2 -ml-2 text-gray-600">
            <ArrowLeft size={20} />
          </button>
          <h2 className="font-bold text-lg">Confirm Delivery</h2>
        </div>
        
        <div className="p-4 space-y-6 flex-1 overflow-y-auto">
          {/* Step 1: Photo */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Proof of Delivery Photo</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl h-48 flex flex-col items-center justify-center bg-gray-50 cursor-pointer overflow-hidden relative"
            >
              {photo ? (
                <img src={photo} alt="POD" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera className="text-gray-400 mb-2" size={32} />
                  <span className="text-sm text-gray-500">Tap to take photo</span>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                capture="environment"
                className="hidden" 
                onChange={handlePhotoUpload}
              />
            </div>
            <p className="text-xs text-gray-500">
              Please ensure the photo clearly shows the delivered items at the location.
              GPS coordinates will be captured automatically.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleSubmitPOD}
            disabled={isSubmitting || !photo}
            className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Submitting...' : 'Complete Delivery'}
          </button>
        </div>
      </div>
    );
  }

  if (view === 'failed') {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <button onClick={() => setView('details')} className="p-2 -ml-2 text-gray-600">
            <ArrowLeft size={20} />
          </button>
          <h2 className="font-bold text-lg">Report Failed Delivery</h2>
        </div>

        <div className="p-4 space-y-6 flex-1">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Reason for failure</label>
            {['Recipient not available', 'Wrong address', 'Refused delivery', 'Access issue', 'Other'].map(reason => (
              <label key={reason} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  name="reason" 
                  checked={failureReason === reason}
                  onChange={() => setFailureReason(reason)}
                  className="w-4 h-4 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-900">{reason}</span>
              </label>
            ))}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
            <textarea 
              value={failureNotes}
              onChange={(e) => setFailureNotes(e.target.value)}
              placeholder="Add details about the attempt..."
              className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleSubmitFailure}
            disabled={!failureReason}
            className="w-full bg-red-600 text-white py-3.5 rounded-xl font-bold disabled:opacity-50"
          >
            Mark as Failed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-full">
      {/* Header */}
      <div className="sticky top-0 bg-white z-20 border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-gray-900">Order #{order.id}</h2>
            {isPendingSync && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                <RefreshCw size={10} className="animate-spin" />
                Sync
              </span>
            )}
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
            order.status === 'In Transit' ? 'bg-amber-100 text-amber-700' : 
            order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {order.status}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Recipient Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Recipient</h3>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
            <div>
              <div className="text-lg font-bold text-gray-900">{order.recipient.name}</div>
              <div className="flex items-start gap-2 text-gray-600 mt-1">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>{order.recipient.address}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1 ml-6 italic">Note: {order.recipient.landmark}</div>
            </div>

            <div className="flex gap-3 pt-2">
              <a href={`tel:${order.recipient.phone}`} className="flex-1 bg-white border border-gray-200 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Phone size={16} />
                Call
              </a>
              <a href={`https://wa.me/${order.recipient.whatsapp.replace(/\D/g,'')}`} className="flex-1 bg-emerald-50 border border-emerald-100 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100">
                <MessageCircle size={16} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Items to Deliver</h3>
          <div className="space-y-3">
            {order.items.map(item => (
              <div key={item.id} className="border border-gray-200 rounded-xl p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900">{item.name}</div>
                    {item.isBundle && (
                      <div className="text-xs text-gray-500 mt-1">
                        Contains: {item.items?.join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-100 px-3 py-1 rounded-md text-sm font-bold text-gray-700">
                    x{item.quantity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="space-y-4">
           <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Timeline</h3>
           <div className="border-l-2 border-gray-200 ml-2 space-y-6 pl-6 py-2">
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white ring-2 ring-blue-100" />
                <div className="text-sm font-medium text-gray-900">Assigned to Agent</div>
                <div className="text-xs text-gray-500">{new Date(order.assignedAt).toLocaleString()}</div>
              </div>
              {order.status !== 'Assigned' && (
                 <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-500 border-2 border-white ring-2 ring-amber-100" />
                  <div className="text-sm font-medium text-gray-900">Out for Delivery</div>
                  <div className="text-xs text-gray-500">{new Date(order.updatedAt).toLocaleString()}</div>
                </div>
              )}
              {order.status === 'Delivered' && (
                 <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-100" />
                  <div className="text-sm font-medium text-gray-900">Delivered</div>
                  <div className="text-xs text-gray-500">{new Date(order.updatedAt).toLocaleString()}</div>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-30">
        <div className="max-w-md mx-auto">
          {order.status === 'Assigned' && (
            <button 
              onClick={handleStartDelivery}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
            >
              <Navigation size={20} />
              Start Delivery
            </button>
          )}
          
          {order.status === 'In Transit' && (
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setView('failed')}
                className="bg-red-50 text-red-700 py-3.5 rounded-xl font-bold border border-red-100"
              >
                Report Failure
              </button>
              <button 
                onClick={() => setView('pod')}
                className="bg-emerald-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-200"
              >
                Confirm Delivery
              </button>
            </div>
          )}

          {(order.status === 'Delivered' || order.status === 'Failed') && (
            <div className="text-center text-gray-500 font-medium py-2 bg-gray-50 rounded-xl">
              Order {order.status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
