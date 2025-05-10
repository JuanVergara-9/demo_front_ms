// src/features/providers/components/ProviderStatsSummary.tsx
import React from 'react';
import { useProviderStats } from '../hooks/useProviderStats';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import './ProviderStatsSummary.scss'; // Crea este archivo de estilos

interface ProviderStatsSummaryProps {
  providerId: number;
}

const ProviderStatsSummary: React.FC<ProviderStatsSummaryProps> = ({ providerId }) => {
  const { stats, isLoading, error } = useProviderStats(providerId);
  
  if (isLoading) {
    return <div className="text-center py-3"><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  // Usar datos seguros con valores por defecto
  const safeStats = stats || {
    services: 0,
    reviews: 0,
    jobs: 0, 
    rating: 0,
    views: 0
  };

  return (
    <div className="stats-summary card mb-4">
      <div className="card-header bg-light">
      </div>
      
      <div className="card-body">
        <div className="row stats-row">
          {/* Servicios */}
          <div className="col stats-item">
            <div className="stats-icon services-icon">
              <i className="bi bi-gear-fill"></i>
            </div>
            <div className="stats-value">{safeStats.services}</div>
            <div className="stats-label">Servicios</div>
          </div>

          {/* Reseñas */}
          <div className="col stats-item">
            <div className="stats-icon reviews-icon">
              <i className="bi bi-chat-left-text-fill"></i>
            </div>
            <div className="stats-value">{safeStats.reviews}</div>
            <div className="stats-label">Reseñas</div>
          </div>

          {/* Trabajos */}
          <div className="col stats-item">
            <div className="stats-icon jobs-icon">
              <i className="bi bi-briefcase-fill"></i>
            </div>
            <div className="stats-value">{safeStats.jobs}</div>
            <div className="stats-label">Trabajos</div>
          </div>

          {/* Calificación */}
          <div className="col stats-item">
            <div className="stats-icon rating-icon">
              <i className="bi bi-star-fill"></i>
            </div>
            <div className="stats-value">
              {safeStats.rating.toFixed(1)} <span className="star-icon">★</span>
            </div>
            <div className="stats-label">Calificación</div>
          </div>

          {/* Visitas */}
          <div className="col stats-item">
            <div className="stats-icon views-icon">
              <i className="bi bi-eye-fill"></i>
            </div>
            <div className="stats-value">{safeStats.views}</div>
            <div className="stats-label">Visitas</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderStatsSummary;