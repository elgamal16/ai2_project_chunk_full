import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-control transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none min-h-[44px]';

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-hover active:bg-primary-hover',
    secondary: 'bg-primary-container text-white hover:opacity-90 active:opacity-95',
    outline: 'border border-outline-variant text-on-surface bg-surface-lowest hover:bg-surface-container',
    danger: 'bg-error text-white hover:opacity-90',
    ghost: 'text-on-surface hover:bg-surface-container/60',
  }[variant];

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base',
  }[size];

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin me-2" aria-hidden="true" />
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

