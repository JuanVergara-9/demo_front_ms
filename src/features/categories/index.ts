// src/features/categories/index.ts
// Componentes
export { default as CategoryItem } from './components/CategoryItem';
export { default as CategoryList } from './components/CategoryList';
export { default as CategorySearch } from './components/CategorySearch';
export { default as FeaturedCategories } from './components/FeaturedCategories';
export { default as SubcategoryList } from './components/SubcategoryList';
export { default as SubcategoryTabs } from './components/SubcategoryTabs';

// Páginas
export { default as CategoryDetailPage } from './pages/CategoryDetailPage';
export { default as CategoryPage } from './pages/CategoryPage';

// Servicios
export { categoryService } from './services/categoryService';

// Tipos
export * from './types';