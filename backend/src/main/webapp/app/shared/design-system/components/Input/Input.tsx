import React, { forwardRef, useId } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useAriaAttributes } from '../../../hooks/useAccessibility';
import './Input.scss';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled';
  leftIcon?: IconDefinition;
  rightIcon?: IconDefinition;
  onRightIconClick?: () => void;
  rightIconLabel?: string;
  fullWidth?: boolean;
  required?: boolean;
  loading?: boolean;
  showRequiredIndicator?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      size = 'md',
      variant = 'outline',
      leftIcon,
      rightIcon,
      onRightIconClick,
      rightIconLabel,
      fullWidth = false,
      required = false,
      loading = false,
      showRequiredIndicator = true,
      className = '',
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const hasError = !!error;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const wrapperClasses = [
      'satori-input-wrapper',
      `satori-input-wrapper--${size}`,
      `satori-input-wrapper--${variant}`,
      fullWidth && 'satori-input-wrapper--full-width',
      hasError && 'satori-input-wrapper--error',
      loading && 'satori-input-wrapper--loading',
      props.disabled && 'satori-input-wrapper--disabled',
      required && 'satori-input-wrapper--required',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const inputClasses = [
      'satori-input',
      leftIcon && 'satori-input--with-left-icon',
      rightIcon && 'satori-input--with-right-icon',
      'touch-target', // Ensure minimum touch target size
    ]
      .filter(Boolean)
      .join(' ');

    // Build describedBy string
    const describedByIds = [];
    if (error) describedByIds.push(errorId);
    if (helperText && !error) describedByIds.push(helperId);
    const describedBy = describedByIds.length > 0 ? describedByIds.join(' ') : undefined;

    // ARIA attributes
    const ariaAttributes = useAriaAttributes(
      undefined,
      undefined,
      undefined,
      describedBy,
      undefined,
      undefined,
      props.disabled,
      required,
      hasError,
    );

    return (
      <div className={wrapperClasses}>
        {label && (
          <label htmlFor={inputId} className="satori-input-label">
            {label}
            {required && showRequiredIndicator && (
              <span className="satori-input-label__required" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        <div className="satori-input-container">
          {leftIcon && (
            <div className="satori-input-icon satori-input-icon--left" aria-hidden="true">
              <FontAwesomeIcon icon={leftIcon} />
            </div>
          )}

          <input ref={ref} id={inputId} className={inputClasses} {...ariaAttributes} {...props} />

          {loading && (
            <div className="satori-input-icon satori-input-icon--right" aria-hidden="true">
              <FontAwesomeIcon icon={faSpinner} className="satori-input-icon--spinning" />
            </div>
          )}

          {rightIcon && !loading && (
            <div
              className={`satori-input-icon satori-input-icon--right ${onRightIconClick ? 'satori-input-icon--clickable' : ''}`}
              onClick={onRightIconClick}
              role={onRightIconClick ? 'button' : undefined}
              tabIndex={onRightIconClick ? 0 : undefined}
              aria-label={rightIconLabel}
              onKeyDown={
                onRightIconClick
                  ? e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onRightIconClick();
                      }
                    }
                  : undefined
              }
            >
              <FontAwesomeIcon icon={rightIcon} aria-hidden="true" />
            </div>
          )}
        </div>

        {error && (
          <div id={errorId} className="satori-input-message satori-input-message--error error-message" role="alert" aria-live="polite">
            {error}
          </div>
        )}

        {helperText && !error && (
          <div id={helperId} className="satori-input-message satori-input-message--helper">
            {helperText}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled';
  fullWidth?: boolean;
  required?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      size = 'md',
      variant = 'outline',
      fullWidth = false,
      required = false,
      resize = 'vertical',
      className = '',
      id,
      ...props
    },
    ref,
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    const wrapperClasses = [
      'satori-input-wrapper',
      'satori-input-wrapper--textarea',
      `satori-input-wrapper--${size}`,
      `satori-input-wrapper--${variant}`,
      fullWidth && 'satori-input-wrapper--full-width',
      hasError && 'satori-input-wrapper--error',
      props.disabled && 'satori-input-wrapper--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const textareaClasses = ['satori-input', 'satori-textarea', `satori-textarea--resize-${resize}`].filter(Boolean).join(' ');

    return (
      <div className={wrapperClasses}>
        {label && (
          <label htmlFor={textareaId} className="satori-input-label">
            {label}
            {required && <span className="satori-input-label__required">*</span>}
          </label>
        )}

        <div className="satori-input-container">
          <textarea
            ref={ref}
            id={textareaId}
            className={textareaClasses}
            aria-invalid={hasError}
            aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
            {...props}
          />
        </div>

        {error && (
          <div id={`${textareaId}-error`} className="satori-input-message satori-input-message--error">
            {error}
          </div>
        )}

        {helperText && !error && (
          <div id={`${textareaId}-helper`} className="satori-input-message satori-input-message--helper">
            {helperText}
          </div>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
