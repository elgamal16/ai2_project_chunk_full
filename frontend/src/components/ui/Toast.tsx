import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  type?: 'success' | 'error' | 'info';
  message: string;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  type = 'success',
  message,
  isOpen,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (!isOpen || duration <= 0) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-risk-low-fg shrink-0 me-2" />,
    error: <AlertCircle className="w-5 h-5 text-error shrink-0 me-2" />,
    info: <Info className="w-5 h-5 text-primary-container shrink-0 me-2" />,
  };

  const bgClasses = {
    success: 'bg-risk-low-bg border-risk-low-fg/30 text-on-surface',
    error: 'bg-error-container border-error/30 text-error',
    info: 'bg-surface-lowest border-outline-variant/40 text-on-surface',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-4 end-4 z-50 flex items-center px-4 py-3 rounded-card border shadow-lg max-w-md ${bgClasses[type]}`}
    >
      {icons[type]}
      <span className="text-sm font-medium flex-1">{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ms-3 p-1 rounded hover:opacity-75 min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

