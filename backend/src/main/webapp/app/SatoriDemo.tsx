import React from 'react';
import SatoriUIShowcase from './shared/components/demo/SatoriUIShowcase';

/**
 * Demo application showcasing the improved Satori admin/teacher UI
 * This component demonstrates the enhanced UX design system with
 * mobile-first responsive design and Satori brand guidelines.
 */
const SatoriDemo: React.FC = () => {
  return (
    <div className="min-h-screen">
      <SatoriUIShowcase />
    </div>
  );
};

export default SatoriDemo;
