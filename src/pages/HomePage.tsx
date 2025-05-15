import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import { FeaturedCategories } from '../features/categories';
// Removemos la importación problemática
// import FeaturedProviders from '../features/providers/components/FeaturedProviders';

// Datos mockeados directamente en el componente
const mockFeaturedProviders = [
  {
    id: 1,
    firstName: "Carlos",
    lastName: "Gómez",
    city: "San Rafael",
    description: "Electricista con más de 10 años de experiencia en instalaciones residenciales y comerciales.",
    categories: [2],
    profilePicture: "/image/perfil1.avif",
    averageRating: 4.8,
    profession: "Electricista"
  },
  {
    id: 2,
    firstName: "Ana",
    lastName: "Rodríguez",
    city: "Ciudad de Mendoza",
    description: "Especialista en reparaciones urgentes y mantenimiento de cañerías.",
    categories: [3],
    profilePicture: "/image/perfil2.avif",
    averageRating: 4.6,
    profession: "Plomera"
  },
  {
    id: 3,
    firstName: "Luciano",
    lastName: "Pérez",
    city: "Guaymallén",
    description: "Diseño y mantenimiento de jardines y espacios verdes.",
    categories: [4],
    profilePicture: "/image/perfil3.avif",
    averageRating: 4.9,
    profession: "Jardinero"
  }
];

const HomePage: React.FC = () => {
  // Función para renderizar estrellas
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar 
            key={star}
            className={star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"} 
            size={16}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="home-page">
      {/* Hero Section - se mantiene igual */}
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

      {/* Categorías destacadas - se mantiene igual */}
      <section className="mb-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Categorías populares</h2>
          <FeaturedCategories onCategorySelect={() => {}} />
        </div>
      </section>

      {/* NUEVA SECCIÓN: Proveedores destacados - implementada directamente */}
      <section className="mb-16 py-12 bg-gray-50 rounded-lg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Proveedores destacados</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockFeaturedProviders.map(provider => (
              <Link 
                key={provider.id}
                to={`/providers/${provider.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-5">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden mr-4">
                      {provider.profilePicture ? (
                        <img 
                          src={provider.profilePicture} 
                          alt={`${provider.firstName} ${provider.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 text-xl font-bold">
                          {provider.firstName.charAt(0)}{provider.lastName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{provider.firstName} {provider.lastName}</h3>
                      <p className="text-gray-600">{provider.profession}</p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    {renderStars(provider.averageRating)}
                    <span className="text-sm text-gray-600 ml-2">({provider.averageRating})</span>
                  </div>

                  <div className="mb-3 flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{provider.city}</span>
                  </div>
                  
                  <p className="text-gray-700 line-clamp-2">{provider.description}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link 
              to="/categories" 
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Ver todos los proveedores
            </Link>
          </div>
        </div>
      </section>

      {/* Cómo funciona - se mantiene igual */}
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