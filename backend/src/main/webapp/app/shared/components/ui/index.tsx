import React from 'react';
import { faSpinner, faArrowUp, faArrowDown, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

// Export new design system components
export * from '../../design-system';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: IconDefinition;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  children,
  onClick,
  type = 'button',
  className = '',
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-250 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-primary-400 text-white hover:bg-primary-500 focus:ring-primary-400 shadow-soft',
    secondary: 'bg-secondary-900 text-white hover:bg-secondary-800 focus:ring-secondary-900 shadow-soft',
    outline: 'border-2 border-gray-300 text-gray-700 hover:border-primary-400 hover:text-primary-400 focus:ring-primary-400',
    ghost: 'text-gray-600 hover:text-primary-400 hover:bg-primary-50 focus:ring-primary-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 shadow-soft',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconElement = icon && (
    <FontAwesomeIcon
      icon={loading ? faSpinner : icon}
      className={`${iconSizeClasses[size]} ${loading ? 'animate-spin' : ''} ${iconPosition === 'right' && children ? 'ml-2' : ''} ${iconPosition === 'left' && children ? 'mr-2' : ''}`}
    />
  );

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {iconPosition === 'left' && iconElement}
      {children}
      {iconPosition === 'right' && iconElement}
    </button>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: IconDefinition;
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down' | 'neutral';
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, trend, color = 'primary', loading = false }) => {
  const colorClasses = {
    primary: 'text-primary-400 bg-primary-50',
    secondary: 'text-secondary-900 bg-secondary-50',
    success: 'text-green-600 bg-green-50',
    warning: 'text-yellow-600 bg-yellow-50',
    danger: 'text-red-600 bg-red-50',
  };

  const trendClasses = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-500',
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-soft border border-gray-200">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-soft border border-gray-200 hover:shadow-medium transition-shadow duration-250">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && (
          <div className={`p-2 rounded ${colorClasses[color]}`}>
            <FontAwesomeIcon icon={icon} className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mb-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>

      <div className="flex items-center justify-between">
        {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
        {trend && (
          <div className={`flex items-center text-sm ${trendClasses[trend.direction]}`}>
            {(() => {
              let trendIcon = faMinus;
              if (trend.direction === 'up') {
                trendIcon = faArrowUp;
              } else if (trend.direction === 'down') {
                trendIcon = faArrowDown;
              }
              return <FontAwesomeIcon icon={trendIcon} className="w-3 h-3 mr-1" />;
            })()}
            <span>
              {trend.value}% {trend.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

interface EmptyStateProps {
  icon?: IconDefinition;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <FontAwesomeIcon icon={icon} className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mb-6">{description}</p>
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
};

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <FontAwesomeIcon icon={faSpinner} className={`${sizeClasses[size]} text-primary-400 animate-spin`} />
    </div>
  );
};
