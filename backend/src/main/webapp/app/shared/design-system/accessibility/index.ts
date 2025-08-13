// Accessibility utilities and components for Satori Design System

// Hooks
export {
  useFocusManagement,
  useFocusTrap,
  useScreenReader,
  useHighContrast,
  useReducedMotion,
  useKeyboardNavigation,
  useAriaAttributes,
  useSkipLinks,
  useFormValidation,
} from '../../hooks/useAccessibility';

// Components
export {
  AccessibilityProvider,
  useAccessibilityContext,
  AccessibilitySettings,
  LiveRegion,
  SkipLink,
  FocusTrap,
  Landmark,
} from '../../components/accessibility/AccessibilityProvider';

// Types
export interface AccessibilityConfig {
  enableHighContrast?: boolean;
  enableReducedMotion?: boolean;
  enableKeyboardNavigation?: boolean;
  enableScreenReader?: boolean;
  enableFocusTrap?: boolean;
  skipLinksEnabled?: boolean;
}

// Utility functions
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const liveRegion = document.querySelector('[aria-live]');
  if (liveRegion) {
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.textContent = message;

    setTimeout(() => {
      liveRegion.textContent = '';
    }, 1000);
  }
};

export const focusElement = (selector: string) => {
  const element = document.querySelector(selector);
  if (element && element instanceof HTMLElement) {
    element.focus();
  }
};

export const trapFocus = (container: HTMLElement) => {
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

  container.addEventListener('keydown', handleKeyDown);

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
};

export const getAccessibleName = (element: HTMLElement): string => {
  // Check aria-label first
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  // Check aria-labelledby
  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelElement = document.getElementById(ariaLabelledBy);
    if (labelElement) return labelElement.textContent || '';
  }

  // Check associated label
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
    const id = element.getAttribute('id');
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) return label.textContent || '';
    }
  }

  // Fall back to text content
  return element.textContent || '';
};

export const isElementVisible = (element: HTMLElement): boolean => {
  const style = window.getComputedStyle(element);
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    element.offsetWidth > 0 &&
    element.offsetHeight > 0
  );
};

export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const focusableSelectors = [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ];

  const elements = Array.from(container.querySelectorAll(focusableSelectors.join(', '))).filter(
    (element): element is HTMLElement => element instanceof HTMLElement,
  );

  return elements.filter(isElementVisible);
};

export const createAriaDescription = (id: string, description: string): HTMLElement => {
  let descElement = document.getElementById(id);

  if (!descElement) {
    descElement = document.createElement('div');
    descElement.id = id;
    descElement.className = 'sr-only';
    document.body.appendChild(descElement);
  }

  descElement.textContent = description;
  return descElement;
};

export const removeAriaDescription = (id: string): void => {
  const element = document.getElementById(id);
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
};

// Accessibility testing utilities
export const checkColorContrast = (foreground: string, background: string): number => {
  // Simple contrast ratio calculation (for development use)
  // In production, use a proper color contrast library
  const getLuminance = (color: string): number => {
    // This is a simplified version - use a proper color library in production
    const rgb = color.match(/\d+/g);
    if (!rgb) return 0;

    const [r, g, b] = rgb.map(c => {
      const val = parseInt(c, 10) / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

export const validateAccessibility = (element: HTMLElement): string[] => {
  const issues: string[] = [];

  // Check for missing alt text on images
  const images = element.querySelectorAll('img');
  images.forEach(img => {
    if (!img.getAttribute('alt') && !img.getAttribute('aria-label')) {
      issues.push(`Image missing alt text: ${img.src}`);
    }
  });

  // Check for missing labels on form elements
  const formElements = element.querySelectorAll('input, textarea, select');
  formElements.forEach(el => {
    const hasLabel = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || document.querySelector(`label[for="${el.id}"]`);

    if (!hasLabel) {
      issues.push(`Form element missing label: ${el.tagName}`);
    }
  });

  // Check for missing focus indicators
  const interactiveElements = element.querySelectorAll('button, a, input, textarea, select');
  interactiveElements.forEach(el => {
    const style = window.getComputedStyle(el, ':focus');
    if (style.outline === 'none' && !style.boxShadow && !style.border) {
      issues.push(`Interactive element missing focus indicator: ${el.tagName}`);
    }
  });

  return issues;
};
