import React from 'react';
import { useKeyboardNavigation, useAriaAttributes } from '../../../hooks/useAccessibility';
import './Card.scss';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  hover?: boolean;
  onClick?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  as?: 'div' | 'article' | 'section';
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  tabIndex?: number;
  id?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'sm',
  border = true,
  hover = false,
  onClick,
  onKeyDown,
  as: Component = 'div',
  role,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  tabIndex,
  id,
}) => {
  const cardClasses = [
    'satori-card',
    `satori-card--padding-${padding}`,
    `satori-card--shadow-${shadow}`,
    border && 'satori-card--border',
    hover && 'satori-card--hover',
    onClick && 'satori-card--clickable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Enhanced keyboard navigation for clickable cards
  const { handleKeyDown: handleKeyboardNav } = useKeyboardNavigation(onClick ? () => onClick() : undefined);

  const handleKeyDownEvent = (event: React.KeyboardEvent) => {
    if (onKeyDown) {
      onKeyDown(event);
    }
    if (!event.defaultPrevented && onClick) {
      handleKeyboardNav(event.nativeEvent);
    }
  };

  // ARIA attributes
  const ariaAttributes = useAriaAttributes(role || (onClick ? 'button' : undefined), ariaLabel, ariaLabelledBy, ariaDescribedBy);

  const componentProps = {
    id,
    className: cardClasses,
    onClick,
    onKeyDown: onClick ? handleKeyDownEvent : onKeyDown,
    tabIndex: onClick ? (tabIndex ?? 0) : tabIndex,
    ...ariaAttributes,
  };

  return <Component {...componentProps}>{children}</Component>;
};

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '', actions }) => {
  return (
    <div className={`satori-card__header ${className}`}>
      <div className="satori-card__header-content">{children}</div>
      {actions && <div className="satori-card__header-actions">{actions}</div>}
    </div>
  );
};

export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
  return <div className={`satori-card__body ${className}`}>{children}</div>;
};

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'between';
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '', align = 'right' }) => {
  return <div className={`satori-card__footer satori-card__footer--${align} ${className}`}>{children}</div>;
};
