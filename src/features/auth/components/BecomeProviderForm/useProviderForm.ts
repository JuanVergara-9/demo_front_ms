// src/features/auth/components/BecomeProviderForm/useProviderForm.ts
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { ProviderProfileData } from '../../../providers/types';

// Renombrada para evitar conflicto con FormData global
interface ProviderFormData extends ProviderProfileData {
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

interface FormErrors {
  [key: string]: string;
}

// Interfaz para tipar mejor el usuario
interface UserWithName {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export const useProviderForm = (isNewUser: boolean) => {
  const [formData, setFormData] = useState<ProviderFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthdate: '',
    province: '',
    city: '',
    address: '',
    categories: [],
    subcategories: [],
    description: '',
    profilePicture: null,
    dniCuit: '',
    certificate: null,
    portfolio: null,
    terms: false
  });

  // Estados existentes
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [certificateFileName, setCertificateFileName] = useState<string | null>(null);
  const [portfolioFileName, setPortfolioFileName] = useState<string | null>(null);
  
  // Nuevos estados para el formulario multi-paso
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const navigate = useNavigate();
  const { register, user, becomeProvider, upgradeToProviderRole } = useAuth();

  // Pre-rellenar campos si el usuario ya está autenticado
  useEffect(() => {
    if (!isNewUser && user) {
      // Casting user a nuestro tipo que sí tiene firstName y lastName
      const typedUser = user as unknown as UserWithName;
      
      setFormData(prevData => ({
        ...prevData,
        firstName: typedUser.firstName || '',
        lastName: typedUser.lastName || '',
        email: typedUser.email || '',
      }));
    }
  }, [isNewUser, user]);

  // Función para validar solo el paso actual
  const validateCurrentStep = () => {
    const newErrors: FormErrors = {};
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 100; // 100 años atrás como límite razonable
    const minAgeYear = currentYear - 18; // 18 años como edad mínima
    
    switch(currentStep) {
      case 1: // Datos de Acceso
        if (isNewUser) {
          if (!formData.email.trim()) {
            newErrors.email = 'El email es obligatorio';
          } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Formato de email inválido';
          }
          
          if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria';
          } else if (formData.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
          }
          
          if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
          }
          
