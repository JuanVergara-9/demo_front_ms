import { useState, useEffect } from 'react';
import styles from './DemoInfoModal.module.css';

interface DemoInfoModalProps {
  onClose?: () => void;
}

const DemoInfoModal: React.FC<DemoInfoModalProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar si el modal ya fue mostrado en esta sesión
    const modalShown = sessionStorage.getItem('demoModalShown');
    
    if (!modalShown) {
      // Mostrar el modal con un pequeño retraso para mejorar UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Recordar que ya mostramos el modal en esta sesión
    sessionStorage.setItem('demoModalShown', 'true');
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Versión Demo de miservicio</h2>
        <p>
          miservicio está actualmente en su fase de Producto Mínimo Viable (PMV). 
          Debido a inconvenientes con el despliegue de los microservicios del backend, 
          esta demo muestra exclusivamente el funcionamiento del frontend utilizando 
          datos mock (simulados) para ilustrar su lógica y diseño. 
        </p>
        <p>
          El backend real ya se encuentra implementado de forma local y será subido próximamente.
        </p>
        <div className={styles.modalFooter}>
          <button className={styles.primaryButton} onClick={handleClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoInfoModal;