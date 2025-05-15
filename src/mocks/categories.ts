export const mockCategories = [
  {
    id: 1,
    name: 'Hogar',
    slug: 'home',
    description: 'Servicios para el hogar',
    image: '/images/categories/home.jpg'
  },
  {
    id: 2,
    name: 'Electricidad',
    slug: 'electricity',
    description: 'Servicios de electricidad',
    image: '/images/categories/electricity.jpg'
  },
  {
    id: 3,
    name: 'Plomería',
    slug: 'plumbing',
    description: 'Servicios de plomería',
    image: '/images/categories/plumbing.jpg'
  },
  {
    id: 4,
    name: 'Jardinería',
    slug: 'gardening',
    description: 'Servicios de jardinería',
    image: '/images/categories/gardening.jpg'
  }
];

export const mockSubcategories = [
  {
    id: 101,
    name: 'Reparaciones generales',
    categoryId: 1
  },
  {
    id: 102,
    name: 'Limpieza',
    categoryId: 1
  },
  {
    id: 201,
    name: 'Instalaciones eléctricas',
    categoryId: 2
  },
  {
    id: 202,
    name: 'Reparaciones eléctricas',
    categoryId: 2
  },
  {
    id: 301,
    name: 'Instalaciones de agua',
    categoryId: 3
  },
  {
    id: 302,
    name: 'Reparaciones de cañerías',
    categoryId: 3
  },
  {
    id: 401,
    name: 'Mantenimiento',
    categoryId: 4
  },
  {
    id: 402,
    name: 'Diseño de jardines',
    categoryId: 4
  }
];