import React from 'react';
import { Link } from 'react-router-dom';
import { FeaturedCategories } from '../features/categories';
import FeaturedProviders from '../features/providers/components/FeaturedProviders';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section bg-blue-500 text-white py-12 px-4 rounded-lg mb-12">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Encuentra servicios profesionales cerca de ti</h1>
          <p className="text-xl mb-6">Conéctate con miles de proveedores de servicios verificados</p>
          <div className="flex justify-center gap-4">
            <Link to="/categories" className="btn bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md font-medium">
              Buscar Servicios
            </Link>
            <Link to="/become-provider" className="btn bg-transparent border-2 border-white text-white hover:bg-blue-600 px-6 py-3 rounded-md font-medium">
              Ofrecer Servicios
            </Link>
          </div>
        </div>
      </section>

      {/* Categorías destacadas */}
      <section className="mb-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Categorías populares</h2>
          <FeaturedCategories onCategorySelect={() => {}} />
        </div>
      </section>

      {/* NUEVA SECCIÓN: Proveedores destacados */}
      <section className="mb-16 py-12 bg-gray-50 rounded-lg">
        <div className="container mx-auto px-4">
          <FeaturedProviders />
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="how-it-works py-12 bg-gray-50 rounded-lg">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Cómo funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="step text-center">
              <div className="step-icon mb-4 mx-auto bg-blue-100 text-blue-600 w-16 h-16 flex items-center justify-center rounded-full text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">Busca un servicio</h3>
              <p className="text-gray-600">Encuentra profesionales calificados cerca de ti</p>
            </div>
            <div className="step text-center">
              <div className="step-icon mb-4 mx-auto bg-blue-100 text-blue-600 w-16 h-16 flex items-center justify-center rounded-full text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">Compara opciones</h3>
              <p className="text-gray-600">Lee reseñas y encuentra el profesional ideal</p>
            </div>
            <div className="step text-center">
              <div className="step-icon mb-4 mx-auto bg-blue-100 text-blue-600 w-16 h-16 flex items-center justify-center rounded-full text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">Contrata y califica</h3>
              <p className="text-gray-600">Recibe el servicio y comparte tu experiencia</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;