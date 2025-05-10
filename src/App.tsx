// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Auth
import { AuthProvider } from './features/auth/context/AuthContext';
import { LoginPage, RegisterPage, BecomeProviderPage } from './features/auth';
import PrivateRoute from './components/routing/PrivateRoute';

// Páginas principales
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

// Categories
import { CategoryPage, CategoryDetailPage } from './features/categories';

// Profile
import { ProfilePage } from './features/profile';

// Provider
import ProviderDashboardPage from './features/providers/pages/ProviderDashboardPage';
import ProviderProfilePage from './features/providers/pages/ProviderProfilePage';
import PublicProviderProfilePage from './features/providers/pages/PublicProviderProfilePage';

// NUEVO: Importar páginas de reviews
import ReviewsPage from './features/reviews/pages/ReviewsPage';
import MyReviewsPage from './features/reviews/pages/MyReviewsPage';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas con MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/categories/:id" element={<CategoryDetailPage />} />
            
            {/* NUEVO: Ruta pública para ver perfiles de proveedores */}
            <Route path="/providers/:id" element={<PublicProviderProfilePage />} />
            
            {/* NUEVO: Ruta pública para ver reviews de un proveedor específico */}
            <Route path="/providers/:providerId/reviews" element={<ReviewsPage />} />
            
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          
          {/* Rutas de autenticación con AuthLayout */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          
          {/* Rutas privadas con MainLayout */}
          <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
            <Route path="/become-provider" element={<BecomeProviderPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* NUEVO: Ruta para ver mis reviews (solo usuarios autenticados) */}
            <Route path="/reviews/my-reviews" element={<MyReviewsPage />} />
            
            {/* Rutas de proveedor */}
            <Route path="/provider/dashboard" element={<ProviderDashboardPage />} />
            <Route path="/provider/profile" element={<ProviderProfilePage />} />
            
            {/* Otras rutas para implementar */}
            {/* 
            <Route path="/provider/services" element={<ProviderServicesPage />} />
            <Route path="/provider/schedule" element={<ProviderSchedulePage />} />
            */}
          </Route>
        </Routes>
        
        <ToastContainer 
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
        />
      </AuthProvider>
    </Router>
  );
};

export default App;