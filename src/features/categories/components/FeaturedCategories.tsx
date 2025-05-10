import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Category } from '../types';
import { 
  FaCut, FaCar, FaTools, FaPaw, 
  FaGraduationCap, FaCalendarDay, FaHome, 
  FaUtensils, FaMicrochip, FaHeartbeat 
} from 'react-icons/fa';

interface FeaturedCategoriesProps {
  onCategorySelect: (category: Category) => void;
}

// Datos de fallback en caso de que la API no funcione
const fallbackCategories = [
  { 
    id: 1, 
    name: 'Cuidado de mascotas', 
    slug: 'pets',
    description: 'Servicios de cuidado y atención para tus mascotas' 
  },
  { 
    id: 2, 
    name: 'Reparaciones del hogar', 
    slug: 'home',
    description: 'Servicios de mantenimiento y reparación para tu hogar' 
  },
  { 
    id: 3, 
    name: 'Educación y enseñanza', 
    slug: 'education',
    description: 'Clases particulares y apoyo académico' 
  }
];

// Definir los mapeos faltantes
const categoryIcons: Record<string, React.ReactNode> = {
  'beauty': <FaCut />,
  'car': <FaCar />,
  'construction': <FaTools />,
  'pets': <FaPaw />,
  'education': <FaGraduationCap />,
  'event': <FaCalendarDay />,
  'home': <FaHome />,
  'food': <FaUtensils />,
  'tech': <FaMicrochip />,
  'health': <FaHeartbeat />,
  'default': <FaTools />
};

const categoryColors: Record<string, string> = {
  'beauty': 'bg-pink-100 text-pink-600',
  'car': 'bg-blue-100 text-blue-600',
  'construction': 'bg-amber-100 text-amber-600',
  'pets': 'bg-green-100 text-green-600',
  'education': 'bg-indigo-100 text-indigo-600',
  'event': 'bg-purple-100 text-purple-600',
  'home': 'bg-teal-100 text-teal-600',
  'food': 'bg-red-100 text-red-600',
  'tech': 'bg-gray-100 text-gray-600',
  'health': 'bg-emerald-100 text-emerald-600',
  'default': 'bg-gray-100 text-gray-600'
};

const categoryDescriptions: Record<string, string> = {
  'beauty': 'Peluquería, maquillaje, uñas y estética',
  'car': 'Reparaciones, mantenimiento y diagnóstico',
  'construction': 'Albañilería, plomería y electricidad',
  'pets': 'Grooming, paseo y atención veterinaria',
  'education': 'Clases particulares y apoyo académico',
  'event': 'Organización, catering y decoración',
  'home': 'Limpieza, jardinería y decoración',
  'food': 'Chefs a domicilio y catering gourmet',
  'tech': 'Reparación y soporte informático',
  'health': 'Terapias, nutrición y bienestar',
  'default': 'Encuentra servicios profesionales en esta categoría'
};

const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ onCategorySelect }) => {
  const [featuredCategories, setFeaturedCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedCategories = async () => {
      try {
        // Probar diferentes endpoints para encontrar el correcto
        const url = 'http://localhost:3000/api/categories';
        console.log('Intentando cargar categorías desde:', url);
        
        const response = await axios.get(url);
        console.log('Respuesta de categorías:', response.data);
        
        if (Array.isArray(response.data) && response.data.length > 0) {
          setFeaturedCategories(response.data.slice(0, 3));
        } else {
          console.warn("Respuesta válida pero sin datos, usando fallback");
          setFeaturedCategories(fallbackCategories as Category[]);
        }
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        console.warn("Usando datos de fallback");
        setFeaturedCategories(fallbackCategories as Category[]);
      } finally {
        setIsLoading(false);
      }
    };
  
    loadFeaturedCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 mb-4"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-3"></div>
              <div className="h-3 w-5/6 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Asegurarse de que siempre hay categorías para mostrar
  const categoriesToRender = featuredCategories.length > 0 ? featuredCategories : fallbackCategories as Category[];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {categoriesToRender.map(category => {
        const slug = category.slug?.toLowerCase() || 'default';
        const icon = categoryIcons[slug] || categoryIcons['default'];
        const colorClasses = categoryColors[slug] || categoryColors['default'];
        const description = categoryDescriptions[slug] || category.description || categoryDescriptions['default'];

        return (
          <div 
            key={category.id}
            onClick={() => onCategorySelect(category)}
            className="group bg-white rounded-lg shadow hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
            role="button"
            aria-label={`Ver categoría ${category.name}`}
          >
            <div className="p-6 flex flex-col items-center">
              <div className={`${colorClasses} w-20 h-20 rounded-full flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform duration-300`}>
                {category.imageUrl ? (
                  <img 
                    src={category.imageUrl} 
                    alt={category.name}
                    className="h-10 w-10 object-contain" 
                  />
                ) : (
                  <>{icon}</>
                )}
              </div>
              <h3 className="text-lg font-semibold text-center mb-2 text-gray-800">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500 text-center">
                {description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeaturedCategories;