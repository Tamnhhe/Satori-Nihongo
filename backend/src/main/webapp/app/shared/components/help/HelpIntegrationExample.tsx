import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../design-system/components/Button/Button';
import { Card } from '../../design-system/components/Card/Card';
import { Tooltip, HelpTooltip, TourTrigger, useHelp } from './index';
import './HelpIntegrationExample.scss';

export const HelpIntegrationExample: React.FC = () => {
  const { t } = useTranslation(['help', 'common']);
  const { openHelpPanel } = useHelp();

  return (
    <div className="help-integration-example">
      <Card>
        <div className="help-integration-example__header">
          <h3>User Management</h3>
          <div className="help-integration-example__help-actions">
            <TourTrigger tourId="user-management-tour">
              <Button variant="ghost" size="sm">
                Take Tour
              </Button>
            </TourTrigger>
            <Button variant="ghost" size="sm" onClick={() => openHelpPanel('user-management-overview')}>
              Help
            </Button>
          </div>
        </div>

        <div className="help-integration-example__toolbar">
          <div className="help-integration-example__filters" data-tour="user-filters">
            <HelpTooltip helpKey="tooltips.userTable.filterButton" placement="bottom">
              <Button variant="outline" size="sm">
                Filters
              </Button>
            </HelpTooltip>

            <Tooltip content="Search users by name, email, or username" placement="bottom">
              <input type="text" placeholder="Search users..." className="help-integration-example__search" />
            </Tooltip>
          </div>

          <div className="help-integration-example__actions">
            <HelpTooltip helpKey="tooltips.courseManagement.createCourse" placement="bottom">
              <Button variant="primary" size="sm">
                Create User
              </Button>
            </HelpTooltip>

            <Tooltip content="Export the current user list to CSV format" placement="bottom">
              <Button variant="outline" size="sm">
                Export
              </Button>
            </Tooltip>
          </div>
        </div>

        <div className="help-integration-example__table" data-tour="user-table">
          <table className="help-integration-example__data-table">
            <thead>
              <tr>
                <th>
                  <HelpTooltip helpKey="tooltips.userTable.sortColumn" placement="top">
                    <span>Name</span>
                  </HelpTooltip>
                </th>
                <th>Email</th>
                <th>
                  <HelpTooltip helpKey="tooltips.userTable.userStatus" placement="top">
                    <span>Status</span>
                  </HelpTooltip>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>john@example.com</td>
                <td>
                  <span className="status-badge status-badge--active">Active</span>
                </td>
                <td>
                  <HelpTooltip helpKey="tooltips.userTable.editUser" placement="left">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </HelpTooltip>
                </td>
              </tr>
              <tr>
                <td>Jane Smith</td>
                <td>jane@example.com</td>
                <td>
                  <span className="status-badge status-badge--inactive">Inactive</span>
                </td>
                <td>
                  <HelpTooltip helpKey="tooltips.userTable.editUser" placement="left">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </HelpTooltip>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="help-integration-example__footer">
          <p className="help-integration-example__help-text">
            💡 Hover over elements with help icons for contextual guidance, or use the &quot;Take Tour&quot; button for a guided
            walkthrough.
          </p>
        </div>
      </Card>
    </div>
  );
};
