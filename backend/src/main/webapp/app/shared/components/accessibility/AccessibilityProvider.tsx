import React, { createContext, useContext, useEffect, useState } from 'react';
import { useFocusManagement, useHighContrast, useReducedMotion, useScreenReader, useSkipLinks } from '../../hooks/useAccessibility';

// ============================================================================
// Accessibility Context
// ============================================================================

interface AccessibilityContextType {
  isKeyboardNavigation: boolean;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  prefersReducedMotion: boolean;
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibilityContext = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibilityContext must be used within an AccessibilityProvider');
  }
  return context;
};

// ============================================================================
// Accessibility Provider Component
// ============================================================================

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const { isKeyboardNavigation } = useFocusManagement();
  const { isHighContrast, toggleHighContrast } = useHighContrast();
  const prefersReducedMotion = useReducedMotion();
  const { announce } = useScreenReader();

  // Initialize skip links
  useSkipLinks();

  // Add focus-visible polyfill class
  useEffect(() => {
    document.body.classList.add('js-focus-visible');
  }, []);

  const contextValue: AccessibilityContextType = {
    isKeyboardNavigation,
    isHighContrast,
    toggleHighContrast,
    prefersReducedMotion,
    announce,
  };

  return <AccessibilityContext.Provider value={contextValue}>{children}</AccessibilityContext.Provider>;
};

// ============================================================================
// Accessibility Settings Component
// ============================================================================

interface AccessibilitySettingsProps {
  className?: string;
}

export const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({ className = '' }) => {
  const { isHighContrast, toggleHighContrast, announce } = useAccessibilityContext();
  const [fontSize, setFontSize] = useState('medium');

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    document.documentElement.style.fontSize = size === 'large' ? '18px' : size === 'small' ? '14px' : '16px';
    announce(`Font size changed to ${size}`);
  };

  const handleHighContrastToggle = () => {
    toggleHighContrast();
    announce(`High contrast mode ${!isHighContrast ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className={`accessibility-settings ${className}`} role="region" aria-label="Accessibility Settings">
      <h3 className="accessibility-settings__title">Accessibility Settings</h3>

      <div className="accessibility-settings__group">
        <label className="accessibility-settings__label">
          Font Size
          <select
            value={fontSize}
            onChange={e => handleFontSizeChange(e.target.value)}
            className="accessibility-settings__select"
            aria-describedby="font-size-help"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </label>
        <div id="font-size-help" className="accessibility-settings__help">
          Adjust the text size for better readability
        </div>
      </div>

      <div className="accessibility-settings__group">
        <label className="accessibility-settings__checkbox-label">
          <input
            type="checkbox"
            checked={isHighContrast}
            onChange={handleHighContrastToggle}
            className="accessibility-settings__checkbox"
            aria-describedby="high-contrast-help"
          />
          <span className="accessibility-settings__checkbox-text">High Contrast Mode</span>
        </label>
        <div id="high-contrast-help" className="accessibility-settings__help">
          Increase color contrast for better visibility
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Live Region Component
// ============================================================================

interface LiveRegionProps {
  message: string;
  priority?: 'polite' | 'assertive';
  atomic?: boolean;
  className?: string;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({ message, priority = 'polite', atomic = true, className = '' }) => {
  return (
    <div className={`sr-live-region ${className}`} aria-live={priority} aria-atomic={atomic} role="status">
      {message}
    </div>
  );
};

// ============================================================================
// Skip Link Component
// ============================================================================

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({ href, children, className = '' }) => {
  return (
    <a href={href} className={`skip-link ${className}`}>
      {children}
    </a>
  );
};

// ============================================================================
// Focus Trap Component
// ============================================================================

interface FocusTrapProps {
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({ children, isActive = true, className = '', as: Component = 'div' }) => {
  const containerRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Focus the first element when trap becomes active
    if (firstElement) {
      firstElement.focus();
    }

    container.addEventListener('keydown', handleKeyDown);
    container.classList.add('focus-trap');

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      container.classList.remove('focus-trap');
    };
  }, [isActive]);

  return React.createElement(
    Component,
    {
      ref: containerRef,
      className: `focus-trap ${className}`,
    },
    children,
  );
};

// ============================================================================
// Landmark Component
// ============================================================================

interface LandmarkProps {
  children: React.ReactNode;
  role: 'banner' | 'navigation' | 'main' | 'complementary' | 'contentinfo' | 'region';
  label?: string;
  labelledBy?: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const Landmark: React.FC<LandmarkProps> = ({ children, role, label, labelledBy, className = '', as: Component = 'div' }) => {
  const ariaProps: Record<string, any> = { role };

  if (label) ariaProps['aria-label'] = label;
  if (labelledBy) ariaProps['aria-labelledby'] = labelledBy;

  return (
    <Component className={`landmark ${className}`} {...ariaProps}>
      {children}
    </Component>
  );
};
