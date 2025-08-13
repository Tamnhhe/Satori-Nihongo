import React from 'react';
import { useTranslation } from 'react-i18next';
import { HelpSystemWrapper, HelpSystemDemo, HelpIntegrationExample } from 'app/shared/components/help';
import { PageHeader } from 'app/shared/design-system/components/Layout/Layout';
import { Card } from 'app/shared/design-system/components/Card/Card';
import './help-demo.scss';

const HelpDemoContent: React.FC = () => {
  const { t } = useTranslation('help');

  return (
    <div className="help-demo-page">
      <PageHeader
        title="Help System Demo"
        subtitle="Comprehensive demonstration of the localized help and documentation system"
        breadcrumbs={[{ label: 'Administration', href: '/admin' }, { label: 'Help System Demo' }]}
      />

      <div className="help-demo-page__content">
        <Card className="help-demo-page__intro">
          <h2>Help System Features</h2>
          <p>
            This page demonstrates the comprehensive help and documentation system implemented for the Satori Japanese Learning Platform.
            The system includes:
          </p>
          <ul>
            <li>
              <strong>Contextual Tooltips</strong>: Hover-based help for UI elements
            </li>
            <li>
              <strong>Guided Tours</strong>: Step-by-step walkthroughs for complex workflows
            </li>
            <li>
              <strong>Searchable Documentation</strong>: Comprehensive help articles with search functionality
            </li>
            <li>
              <strong>Internationalization</strong>: Full support for English and Vietnamese
            </li>
            <li>
              <strong>Accessibility</strong>: WCAG 2.1 AA compliant with keyboard navigation and screen reader support
            </li>
          </ul>
        </Card>

        <Card className="help-demo-page__section">
          <h2>Interactive Demo</h2>
          <p>
            The following demo shows all help system components in action. Try hovering over elements, clicking the help button, and
            starting guided tours.
          </p>
          <HelpSystemDemo />
        </Card>

        <Card className="help-demo-page__section">
          <h2>Integration Example</h2>
          <p>
            This example shows how the help system integrates with existing admin interface components, providing contextual guidance
            without disrupting the user experience.
          </p>
          <HelpIntegrationExample />
        </Card>

        <Card className="help-demo-page__section">
          <h2>Implementation Notes</h2>
          <div className="help-demo-page__implementation">
            <h3>Components Created</h3>
            <ul>
              <li>
                <code>HelpProvider</code>: Context provider for help system state management
              </li>
              <li>
                <code>Tooltip</code>: Reusable tooltip component with multiple trigger options
              </li>
              <li>
                <code>GuidedTour</code>: Interactive tour system with step-by-step guidance
              </li>
              <li>
                <code>HelpPanel</code>: Searchable help documentation panel
              </li>
              <li>
                <code>QuickHelpButton</code>: Header integration for easy help access
              </li>
            </ul>

            <h3>Internationalization</h3>
            <ul>
              <li>
                English translations in <code>i18n/en/help.json</code>
              </li>
              <li>
                Vietnamese translations in <code>i18n/vi/help.json</code>
              </li>
              <li>Dynamic content loading based on user language preference</li>
            </ul>

            <h3>Accessibility Features</h3>
            <ul>
              <li>ARIA labels and semantic HTML throughout</li>
              <li>Keyboard navigation support (Tab, Enter, Escape)</li>
              <li>Screen reader compatible with proper role attributes</li>
              <li>High contrast mode support</li>
              <li>Reduced motion preferences respected</li>
            </ul>

            <h3>Usage Examples</h3>
            <pre>
              <code>{`// Basic tooltip
<Tooltip content="This is helpful information">
  <Button>Hover me</Button>
</Tooltip>

// Help tooltip with i18n
<HelpTooltip helpKey="tooltips.userTable.editUser">
  <Button>Edit User</Button>
</HelpTooltip>

// Start a guided tour
<TourTrigger tourId="user-management-tour">
  <Button>Take Tour</Button>
</TourTrigger>

// Open help panel
const { openHelpPanel } = useHelp();
openHelpPanel('user-management-overview');`}</code>
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
};

export const HelpDemo: React.FC = () => {
  return (
    <HelpSystemWrapper>
      <HelpDemoContent />
    </HelpSystemWrapper>
  );
};
