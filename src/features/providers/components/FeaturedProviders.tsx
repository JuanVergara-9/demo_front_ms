// src/features/providers/components/FeaturedProviders.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import apiClient from '../../../api/apiClient'; // Reemplazar axios por nuestro apiClient
import { getImageUrl, getInitials } from '../../../utils/imageUtils';
import { Provider } from '../types';
import { categoryService } from '../../categories/services/categoryService';


const FeaturedProviders: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  
  // Cargar los nombres de las categorías al inicio
  useEffect(() => {
    const loadCategoryNames = async () => {
      try {
        // Cargar TODAS las categorías con sus subcategorías
        const categories = await categoryService.getAll();
        // Cargar TODAS las subcategorías (como respaldo)
        
        const map: Record<string, string> = {};
        
        // 1. Mapear categorías principales
        categories.forEach(category => {
          map[category.id.toString()] = category.name;
        });
        
        // 2. Mapear subcategorías - método 1 (desde los objetos de categoría)
        categories.forEach(category => {
          if (category.subcategories && Array.isArray(category.subcategories)) {
            category.subcategories.forEach(subcat => {
              if (typeof subcat === 'object' && subcat.id && subcat.name) {
                map[subcat.id.toString()] = subcat.name;
              }
            });
          }
        });
        
        console.log("Mapa completo de categorías/subcategorías:", map);
        setCategoryMap(map);
      } catch (error) {
        console.error("Error cargando categorías/subcategorías:", error);
      }
    };
    
    loadCategoryNames();
  }, []);

useEffect(() => {
  const fetchProviders = async () => {
    setIsLoading(true);
    try {
      // Usar apiClient en lugar de axios directo
      const response = await apiClient.get('/providers/featured'); 
      console.log("Respuesta de featured providers:", response.data);
      
      // Asegurarnos de que siempre sea un array
      const providersData = Array.isArray(response.data) ? response.data : [];
      setProviders(providersData);
      setError(null);
    } catch (err) {
      console.error("Error al cargar proveedores destacados:", err);
      setError("No se pudieron cargar los proveedores destacados");
      setProviders([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  fetchProviders();
}, []);

  // Renderiza estrellas basadas en el rating
  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar 
            key={star}
            className={star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"} 
            size={20}
          />
        ))}
        <span className="ml-2 text-gray-700 font-medium">{rating || "0.0"}</span>
      </div>
    );
  };

  const getProfession = (provider: Provider) => {
    try {
      // USAR SOLO CATEGORÍAS (sin subcategorías)
      if (provider.categories && Array.isArray(provider.categories) && provider.categories.length > 0) {
        console.log("Categorías encontradas:", JSON.stringify(provider.categories));
        const category = provider.categories[0];
        
        // Si es un objeto con name
        if (typeof category === 'object' && category !== null && category.name) {
          return category.name;
        }
        
        // CASO ESPECIAL: Categoría como array ["16"]
        if (Array.isArray(category) && category.length > 0) {
          const catId = category[0];
          if (categoryMap[catId]) {
            return categoryMap[catId];
          }
        }
        
        // Si es un string
        if (typeof category === 'string') {
          if (categoryMap[category]) {
            return categoryMap[category];
          }
        }
        
        // Si es un id numérico directo
        if (typeof category === 'number') {
          const idStr = String(category);
          if (categoryMap[idStr]) {
            return categoryMap[idStr];
          }
        }
      }
      
      return "Profesional";  // Si no encontramos nada
    } catch (e) {
      console.error("Error procesando categorías:", e);
      return "Profesional";
    }
  };

  // Renderizado del contenido según el estado
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(index => (
            <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded mb-3"></div>
              <div className="h-12 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      );
    }

    if (error || providers.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {error || "No hay proveedores destacados disponibles en este momento."}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {providers.map(provider => {
          const profession = getProfession(provider);
          
          return (
            <div key={provider.id} className="bg-white rounded-lg shadow flex flex-col h-full p-6">
              <div className="flex items-center mb-4">
                <div className="w-20 h-20 overflow-hidden rounded-full bg-gray-100">
                  <img 
                    src={getImageUrl(provider.profilePicture)} 
                    alt={`${provider.firstName} ${provider.lastName}`}
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      // Si falla la carga, intentamos mostrar iniciales
                      const target = e.target as HTMLImageElement;
                      if (target.parentElement) {
                        const initialsDiv = document.createElement('div');
                        initialsDiv.className = 'w-full h-full flex items-center justify-center bg-blue-100 text-blue-500 text-lg font-bold';
                        initialsDiv.innerText = getInitials(provider.firstName, provider.lastName);
                        target.parentElement.replaceChild(initialsDiv, target);
                      } else {
                        target.src = "/assets/default-profile.jpg";
                      }
                    }}
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold">
                    {provider.firstName} {provider.lastName}
                  </h3>
                  <p className="text-gray-600">{profession}</p>
                </div>
              </div>
              
              <div className="mb-3">
  {renderStars(provider.averageRating || provider.rating || 0)}
</div>
              
              <p className="text-gray-700 mb-6 flex-grow line-clamp-3 min-h-[4.5rem]">
                {provider.description || "Servicios profesionales de calidad"}
              </p>
              
              {(provider.city || provider.province) && (
                <div className="flex items-center mb-4 text-gray-500">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>{[provider.city, provider.province].filter(Boolean).join(", ")}</span>
                </div>
              )}
              
              <Link 
                to={`/providers/${provider.id}`} 
                className="block w-full py-3 text-center bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mt-auto text-lg font-medium"
              >
                VER PERFIL
              </Link>
            </div>
          );
        })}
      </div>
    );
  };

  // Componente principal con un único título
  return (
    <>
      <h2 className="text-3xl font-bold mb-6 text-center">Profesionales destacados</h2>
      {renderContent()}
    </>
  );
};

export default FeaturedProviders;