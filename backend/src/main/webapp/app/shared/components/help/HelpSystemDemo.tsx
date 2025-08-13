import React from 'react';
import { useTranslation } from 'react-i18next';
import { HelpProvider, Tooltip, HelpTooltip, TourTrigger, QuickHelpButton } from './index';
import { Button } from '../../design-system/components/Button/Button';
import { Card } from '../../design-system/components/Card/Card';
import './HelpSystemDemo.scss';

const DemoContent: React.FC = () => {
  const { t } = useTranslation('help');

  return (
    <div className="help-demo">
      <div className="help-demo__header">
        <h1>Help System Demo</h1>
        <QuickHelpButton />
      </div>

      <div className="help-demo__content">
        <Card className="help-demo__section">
          <h2>Tooltips</h2>
          <div className="help-demo__examples">
            <Tooltip content="This is a basic tooltip" placement="top">
              <Button variant="outline">Hover for tooltip (top)</Button>
            </Tooltip>

            <Tooltip content="This tooltip appears on the right" placement="right">
              <Button variant="outline">Hover for tooltip (right)</Button>
            </Tooltip>

            <HelpTooltip helpKey="tooltips.userTable.sortColumn" placement="bottom">
              <Button variant="outline">Help tooltip (bottom)</Button>
            </HelpTooltip>

            <Tooltip content="This is a click-triggered tooltip with more detailed information" trigger="click" placement="left">
              <Button variant="outline">Click for tooltip (left)</Button>
            </Tooltip>
          </div>
        </Card>

        <Card className="help-demo__section">
          <h2>Guided Tours</h2>
          <div className="help-demo__examples">
            <TourTrigger tourId="user-management-tour" asChild>
              <Button variant="primary">Start User Management Tour</Button>
            </TourTrigger>

            <TourTrigger tourId="course-management-tour" asChild>
              <Button variant="primary">Start Course Management Tour</Button>
            </TourTrigger>
          </div>

          <div className="help-demo__tour-targets">
            <div data-tour="user-table" className="help-demo__target">
              <h3>User Table (Tour Target)</h3>
              <p>This element will be highlighted during the user management tour.</p>
            </div>

            <div data-tour="user-filters" className="help-demo__target">
              <h3>User Filters (Tour Target)</h3>
              <p>This element will be highlighted as the second step of the tour.</p>
            </div>
          </div>
        </Card>

        <Card className="help-demo__section">
          <h2>Contextual Help Examples</h2>
          <div className="help-demo__examples">
            <div className="help-demo__form-field">
              <label htmlFor="username">Username</label>
              <HelpTooltip helpKey="tooltips.userTable.editUser">
                <span className="help-demo__help-icon">?</span>
              </HelpTooltip>
              <input type="text" id="username" placeholder="Enter username" />
            </div>

            <div className="help-demo__form-field">
              <label htmlFor="role">User Role</label>
              <Tooltip content="Select the appropriate role for this user. Admins have full access, Teachers can manage courses, and Students can only access learning materials.">
                <span className="help-demo__help-icon">?</span>
              </Tooltip>
              <select id="role">
                <option value="ADMIN">Administrator</option>
                <option value="GIANG_VIEN">Teacher</option>
                <option value="HOC_VIEN">Student</option>
              </select>
            </div>
          </div>
        </Card>

        <Card className="help-demo__section">
          <h2>Help Integration Examples</h2>
          <p>
            The help system integrates seamlessly with existing components. Use the <strong>Quick Help Button</strong> in the header to
            access the full help documentation, or hover over elements with help tooltips for contextual guidance.
          </p>

          <div className="help-demo__integration-examples">
            <Tooltip content="Create a new user account with default settings">
              <Button variant="primary">Create User</Button>
            </Tooltip>

            <Tooltip content="Export the current user list to CSV format">
              <Button variant="outline">Export Users</Button>
            </Tooltip>

            <Tooltip content="Import users from a CSV file. Make sure the file follows the required format.">
              <Button variant="outline">Import Users</Button>
            </Tooltip>
          </div>
        </Card>
      </div>
    </div>
  );
};

export const HelpSystemDemo: React.FC = () => {
  return (
    <HelpProvider>
      <DemoContent />
    </HelpProvider>
  );
};
