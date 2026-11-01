import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'tinted';
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  className = '',
  ...props
}) => {
  const variantClasses = {
    default: 'bg-surface-lowest border border-outline-variant/40 shadow-sm',
    flat: 'bg-surface-lowest border border-outline-variant/30',
    tinted: 'bg-surface-low border border-outline-variant/20',
  }[variant];

  return (
    <div
      className={`rounded-card p-5 transition-shadow ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

