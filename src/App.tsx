import React, { useState } from 'react';
import { DeliveryProvider } from './context/DeliveryContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Home } from './pages/Home';
import { MyOrders } from './pages/MyOrders';
import { OrderDetails } from './pages/OrderDetails';
import { DeliveriesHistory } from './pages/DeliveriesHistory';
import { Profile } from './pages/Profile';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleNavigateToOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const handleBackFromOrder = () => {
    setSelectedOrderId(null);
  };

  // If an order is selected, show details full screen (overlaying everything)
  if (selectedOrderId) {
    return <OrderDetails orderId={selectedOrderId} onBack={handleBackFromOrder} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-1 px-4 py-4 max-w-md mx-auto w-full pb-24">
        {activeTab === 'home' && <Home onNavigateToOrder={handleNavigateToOrder} />}
        {activeTab === 'orders' && <MyOrders onNavigateToOrder={handleNavigateToOrder} />}
        {activeTab === 'deliveries' && <DeliveriesHistory />}
        {activeTab === 'profile' && <Profile />}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <DeliveryProvider>
      <AppContent />
    </DeliveryProvider>
  );
}
