import React from 'react';
import { HelpProvider } from './HelpProvider';
import { GuidedTour } from './GuidedTour';
import { HelpPanel } from './HelpPanel';

interface HelpSystemWrapperProps {
  children: React.ReactNode;
}

export const HelpSystemWrapper: React.FC<HelpSystemWrapperProps> = ({ children }) => {
  return (
    <HelpProvider>
      {children}
      <GuidedTour />
      <HelpPanel />
    </HelpProvider>
  );
};
