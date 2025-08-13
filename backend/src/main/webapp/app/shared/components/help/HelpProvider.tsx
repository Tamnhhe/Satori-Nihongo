import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export interface HelpItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  url?: string;
  component?: string;
}

export interface TooltipConfig {
  id: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
}

export interface TourStep {
  id: string;
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
}

export interface Tour {
  id: string;
  name: string;
  steps: TourStep[];
  autoStart?: boolean;
}

interface HelpContextType {
  // Help documentation
  helpItems: HelpItem[];
  searchHelp: (query: string) => HelpItem[];
  getHelpByCategory: (category: string) => HelpItem[];
  getHelpById: (id: string) => HelpItem | undefined;

  // Tooltips
  showTooltip: (elementId: string, config: TooltipConfig) => void;
  hideTooltip: (elementId: string) => void;

  // Guided tours
  startTour: (tourId: string) => void;
  stopTour: () => void;
  nextStep: () => void;
  previousStep: () => void;
  currentTour: Tour | null;
  currentStep: number;
  isTourActive: boolean;

  // Help panel
  isHelpPanelOpen: boolean;
  toggleHelpPanel: () => void;
  openHelpPanel: (helpId?: string) => void;
  closeHelpPanel: () => void;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

interface HelpProviderProps {
  children: ReactNode;
}

export const HelpProvider: React.FC<HelpProviderProps> = ({ children }) => {
  const { t } = useTranslation(['help', 'common']);

  // Help documentation state
  const [helpItems] = useState<HelpItem[]>([
    // User Management Help
    {
      id: 'user-management-overview',
      title: t('help:userManagement.overview.title'),
      content: t('help:userManagement.overview.content'),
      category: 'user-management',
      tags: ['users', 'accounts', 'roles'],
      component: 'UserManagement',
    },
    {
      id: 'user-roles-permissions',
      title: t('help:userManagement.roles.title'),
      content: t('help:userManagement.roles.content'),
      category: 'user-management',
      tags: ['roles', 'permissions', 'access'],
      component: 'UserManagement',
    },

    // Course Management Help
    {
      id: 'course-creation',
      title: t('help:courseManagement.creation.title'),
      content: t('help:courseManagement.creation.content'),
      category: 'course-management',
      tags: ['courses', 'creation', 'lessons'],
      component: 'CourseManagement',
    },
    {
      id: 'lesson-content-editor',
      title: t('help:courseManagement.lessonEditor.title'),
      content: t('help:courseManagement.lessonEditor.content'),
      category: 'course-management',
      tags: ['lessons', 'content', 'editor'],
      component: 'LessonContentEditor',
    },

    // Quiz Management Help
    {
      id: 'quiz-builder',
      title: t('help:quizManagement.builder.title'),
      content: t('help:quizManagement.builder.content'),
      category: 'quiz-management',
      tags: ['quiz', 'questions', 'builder'],
      component: 'QuizBuilder',
    },

    // Analytics Help
    {
      id: 'student-analytics',
      title: t('help:analytics.student.title'),
      content: t('help:analytics.student.content'),
      category: 'analytics',
      tags: ['analytics', 'progress', 'reports'],
      component: 'StudentAnalytics',
    },
  ]);

  // Tooltip state
  const [activeTooltips, setActiveTooltips] = useState<Map<string, TooltipConfig>>(new Map());

  // Tour state
  const [currentTour, setCurrentTour] = useState<Tour | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTourActive, setIsTourActive] = useState(false);

  // Help panel state
  const [isHelpPanelOpen, setIsHelpPanelOpen] = useState(false);
  const [selectedHelpId, setSelectedHelpId] = useState<string | undefined>();

  // Help documentation methods
  const searchHelp = useCallback(
    (query: string): HelpItem[] => {
      const lowercaseQuery = query.toLowerCase();
      return helpItems.filter(
        item =>
          item.title.toLowerCase().includes(lowercaseQuery) ||
          item.content.toLowerCase().includes(lowercaseQuery) ||
          item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)),
      );
    },
    [helpItems],
  );

  const getHelpByCategory = useCallback(
    (category: string): HelpItem[] => {
      return helpItems.filter(item => item.category === category);
    },
    [helpItems],
  );

  const getHelpById = useCallback(
    (id: string): HelpItem | undefined => {
      return helpItems.find(item => item.id === id);
    },
    [helpItems],
  );

  // Tooltip methods
  const showTooltip = useCallback((elementId: string, config: TooltipConfig) => {
    setActiveTooltips(prev => new Map(prev.set(elementId, config)));
  }, []);

  const hideTooltip = useCallback((elementId: string) => {
    setActiveTooltips(prev => {
      const newMap = new Map(prev);
      newMap.delete(elementId);
      return newMap;
    });
  }, []);

  // Tour methods
  const startTour = useCallback(
    (tourId: string) => {
      // Tour definitions would be loaded from i18n or configuration
      const tours: Record<string, Tour> = {
        'user-management-tour': {
          id: 'user-management-tour',
          name: t('help:tours.userManagement.name'),
          steps: [
            {
              id: 'step-1',
              target: '[data-tour="user-table"]',
              title: t('help:tours.userManagement.step1.title'),
              content: t('help:tours.userManagement.step1.content'),
              placement: 'bottom',
            },
            {
              id: 'step-2',
              target: '[data-tour="user-filters"]',
              title: t('help:tours.userManagement.step2.title'),
              content: t('help:tours.userManagement.step2.content'),
              placement: 'left',
            },
          ],
        },
      };

      const tour = tours[tourId];
      if (tour) {
        setCurrentTour(tour);
        setCurrentStep(0);
        setIsTourActive(true);
      }
    },
    [t],
  );

  const stopTour = useCallback(() => {
    setCurrentTour(null);
    setCurrentStep(0);
    setIsTourActive(false);
  }, []);

  const nextStep = useCallback(() => {
    if (currentTour && currentStep < currentTour.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      stopTour();
    }
  }, [currentTour, currentStep, stopTour]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // Help panel methods
  const toggleHelpPanel = useCallback(() => {
    setIsHelpPanelOpen(prev => !prev);
  }, []);

  const openHelpPanel = useCallback((helpId?: string) => {
    setSelectedHelpId(helpId);
    setIsHelpPanelOpen(true);
  }, []);

  const closeHelpPanel = useCallback(() => {
    setIsHelpPanelOpen(false);
    setSelectedHelpId(undefined);
  }, []);

  const contextValue: HelpContextType = {
    // Help documentation
    helpItems,
    searchHelp,
    getHelpByCategory,
    getHelpById,

    // Tooltips
    showTooltip,
    hideTooltip,

    // Guided tours
    startTour,
    stopTour,
    nextStep,
    previousStep,
    currentTour,
    currentStep,
    isTourActive,

    // Help panel
    isHelpPanelOpen,
    toggleHelpPanel,
    openHelpPanel,
    closeHelpPanel,
  };

  return <HelpContext.Provider value={contextValue}>{children}</HelpContext.Provider>;
};

export const useHelp = (): HelpContextType => {
  const context = useContext(HelpContext);
  if (!context) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
};
