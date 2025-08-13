import React from 'react';
import { Translate } from 'react-jhipster';
import { Badge, Card, CardBody, CardHeader } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface SystemHealthWidgetProps {
  health?: any;
  loading: boolean;
}

const SystemHealthWidget: React.FC<SystemHealthWidgetProps> = ({ health, loading }) => {
  const getBadgeType = (status: string) => (status !== 'UP' ? 'danger' : 'success');

  const getOverallStatus = () => {
    if (!health || !health.components) return 'DOWN';

    const components = health.components;
    const allUp = Object.keys(components).every(key => components[key].status === 'UP');

    return allUp ? 'UP' : 'DOWN';
  };

  const getHealthIcon = (status: string) => {
    return status === 'UP' ? 'check-circle' : 'exclamation-triangle';
  };

  return (
    <Card className="h-100">
      <CardHeader>
        <FontAwesomeIcon icon="heartbeat" className="me-2" />
        <Translate contentKey="adminDashboard.systemHealth">System Health</Translate>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="text-center text-muted">
            <FontAwesomeIcon icon="spinner" spin /> <Translate contentKey="adminDashboard.loading">Loading...</Translate>
          </div>
        ) : health && health.components ? (
          <div>
            <div className="text-center mb-3">
              <div className={`h3 mb-2 text-${getBadgeType(getOverallStatus())}`}>
                <FontAwesomeIcon icon={getHealthIcon(getOverallStatus())} />
              </div>
              <Badge color={getBadgeType(getOverallStatus())} className="mb-2">
                {getOverallStatus()}
              </Badge>
              <div className="small text-muted">
                <Translate contentKey="adminDashboard.overallStatus">Overall Status</Translate>
              </div>
            </div>

            <div>
              <h6 className="mb-2">
                <Translate contentKey="adminDashboard.components">Components</Translate>
              </h6>
              {Object.keys(health.components)
                .slice(0, 4)
                .map((key, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-1">
                    <span className="small">{key}</span>
                    <Badge color={getBadgeType(health.components[key].status)} size="sm">
                      {health.components[key].status}
                    </Badge>
                  </div>
                ))}
              {Object.keys(health.components).length > 4 && (
                <div className="text-center mt-2">
                  <small className="text-muted">+{Object.keys(health.components).length - 4} more components</small>
                </div>
              )}
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

export default SystemHealthWidget;
