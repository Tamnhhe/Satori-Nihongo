import React, { useEffect } from 'react';
import { Translate } from 'react-jhipster';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getSystemHealth, getSystemMetrics } from '../administration.reducer';
import { getAdminDashboardStats } from './admin-dashboard.reducer';
import UserStatsWidget from './widgets/user-stats-widget';
import SystemHealthWidget from './widgets/system-health-widget';
import RecentActivityWidget from './widgets/recent-activity-widget';

export const AdminDashboard = () => {
  const dispatch = useAppDispatch();

  const health = useAppSelector(state => state.administration.health);
  const metrics = useAppSelector(state => state.administration.metrics);
  const dashboardStats = useAppSelector(state => state.adminDashboard.stats);
  const loading = useAppSelector(state => state.administration.loading || state.adminDashboard.loading);

  useEffect(() => {
    dispatch(getSystemHealth());
    dispatch(getSystemMetrics());
    dispatch(getAdminDashboardStats());
  }, []);

  const refreshDashboard = () => {
    dispatch(getSystemHealth());
    dispatch(getSystemMetrics());
    dispatch(getAdminDashboardStats());
  };

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2 data-cy="adminDashboardHeading">
              <Translate contentKey="adminDashboard.title">Admin Dashboard</Translate>
            </h2>
            <button className="btn btn-primary" onClick={refreshDashboard} disabled={loading}>
              <FontAwesomeIcon icon="sync" spin={loading} /> <Translate contentKey="adminDashboard.refresh">Refresh</Translate>
            </button>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg="4" md="6" className="mb-3">
          <UserStatsWidget stats={dashboardStats?.userStats} loading={loading} />
        </Col>
        <Col lg="4" md="6" className="mb-3">
          <SystemHealthWidget health={health} loading={loading} />
        </Col>
        <Col lg="4" md="12" className="mb-3">
          <Card className="h-100">
            <CardHeader>
              <FontAwesomeIcon icon="chart-line" className="me-2" />
              <Translate contentKey="adminDashboard.systemMetrics">System Metrics</Translate>
            </CardHeader>
            <CardBody>
              {metrics && metrics.jvm ? (
                <div>
                  <div className="mb-2">
                    <small className="text-muted">
                      <Translate contentKey="adminDashboard.jvmMemory">JVM Memory</Translate>
                    </small>
                    <div className="fw-bold">{Math.round((metrics.jvm['memory.used'] / metrics.jvm['memory.max']) * 100)}% used</div>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted">
                      <Translate contentKey="adminDashboard.httpRequests">HTTP Requests</Translate>
                    </small>
                    <div className="fw-bold">{metrics.http?.requests?.all?.count || 0} total</div>
                  </div>
                  <div>
                    <small className="text-muted">
                      <Translate contentKey="adminDashboard.uptime">Uptime</Translate>
                    </small>
                    <div className="fw-bold">{Math.round((metrics.jvm?.uptime || 0) / 3600)} hours</div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted">
                  <FontAwesomeIcon icon="spinner" spin /> <Translate contentKey="adminDashboard.loading">Loading...</Translate>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg="8" className="mb-3">
          <RecentActivityWidget activities={dashboardStats?.recentActivity} loading={loading} />
        </Col>
        <Col lg="4" className="mb-3">
          <Card className="h-100">
            <CardHeader>
              <FontAwesomeIcon icon="exclamation-triangle" className="me-2" />
              <Translate contentKey="adminDashboard.systemAlerts">System Alerts</Translate>
            </CardHeader>
            <CardBody>
              {dashboardStats?.systemAlerts?.length > 0 ? (
                <div>
                  {dashboardStats.systemAlerts.map((alert, index) => (
                    <div key={index} className={`alert alert-${alert.severity} mb-2`}>
                      <small>{alert.message}</small>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-success">
                  <FontAwesomeIcon icon="check-circle" className="me-2" />
                  <Translate contentKey="adminDashboard.noAlerts">No system alerts</Translate>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
