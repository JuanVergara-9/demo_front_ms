export const mockReviews = [
  {
    id: 1,
    providerId: 1,
    userId: 101,
    userName: "María García",
    rating: 5,
    comment: "Excelente trabajo, muy profesional y puntual",
    createdAt: "2023-05-10T14:30:00.000Z"
  },
  {
    id: 2,
    providerId: 1,
    userId: 102,
    userName: "Juan Pérez",
    rating: 4,
    comment: "Buen servicio aunque un poco caro",
    createdAt: "2023-05-15T10:20:00.000Z"
  },
  {
    id: 3,
    providerId: 2,
    userId: 103,
    userName: "Roberto Sánchez",
    rating: 5,
    comment: "Muy recomendable, resolvió el problema rápidamente",
    createdAt: "2023-05-18T09:15:00.000Z"
  },
  {
    id: 4,
    providerId: 3,
    userId: 101,
    userName: "María García",
    rating: 4.5,
    comment: "El jardín quedó hermoso, volvería a contratarlo",
    createdAt: "2023-05-20T16:45:00.000Z"
  }
];

// Función helper para obtener reseñas por proveedor
export const getReviewsByProviderId = (providerId: number) => {
  return mockReviews.filter(review => review.providerId === providerId);
};