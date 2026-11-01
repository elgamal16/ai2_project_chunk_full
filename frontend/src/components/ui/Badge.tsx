import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'high' | 'medium' | 'low' | 'neutral' | 'teal' | 'error' | 'warning';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const variantClasses = {
    high: 'bg-risk-high-bg text-risk-high-fg border-risk-high-fg/30',
    medium: 'bg-risk-medium-bg text-risk-medium-fg border-risk-medium-fg/30',
    low: 'bg-risk-low-bg text-risk-low-fg border-risk-low-fg/30',
    neutral: 'bg-surface-container text-on-surface-variant border-outline-variant/40',
    teal: 'bg-primary-container/10 text-primary-container border-primary-container/30',
    error: 'bg-error-container text-error border-error/30',
    warning: 'bg-risk-medium-bg text-risk-medium-fg border-risk-medium-fg/30',
  }[variant];

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md border font-medium ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

