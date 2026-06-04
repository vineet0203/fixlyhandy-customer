const Modal = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="customer-modal-overlay" role="dialog" aria-modal="true" onClick={handleOverlayClick}>
      <div className="customer-modal">
        <div className="customer-modal-header">
          <h3 className="customer-modal-title">{title}</h3>
          <button className="customer-modal-close" type="button" aria-label="Close modal" onClick={onClose}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="customer-modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
