// src/components/layout/AuthLayout.tsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col">
      <header className="py-4">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-block">
            <span className="text-xl font-bold text-blue-600">miservicio</span>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center">
        <Outlet />
      </main>
      
      <footer className="py-4 text-center text-sm text-gray-600">
        <div className="container mx-auto px-4">
          © {new Date().getFullYear()} Mi Servicio. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;