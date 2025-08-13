import { useEffect, useRef, useState, useCallback } from 'react';

// ============================================================================
// Focus Management Hook
// ============================================================================

export const useFocusManagement = () => {
  const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        setIsKeyboardNavigation(true);
        document.body.classList.add('keyboard-navigation-active');
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardNavigation(false);
      document.body.classList.remove('keyboard-navigation-active');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return { isKeyboardNavigation };
};

// ============================================================================
// Focus Trap Hook
// ============================================================================

export const useFocusTrap = (isActive: boolean = false) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
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
    container.classList.add('focus-trap-active');

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      container.classList.remove('focus-trap-active');
    };
  }, [isActive]);

  return containerRef;
};

// ============================================================================
// Screen Reader Announcements Hook
// ============================================================================

export const useScreenReader = () => {
  const liveRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create live region if it doesn't exist
    if (!liveRegionRef.current) {
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-live-region';
      document.body.appendChild(liveRegion);
      liveRegionRef.current = liveRegion;
    }

    return () => {
      if (liveRegionRef.current && document.body.contains(liveRegionRef.current)) {
        document.body.removeChild(liveRegionRef.current);
      }
    };
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (liveRegionRef.current) {
      liveRegionRef.current.setAttribute('aria-live', priority);
      liveRegionRef.current.textContent = message;

      // Clear the message after a short delay to allow for re-announcements
      setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  return { announce };
};

// ============================================================================
// High Contrast Mode Hook
// ============================================================================

export const useHighContrast = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    // Check for system preference
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsHighContrast(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Check for stored preference
    const storedPreference = localStorage.getItem('high-contrast-mode');
    if (storedPreference === 'true') {
      setIsHighContrast(true);
      document.body.classList.add('high-contrast-mode');
    }

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const toggleHighContrast = useCallback(() => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);

    if (newValue) {
      document.body.classList.add('high-contrast-mode');
      localStorage.setItem('high-contrast-mode', 'true');
    } else {
      document.body.classList.remove('high-contrast-mode');
      localStorage.setItem('high-contrast-mode', 'false');
    }
  }, [isHighContrast]);

  return { isHighContrast, toggleHighContrast };
};

// ============================================================================
// Reduced Motion Hook
// ============================================================================

export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
};

// ============================================================================
// Keyboard Navigation Hook
// ============================================================================

export const useKeyboardNavigation = (
  onEnter?: () => void,
  onEscape?: () => void,
  onArrowUp?: () => void,
  onArrowDown?: () => void,
  onArrowLeft?: () => void,
  onArrowRight?: () => void,
) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Enter':
          if (onEnter) {
            event.preventDefault();
            onEnter();
          }
          break;
        case 'Escape':
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;
        case 'ArrowUp':
          if (onArrowUp) {
            event.preventDefault();
            onArrowUp();
          }
          break;
        case 'ArrowDown':
          if (onArrowDown) {
            event.preventDefault();
            onArrowDown();
          }
          break;
        case 'ArrowLeft':
          if (onArrowLeft) {
            event.preventDefault();
            onArrowLeft();
          }
          break;
        case 'ArrowRight':
          if (onArrowRight) {
            event.preventDefault();
            onArrowRight();
          }
          break;
        default:
          // No action needed for other keys
          break;
      }
    },
    [onEnter, onEscape, onArrowUp, onArrowDown, onArrowLeft, onArrowRight],
  );

  return { handleKeyDown };
};

// ============================================================================
// ARIA Attributes Hook
// ============================================================================

export const useAriaAttributes = (
  role?: string,
  label?: string,
  labelledBy?: string,
  describedBy?: string,
  expanded?: boolean,
  selected?: boolean,
  disabled?: boolean,
  required?: boolean,
  invalid?: boolean,
  current?: boolean | 'page' | 'step' | 'location' | 'date' | 'time',
) => {
  const ariaAttributes: Record<string, any> = {};

  if (role) ariaAttributes.role = role;
  if (label) ariaAttributes['aria-label'] = label;
  if (labelledBy) ariaAttributes['aria-labelledby'] = labelledBy;
  if (describedBy) ariaAttributes['aria-describedby'] = describedBy;
  if (expanded !== undefined) ariaAttributes['aria-expanded'] = expanded;
  if (selected !== undefined) ariaAttributes['aria-selected'] = selected;
  if (disabled !== undefined) ariaAttributes['aria-disabled'] = disabled;
  if (required !== undefined) ariaAttributes['aria-required'] = required;
  if (invalid !== undefined) ariaAttributes['aria-invalid'] = invalid;
  if (current !== undefined) {
    ariaAttributes['aria-current'] = current === true ? 'page' : current;
  }

  return ariaAttributes;
};

// ============================================================================
// Skip Links Hook
// ============================================================================

export const useSkipLinks = () => {
  useEffect(() => {
    // Create skip links container if it doesn't exist
    let skipLinksContainer = document.getElementById('skip-links');

    if (!skipLinksContainer) {
      skipLinksContainer = document.createElement('div');
      skipLinksContainer.id = 'skip-links';
      skipLinksContainer.setAttribute('aria-label', 'Skip navigation links');

      const skipToMain = document.createElement('a');
      skipToMain.href = '#main-content';
      skipToMain.className = 'skip-link';
      skipToMain.textContent = 'Skip to main content';

      const skipToNav = document.createElement('a');
      skipToNav.href = '#main-navigation';
      skipToNav.className = 'skip-link';
      skipToNav.textContent = 'Skip to navigation';

      skipLinksContainer.appendChild(skipToMain);
      skipLinksContainer.appendChild(skipToNav);

      document.body.insertBefore(skipLinksContainer, document.body.firstChild);
    }

    return () => {
      const container = document.getElementById('skip-links');
      if (container) {
        document.body.removeChild(container);
      }
    };
  }, []);
};

// ============================================================================
// Form Validation Accessibility Hook
// ============================================================================

export const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { announce } = useScreenReader();

  const setFieldError = useCallback(
    (fieldName: string, error: string) => {
      setErrors(prev => ({
        ...prev,
        [fieldName]: error,
      }));

      // Announce error to screen readers
      if (error) {
        announce(`Error in ${fieldName}: ${error}`, 'assertive');
      }
    },
    [announce],
  );

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const getFieldProps = useCallback(
    (fieldName: string) => {
      const hasError = !!errors[fieldName];
      return {
        'aria-invalid': hasError,
        'aria-describedby': hasError ? `${fieldName}-error` : undefined,
      };
    },
    [errors],
  );

  const getErrorProps = useCallback(
    (fieldName: string) => {
      const error = errors[fieldName];
      if (!error) return null;

      return {
        id: `${fieldName}-error`,
        role: 'alert',
        'aria-live': 'polite' as const,
        className: 'error-message',
      };
    },
    [errors],
  );

  return {
    errors,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    getFieldProps,
    getErrorProps,
  };
};
