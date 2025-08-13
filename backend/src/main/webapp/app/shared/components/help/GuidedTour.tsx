import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useHelp } from './HelpProvider';
import { Button } from '../../design-system/components/Button/Button';
import './GuidedTour.scss';

interface TourOverlayProps {
  target: string;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  currentStep: number;
  totalSteps: number;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

const TourOverlay: React.FC<TourOverlayProps> = ({
  target,
  onNext,
  onPrevious,
  onSkip,
  currentStep,
  totalSteps,
  title,
  content,
  placement = 'bottom',
}) => {
  const { t } = useTranslation('help');
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = document.querySelector(target);
    if (element instanceof HTMLElement) {
      setTargetElement(element);
    } else {
      setTargetElement(null);
    }
  }, [target]);

  useEffect(() => {
    if (targetElement && overlayRef.current) {
      const targetRect = targetElement.getBoundingClientRect();
      const overlayRect = overlayRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      let top = 0;
      let left = 0;

      switch (placement) {
        case 'top':
          top = targetRect.top - overlayRect.height - 16;
          left = targetRect.left + (targetRect.width - overlayRect.width) / 2;
          break;
        case 'bottom':
          top = targetRect.bottom + 16;
          left = targetRect.left + (targetRect.width - overlayRect.width) / 2;
          break;
        case 'left':
          top = targetRect.top + (targetRect.height - overlayRect.height) / 2;
          left = targetRect.left - overlayRect.width - 16;
          break;
        case 'right':
          top = targetRect.top + (targetRect.height - overlayRect.height) / 2;
          left = targetRect.right + 16;
          break;
        default:
          // Default to bottom placement
          top = targetRect.bottom + 16;
          left = targetRect.left + (targetRect.width - overlayRect.width) / 2;
          break;
      }

      // Adjust for viewport boundaries
      if (left < 16) left = 16;
      if (left + overlayRect.width > viewport.width - 16) {
        left = viewport.width - overlayRect.width - 16;
      }
      if (top < 16) top = 16;
      if (top + overlayRect.height > viewport.height - 16) {
        top = viewport.height - overlayRect.height - 16;
      }

      setPosition({ top, left });

      // Scroll target into view if needed
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });

      // Highlight target element
      targetElement.classList.add('tour-highlight');
    }

    return () => {
      if (targetElement) {
        targetElement.classList.remove('tour-highlight');
      }
    };
  }, [targetElement, placement]);

  if (!targetElement) {
    return null;
  }

  const targetRect = targetElement.getBoundingClientRect();

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="tour-backdrop" />

      {/* Spotlight */}
      <div
        className="tour-spotlight"
        style={{
          top: targetRect.top - 4,
          left: targetRect.left - 4,
          width: targetRect.width + 8,
          height: targetRect.height + 8,
        }}
      />

      {/* Tour popup */}
      <div
        ref={overlayRef}
        className={`tour-popup tour-popup--${placement}`}
        style={{
          position: 'fixed',
          top: position.top,
          left: position.left,
          zIndex: 10001,
        }}
        role="dialog"
        aria-labelledby="tour-title"
        aria-describedby="tour-content"
      >
        <div className="tour-popup__header">
          <h3 id="tour-title" className="tour-popup__title">
            {title}
          </h3>
          <div className="tour-popup__progress">
            {currentStep + 1} / {totalSteps}
          </div>
        </div>

        <div id="tour-content" className="tour-popup__content">
          {content}
        </div>

        <div className="tour-popup__actions">
          <Button variant="ghost" size="sm" onClick={onSkip} className="tour-popup__skip">
            {t('tours.skip')}
          </Button>

          <div className="tour-popup__navigation">
            {currentStep > 0 && (
              <Button variant="outline" size="sm" onClick={onPrevious}>
                {t('tours.previous')}
              </Button>
            )}

            <Button variant="primary" size="sm" onClick={onNext}>
              {currentStep === totalSteps - 1 ? t('tours.finish') : t('tours.next')}
            </Button>
          </div>
        </div>

        <div className={`tour-popup__arrow tour-popup__arrow--${placement}`} />
      </div>
    </>,
    document.body,
  );
};

export const GuidedTour: React.FC = () => {
  const { currentTour, currentStep, isTourActive, nextStep, previousStep, stopTour } = useHelp();

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isTourActive) {
        stopTour();
      }
    };

    const handleResize = () => {
      // Force re-render on resize to recalculate positions
      if (isTourActive) {
        // Small delay to allow for layout changes
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 100);
      }
    };

    if (isTourActive) {
      document.addEventListener('keydown', handleEscape);
      window.addEventListener('resize', handleResize);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = '';
    };
  }, [isTourActive, stopTour]);

  if (!isTourActive || !currentTour || !currentTour.steps[currentStep]) {
    return null;
  }

  const currentStepData = currentTour.steps[currentStep];

  return (
    <TourOverlay
      target={currentStepData.target}
      onNext={() => {
        if (currentStepData.action) {
          currentStepData.action();
        }
        nextStep();
      }}
      onPrevious={previousStep}
      onSkip={stopTour}
      currentStep={currentStep}
      totalSteps={currentTour.steps.length}
      title={currentStepData.title}
      content={currentStepData.content}
      placement={currentStepData.placement}
    />
  );
};

// Helper component to trigger tours
interface TourTriggerProps {
  tourId: string;
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

export const TourTrigger: React.FC<TourTriggerProps> = ({ tourId, children, className = '', asChild = false }) => {
  const { startTour } = useHelp();

  const handleClick = () => startTour(tourId);

  if (asChild && React.isValidElement(children)) {
    // Clone the child element and add onClick handler
    return React.cloneElement(children, {
      ...children.props,
      onClick(e: React.MouseEvent) {
        children.props.onClick?.(e);
        handleClick();
      },
      className: `${children.props.className || ''} ${className}`.trim(),
    });
  }

  return (
    <button className={`tour-trigger ${className}`} onClick={handleClick} type="button">
      {children}
    </button>
  );
};
