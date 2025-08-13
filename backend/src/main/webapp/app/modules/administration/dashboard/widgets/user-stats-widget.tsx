import React from 'react';
import { Translate } from 'react-jhipster';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserStats } from '../admin-dashboard.reducer';

interface UserStatsWidgetProps {
  stats?: UserStats;
  loading: boolean;
}

const UserStatsWidget: React.FC<UserStatsWidgetProps> = ({ stats, loading }) => {
  return (
    <Card className="h-100">
      <CardHeader>
        <FontAwesomeIcon icon="users" className="me-2" />
        <Translate contentKey="adminDashboard.userStatistics">User Statistics</Translate>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="text-center text-muted">
            <FontAwesomeIcon icon="spinner" spin /> <Translate contentKey="adminDashboard.loading">Loading...</Translate>
          </div>
        ) : stats ? (
          <div>
            <div className="row text-center mb-3">
              <div className="col-4">
                <div className="h4 mb-0 text-primary">{stats.totalUsers}</div>
                <small className="text-muted">
                  <Translate contentKey="adminDashboard.totalUsers">Total Users</Translate>
                </small>
              </div>
              <div className="col-4">
                <div className="h4 mb-0 text-success">{stats.activeUsers}</div>
                <small className="text-muted">
                  <Translate contentKey="adminDashboard.activeUsers">Active Users</Translate>
                </small>
              </div>
              <div className="col-4">
                <div className="h4 mb-0 text-info">{stats.newRegistrations}</div>
                <small className="text-muted">
                  <Translate contentKey="adminDashboard.newRegistrations">New This Month</Translate>
                </small>
              </div>
            </div>

            <div>
              <h6 className="mb-2">
                <Translate contentKey="adminDashboard.roleDistribution">Role Distribution</Translate>
              </h6>
              {stats.roleDistribution.map((role, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-1">
                  <span className="small">{role.role}</span>
                  <span className="badge bg-secondary">{role.count}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-muted">
            <Translate contentKey="adminDashboard.noData">No data available</Translate>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default UserStatsWidget;
