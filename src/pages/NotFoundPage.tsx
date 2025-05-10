// src/pages/NotFoundPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page text-center py-12">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-6">Página no encontrada</h2>
      <p className="text-gray-600 mb-8">
        La página que estás buscando no existe o ha sido movida.
      </p>
      <Link to="/" className="btn bg-blue-500 text-white hover:bg-blue-600 px-6 py-2 rounded-md">
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFoundPage;