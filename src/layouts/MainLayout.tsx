import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/navigation/Header';
import BottomNavBar from '../components/navigation/BottomNavBar';

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      {/* Añadimos padding bottom para que el contenido no quede detrás del BottomNavBar */}
      <main className="flex-grow container mx-auto px-4 py-6 pb-20">
        <Outlet />
      </main>
      
      {/* Mostrar BottomNavBar siempre */}
      <BottomNavBar />
    </div>
  );
};

export default MainLayout;