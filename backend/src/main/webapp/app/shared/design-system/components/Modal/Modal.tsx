import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '../Button/Button';
import { useFocusTrap } from '../../../hooks/useAccessibility';
import './Modal.scss';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
  backdropClassName?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  size = 'md',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
  backdropClassName = '',
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const focusTrapRef = useFocusTrap(isOpen);

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Prevent body scroll and add modal-open class
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');

      // Add aria-hidden to main content
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.setAttribute('aria-hidden', 'true');
      }

      // Announce modal opening to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'assertive');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = 'Dialog opened';
      document.body.appendChild(announcement);

      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    } else {
      // Restore body scroll and remove modal-open class
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');

      // Remove aria-hidden from main content
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.removeAttribute('aria-hidden');
      }

      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.removeAttribute('aria-hidden');
      }
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeOnEscape, onClose]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  const modalClasses = ['satori-modal', `satori-modal--${size}`, className].filter(Boolean).join(' ');
  const backdropClasses = ['satori-modal-backdrop', backdropClassName].filter(Boolean).join(' ');

  const modalContent = (
    <div className={backdropClasses} onClick={handleBackdropClick} role="presentation">
      <div
        ref={node => {
          if (modalRef.current !== node) {
            modalRef.current = node;
          }
          if (focusTrapRef.current !== node) {
            (focusTrapRef as any).current = node;
          }
        }}
        className={modalClasses}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        tabIndex={-1}
      >
        {showCloseButton && (
          <div className="satori-modal__close">
            <IconButton icon={faTimes} variant="ghost" size="sm" onClick={onClose} aria-label="Close dialog" tabIndex={0} />
          </div>
        )}
        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ children, className = '', id }) => {
  return (
    <div id={id} className={`satori-modal__header ${className}`}>
      {children}
    </div>
  );
};

export interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const ModalBody: React.FC<ModalBodyProps> = ({ children, className = '', id }) => {
  return (
    <div id={id} className={`satori-modal__body ${className}`}>
      {children}
    </div>
  );
};

export interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'between';
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ children, className = '', align = 'right' }) => {
  return <div className={`satori-modal__footer satori-modal__footer--${align} ${className}`}>{children}</div>;
};
