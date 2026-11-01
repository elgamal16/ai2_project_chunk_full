import React from 'react';
import { Inbox } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-card bg-surface-lowest border border-dashed border-outline-variant/60 ${className}`}
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container text-on-surface-variant mb-3">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-semibold text-on-surface">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-on-surface-variant max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

