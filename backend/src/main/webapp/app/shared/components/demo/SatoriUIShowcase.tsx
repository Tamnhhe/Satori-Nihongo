import React, { useState } from 'react';
import { Button } from '../ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPlay, faUsers, faChartLine, faBookOpen, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

/**
 * Satori UI Showcase Component
 * Demonstrates the improved UX design system for admin/teacher interfaces
 */
const SatoriUIShowcase: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const showcaseSections = [
    { id: 'overview', label: 'Overview', icon: faChartLine },
    { id: 'components', label: 'Components', icon: faBookOpen },
    { id: 'layouts', label: 'Layouts', icon: faUsers },
    { id: 'features', label: 'Features', icon: faCalendarAlt },
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Satori Nihongo Platform</h1>
        <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
          Enhanced UX design for admin and teacher interfaces with mobile-first responsive design, following Satori brand guidelines and
          modern accessibility standards.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg">
            <FontAwesomeIcon icon={faPlay} className="mr-2" />
            View Teacher Dashboard
          </Button>
          <Button variant="outline" size="lg">
            <FontAwesomeIcon icon={faUsers} className="mr-2" />
            View Admin Panel
          </Button>
        </div>
      </div>

      {/* Key Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-soft border border-gray-200">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faUsers} className="text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
          <p className="text-gray-600">Comprehensive admin tools for managing teachers, students, and roles with intuitive interfaces.</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-soft border border-gray-200">
          <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faChartLine} className="text-secondary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
          <p className="text-gray-600">Real-time insights into student progress, course performance, and platform usage metrics.</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-soft border border-gray-200">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faBookOpen} className="text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Library</h3>
          <p className="text-gray-600">Rich lesson management with multimedia support, quiz creation, and course structuring tools.</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-soft border border-gray-200">
          <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-secondary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule Management</h3>
          <p className="text-gray-600">Interactive calendar with class scheduling, availability management, and meeting integration.</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-soft border border-gray-200">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faUsers} className="text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile Responsive</h3>
          <p className="text-gray-600">Optimized for all devices from 400px mobile to 1440px desktop with touch-friendly interfaces.</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-soft border border-gray-200">
          <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faChartLine} className="text-secondary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Brand Identity</h3>
          <p className="text-gray-600">Consistent Satori brand colors and typography with modern design system implementation.</p>
        </div>
      </div>
    </div>
  );

  const renderComponents = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">UI Component Library</h2>
        <p className="text-gray-600">Reusable components following Satori design system</p>
      </div>

      {/* Button Variants */}
      <div className="bg-white rounded-lg p-6 shadow-soft border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="danger">Danger Button</Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button variant="primary" size="md">
            Medium
          </Button>
          <Button variant="primary" size="lg">
            Large
          </Button>
        </div>
      </div>

      {/* Color Palette */}
      <div className="bg-white rounded-lg p-6 shadow-soft border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Colors</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Primary (Warm Yellow)</div>
            <div className="space-y-1">
              <div className="w-full h-8 bg-primary-400 rounded flex items-center justify-center text-white text-xs font-medium">
                #F3AA1C
              </div>
              <div className="w-full h-6 bg-primary-300 rounded"></div>
              <div className="w-full h-6 bg-primary-500 rounded"></div>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Secondary (Deep Blue)</div>
            <div className="space-y-1">
              <div className="w-full h-8 bg-secondary-900 rounded flex items-center justify-center text-white text-xs font-medium">
                #253A8C
              </div>
              <div className="w-full h-6 bg-secondary-700 rounded"></div>
              <div className="w-full h-6 bg-secondary-500 rounded"></div>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Success</div>
            <div className="space-y-1">
              <div className="w-full h-8 bg-green-500 rounded flex items-center justify-center text-white text-xs font-medium">Success</div>
              <div className="w-full h-6 bg-green-400 rounded"></div>
              <div className="w-full h-6 bg-green-600 rounded"></div>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Danger</div>
            <div className="space-y-1">
              <div className="w-full h-8 bg-red-500 rounded flex items-center justify-center text-white text-xs font-medium">Danger</div>
              <div className="w-full h-6 bg-red-400 rounded"></div>
              <div className="w-full h-6 bg-red-600 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="bg-white rounded-lg p-6 shadow-soft border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Typography</h3>
        <div className="space-y-4">
          <div className="text-2xl font-bold text-gray-900">Heading 1 - Inter Bold</div>
          <div className="text-xl font-semibold text-gray-900">Heading 2 - Inter Semibold</div>
          <div className="text-lg font-medium text-gray-900">Heading 3 - Inter Medium</div>
          <div className="text-base text-gray-700">Body text - Inter Regular for optimal readability</div>
          <div className="text-sm text-gray-600">Small text - Inter Regular for secondary information</div>
          <div className="text-xs text-gray-500">Caption text - Inter Regular for metadata</div>
        </div>
      </div>
    </div>
  );

  const renderLayouts = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Responsive Layouts</h2>
        <p className="text-gray-600">Mobile-first design that scales beautifully across all devices</p>
      </div>

      {/* Layout Examples */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-soft border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mobile Navigation</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-primary-400 rounded"></div>
              <div className="text-sm font-medium">Satori Nihongo</div>
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-8 bg-primary-100 rounded flex items-center px-3">
                <div className="text-xs text-primary-700">Dashboard</div>
              </div>
              <div className="h-8 bg-gray-100 rounded flex items-center px-3">
                <div className="text-xs text-gray-600">Schedule</div>
              </div>
              <div className="h-8 bg-gray-100 rounded flex items-center px-3">
                <div className="text-xs text-gray-600">Students</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-soft border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Desktop Sidebar</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex">
              <div className="w-16 bg-secondary-900 rounded-l-lg p-2">
                <div className="space-y-2">
                  <div className="w-6 h-6 bg-primary-400 rounded mx-auto"></div>
                  <div className="w-6 h-6 bg-white rounded mx-auto opacity-75"></div>
                  <div className="w-6 h-6 bg-white rounded mx-auto opacity-50"></div>
                  <div className="w-6 h-6 bg-white rounded mx-auto opacity-50"></div>
                </div>
              </div>
              <div className="flex-1 bg-white rounded-r-lg p-3">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-100 rounded mb-1"></div>
                <div className="h-3 bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeatures = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Platform Features</h2>
        <p className="text-gray-600">Comprehensive tools for Japanese language education</p>
      </div>

      {/* Feature List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Teacher Features</h3>
          <ul className="space-y-3">
            <li className="flex items-center">
              <FontAwesomeIcon icon={faArrowRight} className="text-primary-500 mr-3 text-sm" />
              <span className="text-gray-700">Interactive dashboard with teaching metrics</span>
            </li>
            <li className="flex items-center">
              <FontAwesomeIcon icon={faArrowRight} className="text-primary-500 mr-3 text-sm" />
              <span className="text-gray-700">Schedule management with calendar integration</span>
            </li>
            <li className="flex items-center">
              <FontAwesomeIcon icon={faArrowRight} className="text-primary-500 mr-3 text-sm" />
              <span className="text-gray-700">Student progress tracking and analytics</span>
            </li>
            <li className="flex items-center">
              <FontAwesomeIcon icon={faArrowRight} className="text-primary-500 mr-3 text-sm" />
              <span className="text-gray-700">Lesson library with multimedia content</span>
            </li>
            <li className="flex items-center">
              <FontAwesomeIcon icon={faArrowRight} className="text-primary-500 mr-3 text-sm" />
              <span className="text-gray-700">Quiz creation and grading tools</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Admin Features</h3>
          <ul className="space-y-3">
            <li className="flex items-center">
              <FontAwesomeIcon icon={faArrowRight} className="text-secondary-600 mr-3 text-sm" />
              <span className="text-gray-700">Comprehensive analytics dashboard</span>
            </li>
            <li className="flex items-center">
              <FontAwesomeIcon icon={faArrowRight} className="text-secondary-600 mr-3 text-sm" />
              <span className="text-gray-700">User management and role assignment</span>
            </li>
            <li className="flex items-center">
              <FontAwesomeIcon icon={faArrowRight} className="text-secondary-600 mr-3 text-sm" />
              <span className="text-gray-700">Course and curriculum management</span>
            </li>
            <li className="flex items-center">
              <FontAwesomeIcon icon={faArrowRight} className="text-secondary-600 mr-3 text-sm" />
              <span className="text-gray-700">Performance metrics and reporting</span>
            </li>
            <li className="flex items-center">
              <FontAwesomeIcon icon={faArrowRight} className="text-secondary-600 mr-3 text-sm" />
              <span className="text-gray-700">System configuration and settings</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Technical Features */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Excellence</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">400px+</div>
            <div className="text-sm text-gray-600">Mobile-first responsive</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary-600">WCAG 2.1</div>
            <div className="text-sm text-gray-600">Accessibility compliant</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">TypeScript</div>
            <div className="text-sm text-gray-600">Type-safe development</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'components':
        return renderComponents();
      case 'layouts':
        return renderLayouts();
      case 'features':
        return renderFeatures();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-400 rounded-lg mr-3"></div>
              <h1 className="text-lg font-semibold text-gray-900">Satori UI Showcase</h1>
            </div>
            <div className="hidden md:flex space-x-8">
              {showcaseSections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === section.id ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <FontAwesomeIcon icon={section.icon} className="mr-2" />
                  {section.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="px-4 py-2">
          <div className="flex space-x-1 overflow-x-auto">
            {showcaseSections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeSection === section.id ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <FontAwesomeIcon icon={section.icon} className="mr-1" />
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{renderContent()}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">Satori Nihongo Platform - Enhanced UX Design System</p>
            <p className="text-sm">Built with React, TypeScript, Tailwind CSS, and modern accessibility standards</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SatoriUIShowcase;