          if (!formData.terms) {
            newErrors.terms = 'Debes aceptar los términos y condiciones';
          }
        }
        break;
        
      case 2: // Datos Personales
        if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es obligatorio';
        if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es obligatorio';
        
        if (!formData.phone) {
          newErrors.phone = 'El teléfono es obligatorio';
        } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone)) {
          newErrors.phone = 'Formato de teléfono inválido';
        }
        
        if (!formData.birthdate) {
          newErrors.birthdate = 'La fecha de nacimiento es obligatoria';
        } else {
          const year = new Date(formData.birthdate).getFullYear();
          if (year < minYear || year > minAgeYear) {
            newErrors.birthdate = 'Debes ser mayor de 18 años';
          }
        }
        
        if (!formData.dniCuit.trim()) {
          newErrors.dniCuit = 'El DNI/CUIT es obligatorio';
        } else if (!/^[0-9]{7,11}$/.test(formData.dniCuit.replace(/[^0-9]/g, ''))) {
          newErrors.dniCuit = 'Formato de DNI/CUIT inválido';
        }
        break;
        
      case 3: // Ubicación
        if (!formData.province.trim()) newErrors.province = 'La provincia es obligatoria';
        if (!formData.city.trim()) newErrors.city = 'La ciudad es obligatoria';
        if (!formData.address.trim()) newErrors.address = 'La dirección es obligatoria';
        break;
        
      case 4: // Información Profesional
        if (formData.categories.length === 0) {
          newErrors.categories = 'Debes seleccionar al menos una categoría';
        }
        
        if (!formData.description.trim()) {
          newErrors.description = 'La descripción de tus servicios es obligatoria';
        } else if (formData.description.length < 50) {
          newErrors.description = 'La descripción debe tener al menos 50 caracteres';
        }
        break;
        
      case 5: // Documentación - opcionales sin validación fuerte
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Función para ir al siguiente paso
  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      // Scroll al inicio del formulario para mejor usabilidad
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Función para volver al paso anterior
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    // Scroll al inicio del formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Función para ir a un paso específico (solo pasos anteriores o actual)
  const goToStep = (step: number) => {
    // Validar paso actual antes de permitir saltar
    if (step < currentStep) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === currentStep) {
      // Ya estamos en este paso, no hacemos nada
      return;
    } else {
      // Intentamos avanzar, validamos paso actual
      if (validateCurrentStep()) {
        setCurrentStep(step);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    
    if (files && files[0]) {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: files[0]
      }));
      
      if (name === 'profilePicture') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePreview(reader.result as string);
        };
        reader.readAsDataURL(files[0]);
      } else if (name === 'certificate') {
        setCertificateFileName(files[0].name);
      } else if (name === 'portfolio') {
        setPortfolioFileName(files[0].name);
      }
    }
  };

  const handleCategoriesChange = (categories: number[]) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      categories
    }));
  };

  const handleSubcategoriesChange = (subcategories: number[]) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      subcategories
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Si estamos en el último paso, hacemos submit
    if (currentStep === totalSteps) {
      if (!validateCurrentStep()) return;
      
      setIsLoading(true);
      
      try {
        // Crear FormData para ambos casos (nuevo usuario o usuario existente)
        const formDataToSend = new FormData();
        formDataToSend.append('firstName', formData.firstName);
        formDataToSend.append('lastName', formData.lastName);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('birthdate', formData.birthdate);
        formDataToSend.append('province', formData.province);
        formDataToSend.append('city', formData.city);
        formDataToSend.append('address', formData.address);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('dniCuit', formData.dniCuit);

        // Arrays
        formData.categories.forEach((catId) => {
          formDataToSend.append('categories[]', String(catId));
        });
        formData.subcategories.forEach((subId) => {
          formDataToSend.append('subcategories[]', String(subId));
        });

        // Archivos
        if (formData.profilePicture) {
          formDataToSend.append('profilePicture', formData.profilePicture);
        }
        if (formData.certificate) {
          formDataToSend.append('certificate', formData.certificate);
        }
        if (formData.portfolio) {
          formDataToSend.append('portfolio', formData.portfolio);
        }
        
        if (isNewUser) {
          // ENFOQUE ALTERNATIVO: Separar el flujo para diagnóstico
          try {
            // 1. Primero solo registrar el usuario
            console.log('Registrando nuevo usuario...');
            const registerData = {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              password: formData.password,
            };
            await register(registerData);
            
            // 2. Pequeña pausa para asegurar que el token se haya guardado
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 3. Intentamos actualizar a rol de proveedor
            console.log('Actualización a rol de proveedor...');
            await upgradeToProviderRole();
            
            // 4. Otra pequeña pausa
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 5. Ahora creamos el perfil
            console.log('Creando perfil de proveedor...');
            await becomeProvider(formDataToSend);
            
            toast.success('¡Registro exitoso! Tu perfil de proveedor está en revisión.');
            navigate('/dashboard');
          } catch (err: any) {
            console.error('Error en flujo de registro completo:', err);
            // Mostrar error más específico
            if (err.response?.status === 500) {
              toast.error('Error interno del servidor. Contacte al administrador.');
            } else if (err.response?.status === 404) {
              toast.error('Servicio no disponible en este momento.');
            } else if (err.response?.data?.message) {
              toast.error(`Error: ${err.response.data.message}`);
            } else {
              toast.error('Error en el proceso de registro.');
            }
            throw err;
          }
        } else {
          // Usuario existente que se convierte en proveedor - FLUJO SIMPLIFICADO
          console.log('Usuario existente convirtiéndose en proveedor');
          
          try {
            // Saltarse la actualización de rol y probar directamente a crear perfil
            console.log('Enviando datos del perfil de proveedor...');
            await becomeProvider(formDataToSend);
            
            toast.success('¡Perfil de proveedor creado! Está en revisión.');
            navigate('/dashboard');
          } catch (err: any) {
            console.error('Error detallado:', err);
            
            // Mensajes de error más específicos según el tipo de error
            if (err.response?.status === 401) {
              toast.error('No autorizado. Es posible que necesites iniciar sesión nuevamente.');
              // Opcional: redireccionar a login
              // navigate('/login');
            } else if (err.response?.data?.message) {
              toast.error(`Error: ${err.response.data.message}`);
            } else {
              toast.error('Error al crear perfil de proveedor. Por favor, inténtalo de nuevo.');
            }
            throw err;
          }
        }
      } catch (error: any) {
        console.error('Error al registrar proveedor:', error);
        if (error.message === 'EMAIL_EXISTS') {
          setErrors(prev => ({ ...prev, email: 'Este email ya está registrado' }));
        }
        // No mostrar toast aquí, ya lo manejamos en los bloques try/catch anidados
      } finally {
        setIsLoading(false);
      }
    } else {
      // Si no estamos en el último paso, avanzamos al siguiente paso
      nextStep();
    }
  };

  return {
    formData,
    errors,
    isLoading,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    profilePreview,
    certificateFileName,
    portfolioFileName,
    // Nuevas propiedades para navegación multi-paso
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    goToStep,
    // Handlers
    handleChange,
    handleFileChange,
    handleCategoriesChange,
    handleSubcategoriesChange,
    handleSubmit
  };
};