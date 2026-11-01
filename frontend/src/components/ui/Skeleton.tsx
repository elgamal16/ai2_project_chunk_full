import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  className = '',
  style,
  ...props
}) => {
  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-control',
    circular: 'rounded-full',
  }[variant];

  const computedStyle: React.CSSProperties = {
    width,
    height,
    ...style,
  };

  return (
    <div
      role="progressbar"
      aria-label="Loading..."
      className={`animate-pulse bg-outline-variant/30 ${variantClasses} ${className}`}
      style={computedStyle}
      {...props}
    />
  );
};

