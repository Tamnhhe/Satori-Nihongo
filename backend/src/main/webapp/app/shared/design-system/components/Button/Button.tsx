import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useKeyboardNavigation, useAriaAttributes } from '../../../hooks/useAccessibility';
import './Button.scss';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  icon?: IconDefinition;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-pressed'?: boolean;
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  id?: string;
  role?: string;
  tabIndex?: number;
  autoFocus?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  onKeyDown,
  type = 'button',
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-expanded': ariaExpanded,
  'aria-pressed': ariaPressed,
  'aria-current': ariaCurrent,
  id,
  role,
  tabIndex,
  autoFocus = false,
}) => {
  const buttonClasses = [
    'satori-button',
    `satori-button--${variant}`,
    `satori-button--${size}`,
    fullWidth && 'satori-button--full-width',
    loading && 'satori-button--loading',
    disabled && 'satori-button--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconElement = icon && (
    <FontAwesomeIcon
      icon={loading ? faSpinner : icon}
      className={`satori-button__icon satori-button__icon--${iconPosition} ${loading ? 'satori-button__icon--spinning' : ''}`}
      aria-hidden="true"
    />
  );

  // Enhanced keyboard navigation
  const { handleKeyDown: handleKeyboardNav } = useKeyboardNavigation(() => onClick && onClick({} as React.MouseEvent<HTMLButtonElement>));

  const handleKeyDownEvent = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (onKeyDown) {
      onKeyDown(event);
    }
    if (!event.defaultPrevented) {
      handleKeyboardNav(event.nativeEvent);
    }
  };

  // ARIA attributes
  const ariaAttributes = useAriaAttributes(
    role,
    ariaLabel || (typeof children === 'string' ? children : undefined),
    undefined,
    ariaDescribedBy,
    ariaExpanded,
    undefined,
    disabled || loading,
    undefined,
    undefined,
    ariaCurrent,
  );

  // Additional ARIA attributes
  if (ariaPressed !== undefined) {
    ariaAttributes['aria-pressed'] = ariaPressed;
  }

  return (
    <button
      id={id}
      type={type}
      className={buttonClasses}
      onClick={onClick}
      onKeyDown={handleKeyDownEvent}
      disabled={disabled || loading}
      tabIndex={tabIndex}
      autoFocus={autoFocus}
      {...ariaAttributes}
    >
      {loading && <span className="sr-only">Loading...</span>}
      {iconPosition === 'left' && iconElement}
      <span className="satori-button__content">{children}</span>
      {iconPosition === 'right' && iconElement}
    </button>
  );
};

export interface IconButtonProps {
  icon: IconDefinition;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  'aria-label': string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-pressed'?: boolean;
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  id?: string;
  role?: string;
  tabIndex?: number;
  autoFocus?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'ghost',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  onKeyDown,
  type = 'button',
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-expanded': ariaExpanded,
  'aria-pressed': ariaPressed,
  'aria-current': ariaCurrent,
  id,
  role,
  tabIndex,
  autoFocus = false,
}) => {
  const buttonClasses = [
    'satori-button',
    'satori-button--icon-only',
    `satori-button--${variant}`,
    `satori-button--${size}`,
    loading && 'satori-button--loading',
    disabled && 'satori-button--disabled',
    'touch-target', // Ensure minimum touch target size
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Enhanced keyboard navigation
  const { handleKeyDown: handleKeyboardNav } = useKeyboardNavigation(() => onClick && onClick({} as React.MouseEvent<HTMLButtonElement>));

  const handleKeyDownEvent = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (onKeyDown) {
      onKeyDown(event);
    }
    if (!event.defaultPrevented) {
      handleKeyboardNav(event.nativeEvent);
    }
  };

  // ARIA attributes
  const ariaAttributes = useAriaAttributes(
    role,
    ariaLabel,
    undefined,
    ariaDescribedBy,
    ariaExpanded,
    undefined,
    disabled || loading,
    undefined,
    undefined,
    ariaCurrent,
  );

  // Additional ARIA attributes
  if (ariaPressed !== undefined) {
    ariaAttributes['aria-pressed'] = ariaPressed;
  }

  return (
    <button
      id={id}
      type={type}
      className={buttonClasses}
      onClick={onClick}
      onKeyDown={handleKeyDownEvent}
      disabled={disabled || loading}
      tabIndex={tabIndex}
      autoFocus={autoFocus}
      {...ariaAttributes}
    >
      {loading && <span className="sr-only">Loading...</span>}
      <FontAwesomeIcon
        icon={loading ? faSpinner : icon}
        className={`satori-button__icon ${loading ? 'satori-button__icon--spinning' : ''}`}
        aria-hidden="true"
      />
    </button>
  );
};

export interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({ children, className = '', orientation = 'horizontal', spacing = 'sm' }) => {
  const groupClasses = ['satori-button-group', `satori-button-group--${orientation}`, `satori-button-group--spacing-${spacing}`, className]
    .filter(Boolean)
    .join(' ');

  return <div className={groupClasses}>{children}</div>;
};
