import React from 'react';
import { Translate, TextFormat } from 'react-jhipster';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { APP_LOCAL_DATETIME_FORMAT } from 'app/config/constants';
import { RecentActivity } from '../admin-dashboard.reducer';

interface RecentActivityWidgetProps {
  activities?: RecentActivity[];
  loading: boolean;
}

const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = ({ activities, loading }) => {
  const getActivityIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'user created':
        return 'user-plus';
      case 'course updated':
        return 'book';
      case 'system backup':
        return 'database';
      default:
        return 'info-circle';
    }
  };

  const getActivityColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'user created':
        return 'success';
      case 'course updated':
        return 'info';
      case 'system backup':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  return (
    <Card className="h-100">
      <CardHeader>
        <FontAwesomeIcon icon="history" className="me-2" />
        <Translate contentKey="adminDashboard.recentActivity">Recent Activity</Translate>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="text-center text-muted">
            <FontAwesomeIcon icon="spinner" spin /> <Translate contentKey="adminDashboard.loading">Loading...</Translate>
          </div>
        ) : activities && activities.length > 0 ? (
          <div className="activity-list">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className={`d-flex align-items-start mb-3 ${index === activities.length - 1 ? '' : 'border-bottom pb-3'}`}
              >
                <div className={`me-3 text-${getActivityColor(activity.action)}`}>
                  <FontAwesomeIcon icon={getActivityIcon(activity.action)} />
                </div>
                <div className="flex-grow-1">
                  <div className="fw-bold small">{activity.action}</div>
                  <div className="text-muted small">
                    by {activity.user}
                    {activity.details && (
                      <>
                        {' • '}
                        {activity.details}
                      </>
                    )}
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                    <TextFormat value={activity.timestamp} type="date" format={APP_LOCAL_DATETIME_FORMAT} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted">
            <FontAwesomeIcon icon="inbox" className="mb-2" size="2x" />
            <div>
              <Translate contentKey="adminDashboard.noActivity">No recent activity</Translate>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default RecentActivityWidget;
