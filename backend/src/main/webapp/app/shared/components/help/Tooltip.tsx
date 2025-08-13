import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import './Tooltip.scss';

export interface TooltipProps {
  content: string | ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
  className?: string;
  children: ReactNode;
  disabled?: boolean;
  maxWidth?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  placement = 'top',
  trigger = 'hover',
  delay = 200,
  className = '',
  children,
  disabled = false,
  maxWidth = 300,
}) => {
  const { t } = useTranslation('common');
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number>();

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - 8;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + 8;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - 8;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + 8;
        break;
      default:
        // Default to top placement
        top = triggerRect.top - tooltipRect.height - 8;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
    }

    // Adjust for viewport boundaries
    if (left < 8) left = 8;
    if (left + tooltipRect.width > viewport.width - 8) {
      left = viewport.width - tooltipRect.width - 8;
    }
    if (top < 8) top = 8;
    if (top + tooltipRect.height > viewport.height - 8) {
      top = viewport.height - tooltipRect.height - 8;
    }

    setPosition({ top, left });
  };

  const showTooltip = () => {
    if (disabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
    }
  }, [isVisible, content]);

  useEffect(() => {
    const handleResize = () => {
      if (isVisible) {
        calculatePosition();
      }
    };

    const handleScroll = () => {
      if (isVisible) {
        calculatePosition();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible]);

  const handleTriggerEvents = () => {
    const events: Record<string, () => void> = {};

    switch (trigger) {
      case 'hover':
        events.onMouseEnter = showTooltip;
        events.onMouseLeave = hideTooltip;
        break;
      case 'click':
        events.onClick = () => {
          if (isVisible) {
            hideTooltip();
          } else {
            showTooltip();
          }
        };
        break;
      case 'focus':
        events.onFocus = showTooltip;
        events.onBlur = hideTooltip;
        break;
      default:
        // Default to hover trigger
        events.onMouseEnter = showTooltip;
        events.onMouseLeave = hideTooltip;
        break;
    }

    return events;
  };

  const tooltipContent = (
    <div
      ref={tooltipRef}
      className={`tooltip ${className} tooltip--${placement}`}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        maxWidth,
        zIndex: 9999,
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
        transition: 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out',
      }}
      role="tooltip"
      aria-hidden={!isVisible}
    >
      <div className="tooltip__content">{content}</div>
      <div className={`tooltip__arrow tooltip__arrow--${placement}`} />
    </div>
  );

  return (
    <>
      <div ref={triggerRef} className="tooltip-trigger" {...handleTriggerEvents()} aria-describedby={isVisible ? 'tooltip' : undefined}>
        {children}
      </div>
      {createPortal(tooltipContent, document.body)}
    </>
  );
};

// Helper component for contextual help tooltips
interface HelpTooltipProps {
  helpKey: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  children: ReactNode;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({ helpKey, placement = 'top', children }) => {
  const { t } = useTranslation('help');

  return (
    <Tooltip content={t(helpKey)} placement={placement} trigger="hover" className="help-tooltip">
      {children}
    </Tooltip>
  );
};
