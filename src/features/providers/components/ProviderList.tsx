import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { providerService, AdvancedSearchParams } from '../services/providerService';
import { Provider } from '../types';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { FaUserSlash, FaStar, FaSortAmountDown, FaExclamationTriangle } from 'react-icons/fa';
import { getImageUrl, getInitials } from '../../../utils/imageUtils';

// Ampliamos las props para incluir searchTerm
interface ProvidersListProps {
  categoryId?: number;
  subcategoryId?: number;
  searchTerm?: string;
  location?: string;
  subcategoryName?: string;
  emptyMessage?: string; // Mensaje personalizado cuando no hay resultados
  minRating?: number;   // Añadir esta prop
  sortBy?: string;      // Añadir esta prop
}

// Tipo para los valores de sortBy
type SortByOption = 'rating' | 'reviews' | 'newest';

// Definimos una interfaz para el resultado de búsqueda
interface SearchResult {
  providers?: Provider[];
  [key: string]: any;
}

const ProvidersList: React.FC<ProvidersListProps> = ({ 
  categoryId, 
  subcategoryId,
  searchTerm,
  location,
  subcategoryName,
  emptyMessage,
  minRating: externalMinRating,
  sortBy: externalSortBy
}) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestInfo, setRequestInfo] = useState<string | null>(null); // Para debug
  const [filters, setFilters] = useState({
    rating: externalMinRating !== undefined ? externalMinRating : 0,
    sortBy: (externalSortBy || 'rating') as SortByOption
  });

  // Helper para adaptar los datos del proveedor al formato necesario para la UI
  const formatProviderData = (provider: Provider) => {
    return {
      ...provider,
      // Mapear los campos que necesitamos para mostrar en UI
      displayName: `${provider.firstName || ''} ${provider.lastName || ''}`.trim() || 'Sin nombre',
      displayLocation: [provider.province, provider.city].filter(Boolean).join(', ')
    };
  };

  // Actualizar filtros desde props externas
  useEffect(() => {
    if (externalMinRating !== undefined || externalSortBy !== undefined) {
      setFilters(prev => ({
        rating: externalMinRating !== undefined ? externalMinRating : prev.rating,
        sortBy: (externalSortBy || prev.sortBy) as SortByOption
      }));
    }
  }, [externalMinRating, externalSortBy]);

  useEffect(() => {
    const loadProviders = async () => {
      setIsLoading(true);
      setError(null);
      
      // Debug info - Clarificar qué tipo de solicitud vamos a hacer
      let requestType = '';
      if (searchTerm) requestType = 'BÚSQUEDA';
      else if (subcategoryId) requestType = 'SUBCATEGORÍA';
      else if (categoryId) requestType = 'CATEGORÍA';
      else requestType = 'TODOS';
      
      console.log(`📊 [ProvidersList] Solicitando proveedores - Tipo: ${requestType}, ${
        searchTerm ? `Término: "${searchTerm}"` : 
        subcategoryId ? `SubcategoríaID: ${subcategoryId}` : 
        categoryId ? `CategoríaID: ${categoryId}` : 
        'Todos los proveedores'
      }`);
      
      setRequestInfo(`Realizando petición de tipo: ${requestType}`);
      
      try {
        let data: Provider[] = [];
        
        if (searchTerm) {
          // Código de búsqueda existente
          const searchParams: AdvancedSearchParams = {
            q: searchTerm,
            location: location,
            minRating: filters.rating > 0 ? filters.rating : undefined,
            sortBy: filters.sortBy
          };
          
          console.log(`🔍 [ProvidersList] Buscando con parámetros:`, searchParams);
          const result = await providerService.search(searchParams) as SearchResult | Provider[];
          data = Array.isArray(result) ? result : (result.providers || []);
        }
        else if (subcategoryId) {
          // IMPORTANTE: Explícitamente estamos pidiendo subcategoría
          console.log(`🔍 [ProvidersList] Solicitando por SUBCATEGORÍA ID ${subcategoryId}`);
          
          try {
            const result = await providerService.getBySubcategory(
              subcategoryId, 
              { minRating: filters.rating, sortBy: filters.sortBy }
            ) as SearchResult | Provider[];
            
            console.log(`✅ [ProvidersList] Respuesta recibida para subcategoría ${subcategoryId}: ${
              Array.isArray(result) ? result.length : (result.providers?.length || 0)
            } proveedores`);
            
            data = Array.isArray(result) ? result : (result.providers || []);
          } catch (err: any) {
            console.error('❌ [ProvidersList] Error de solicitud subcategoría:', err);
            
            // Si es error 404, lo interpretamos como "no hay proveedores"
            if (err.response && err.response.status === 404) {
              console.log('👍 [ProvidersList] No hay proveedores para esta subcategoría (404)');
              data = []; // Array vacío, no un error
            } else {
              // Cualquier otro error, lo propagamos
              throw err;
            }
          }
        } else if (categoryId) {
          // IMPORTANTE: Explícitamente estamos pidiendo categoría
          console.log(`🔍 [ProvidersList] Solicitando por CATEGORÍA ID ${categoryId}`);
          
          try {
            const result = await providerService.getByCategory(
              categoryId,
              { minRating: filters.rating, sortBy: filters.sortBy }
            ) as SearchResult | Provider[];
            
            console.log(`✅ [ProvidersList] Respuesta recibida para categoría ${categoryId}: ${
              Array.isArray(result) ? result.length : (result.providers?.length || 0)
            } proveedores`);
            
            data = Array.isArray(result) ? result : (result.providers || []);
          } catch (err: any) {
            console.error('❌ [ProvidersList] Error de solicitud categoría:', err);
            
            // Si es error 404, lo interpretamos como "no hay proveedores"
            if (err.response && err.response.status === 404) {
              console.log('👍 [ProvidersList] No hay proveedores para esta categoría (404)');
              data = []; // Array vacío, no un error
            } else {
              // Cualquier otro error, lo propagamos
              throw err;
            }
          }
        } else {
          // Código genérico existente con tipo explícito
          console.log(`🔍 [ProvidersList] Solicitando TODOS los proveedores`);
          const result = await providerService.getAll({ 
            sortBy: filters.sortBy, 
            limit: 9,
            minRating: filters.rating > 0 ? filters.rating : undefined
          }) as SearchResult | Provider[];
          data = Array.isArray(result) ? result : (result.providers || []);
        }
        
        console.log(`🔢 [ProvidersList] Total proveedores cargados: ${data.length}`);
        setProviders(Array.isArray(data) ? data : []);
        setRequestInfo(null); // Limpiar info después de éxito
      } catch (err) {
        console.error('❌ [ProvidersList] Error al cargar proveedores:', err);
        setError('Hubo un problema al cargar los proveedores. Por favor, intenta nuevamente.');
        setRequestInfo(`Error en solicitud: ${err instanceof Error ? err.message : 'Desconocido'}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProviders();
  }, [categoryId, subcategoryId, searchTerm, location, filters]);

  const handleFilterChange = (newFilters: Partial<{rating: number, sortBy: SortByOption}>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="providers-list">
      {isLoading ? (
        <div className="py-8 flex flex-col items-center justify-center">
          <LoadingSpinner />
          <p className="text-gray-500 mt-3">
            {searchTerm ? `Buscando "${searchTerm}"...` : 
            subcategoryId ? `Cargando proveedores de ${subcategoryName || 'esta subcategoría'}...` :
            categoryId ? 'Cargando proveedores de esta categoría...' : 
            'Cargando proveedores...'}
          </p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error al cargar proveedores
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      ) : (!providers || providers.length === 0) ? (
        <div className="text-center py-10 px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <FaUserSlash className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {emptyMessage || (
              subcategoryId 
                ? `Aún no hay proveedores disponibles${subcategoryName ? ` en ${subcategoryName}` : ''}`
                : searchTerm
                  ? `No se encontraron resultados para "${searchTerm}"`
                  : "No se encontraron proveedores"
            )}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {subcategoryId
              ? "Todavía no tenemos profesionales registrados en esta especialidad."
              : "Prueba con otros criterios de búsqueda o categorías distintas."}
          </p>
          
          {subcategoryId && (
            <Link to="/registro/proveedor" className="inline-flex items-center px-4 py-2 mt-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              ¡Sé el primero en ofrecer este servicio!
            </Link>
          )}
          
          {/* Debug info visible solo durante desarrollo */}
          {process.env.NODE_ENV !== 'production' && (
            <div className="mt-6 text-left text-xs p-3 border-t border-gray-200 pt-4 max-w-md mx-auto">
              <p className="mb-1 text-gray-500">Información de depuración:</p>
              <pre className="bg-gray-50 p-2 rounded text-gray-700 overflow-auto text-xs">
                {JSON.stringify({
                  tipo: subcategoryId ? 'subcategoría' : categoryId ? 'categoría' : 'búsqueda/todos',
                  categoryId,
                  subcategoryId, 
                  subcategoryName,
                  searchTerm,
                  filters
                }, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              {searchTerm 
                ? `Resultados para "${searchTerm}"` 
                : subcategoryId && subcategoryName
                  ? `Proveedores de ${subcategoryName}`
                  : "Proveedores disponibles"}
              <span className="ml-2 text-sm bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full">
                {providers.length}
              </span>
            </h3>
            
            <div className="flex flex-wrap gap-4 mt-2 sm:mt-0">
              <div className="filter-group">
                <label htmlFor="rating-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    Calificación mínima
                  </span>
                </label>
                <select 
                  id="rating-filter"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filters.rating}
                  onChange={(e) => handleFilterChange({ rating: Number(e.target.value) })}
                >
                  <option value={0}>Todas las calificaciones</option>
                  <option value={3}>3+ estrellas</option>
                  <option value={4}>4+ estrellas</option>
                  <option value={4.5}>4.5+ estrellas</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="sort-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center">
                    <FaSortAmountDown className="text-gray-500 mr-1" />
                    Ordenar por
                  </span>
                </label>
                <select 
                  id="sort-filter"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filters.sortBy}
                  onChange={(e) => {
                    const value = e.target.value as SortByOption;
                    handleFilterChange({ sortBy: value });
                  }}
                >
                  <option value="rating">Mejor calificación</option>
                  <option value="reviews">Más reseñas</option>
                  <option value="newest">Más recientes</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {providers.map(provider => {
              // Usar el helper para formatear los datos
              const formattedProvider = formatProviderData(provider);
              
              return (
                <div 
                  key={provider.id}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
                >
                  <div className="p-5 flex flex-col md:flex-row gap-5">
                    {/* Avatar del proveedor */}
                    <div className="w-full md:w-24 h-24 flex-shrink-0 mx-auto md:mx-0">
                      <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center">
                        <img 
                          src={getImageUrl(provider.profilePicture)} 
                          alt={formattedProvider.displayName}
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            // Si falla la carga de la imagen, mostrar iniciales
                            const target = e.target as HTMLImageElement;
                            if (target.parentElement) {
                              const initialsDiv = document.createElement('div');
                              initialsDiv.className = 'w-full h-full flex items-center justify-center bg-blue-100 text-blue-500 text-lg font-bold';
                              initialsDiv.innerText = getInitials(provider.firstName, provider.lastName);
                              target.parentElement.replaceChild(initialsDiv, target);
                            } else {
                              // Fallback absoluto: mostrar imagen predeterminada
                              target.src = "/assets/default-profile.jpg";
                            }
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Información del proveedor */}
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {formattedProvider.displayName}
                        </h3>
                        <div className="flex items-center">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                className={`w-5 h-5 ${i < Math.floor(provider.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm font-medium text-gray-700">
                            {provider.rating?.toFixed(1) || '0.0'}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3">
                        {provider.description?.substring(0, 150) || 'Sin descripción'}
                        {provider.description && provider.description.length > 150 ? '...' : ''}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {provider.subcategories?.slice(0, 3).map(sub => (
                          <span key={sub.id} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                            {sub.name}
                          </span>
                        ))}
                        {formattedProvider.displayLocation && (
                          <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                            {formattedProvider.displayLocation}
                          </span>
                        )}
                      </div>
                      
                      <Link 
                        to={`/providers/${provider.id}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Ver perfil
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProvidersList;