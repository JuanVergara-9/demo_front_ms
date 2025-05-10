// src/features/categories/types.ts
export interface Category {
  id: number;
  name: string;
  description?: string;
  slug?: string;  // Marcado como opcional
  imageUrl?: string;
  icon?: string;
  parentId?: number | null;
  subcategories?: Subcategory[];
  // Nuevas propiedades para manejar la selección de subcategorías
  selectedSubcategoryId?: number;
  selectedSubcategoryName?: string;
}

export interface Subcategory {
  id: number;
  name: string;
  description?: string;
  slug?: string;  // Marcado como opcional
  categoryId: number;
  imageUrl?: string;
}