import './Modal.css';

export function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <button className="close-button" onClick={onClose}>
          &times; {/* Símbolo de X */}
        </button>
        
        {children}
        
      </div>
    </div>
  );
}