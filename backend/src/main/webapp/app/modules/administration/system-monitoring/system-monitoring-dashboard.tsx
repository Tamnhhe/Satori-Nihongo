import React, { useEffect, useState } from 'react';
import { Translate, TextFormat } from 'react-jhipster';
import { Alert, Button, Card, CardBody, CardHeader, Col, Input, Label, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faChartLine,
  faExclamationTriangle,
  faHeart,
  faMemory,
  faMicrochip,
  faNetworkWired,
  faRefresh,
  faServer,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import {
  getSystemMonitoring,
  acknowledgeAlert,
  getHistoricalMetrics,
  ISystemMonitoring,
  IPerformanceMetrics,
  IAlert,
  IErrorLog,
} from './system-monitoring.reducer';
import { Button as DSButton } from 'app/shared/design-system/components/Button/Button';
import { Card as DSCard } from 'app/shared/design-system/components/Card/Card';

import './system-monitoring-dashboard.scss';

// Utility function for formatting bytes
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const SystemMonitoringDashboard = () => {
  const dispatch = useAppDispatch();
  const { monitoring, loading, errorMessage, lastUpdated } = useAppSelector(state => state.systemMonitoring);

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

  useEffect(() => {
    dispatch(getSystemMonitoring());
    dispatch(getHistoricalMetrics('1h'));
  }, [dispatch]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        dispatch(getSystemMonitoring());
      }, 30000); // Refresh every 30 seconds
      setRefreshInterval(interval);
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [autoRefresh, dispatch]);

  const handleRefresh = () => {
    dispatch(getSystemMonitoring());
    dispatch(getHistoricalMetrics('1h'));
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    dispatch(acknowledgeAlert(alertId));
  };

  const getMetricColor = (value: number, thresholds: { warning: number; danger: number }): string => {
    if (value >= thresholds.danger) return 'danger';
    if (value >= thresholds.warning) return 'warning';
    return 'success';
  };

  if (loading && !monitoring) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">
            <Translate contentKey="loading">Loading...</Translate>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="system-monitoring-dashboard">
      <div className="dashboard-header">
        <div className="header-info">
          <h2>
            <FontAwesomeIcon icon={faChartLine} className="me-2" />
            <Translate contentKey="systemMonitoring.title">System Monitoring</Translate>
          </h2>
          {lastUpdated && (
            <div className="last-updated">
              <Translate contentKey="systemMonitoring.lastUpdated">Last updated:</Translate>{' '}
              <TextFormat value={lastUpdated} type="date" format="HH:mm:ss" />
            </div>
          )}
        </div>
        <div className="header-actions">
          <div className="auto-refresh">
            <Input type="checkbox" id="autoRefresh" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} />
            <Label for="autoRefresh" className="mb-0">
              <Translate contentKey="systemMonitoring.autoRefresh">Auto Refresh</Translate>
            </Label>
          </div>
          <DSButton variant="outline" onClick={handleRefresh} disabled={loading}>
            <FontAwesomeIcon icon={faRefresh} className={loading ? 'fa-spin' : ''} />
          </DSButton>
        </div>
      </div>

      {errorMessage && (
        <Alert color="danger">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          {errorMessage}
        </Alert>
      )}

      {monitoring && (
        <>
          {/* System Health Overview */}
          <Row className="mb-4">
            <Col>
              <SystemHealthCard health={monitoring.health} />
            </Col>
          </Row>

          {/* Performance Metrics */}
          <div className="monitoring-grid">
            <CpuMetricsCard metrics={monitoring.performance.cpu} />
            <MemoryMetricsCard metrics={monitoring.performance.memory} />
            <DiskMetricsCard metrics={monitoring.performance.disk} />
            <DatabaseMetricsCard metrics={monitoring.performance.database} />
          </div>

          {/* Alerts and Errors */}
          <Row>
            <Col md={6}>
              <ActiveAlertsCard alerts={monitoring.activeAlerts} onAcknowledge={handleAcknowledgeAlert} />
            </Col>
            <Col md={6}>
              <RecentErrorsCard errors={monitoring.recentErrors} />
            </Col>
          </Row>

          {/* Custom Metrics */}
          {monitoring.customMetrics && Object.keys(monitoring.customMetrics).length > 0 && (
            <Row className="mt-4">
              <Col>
                <CustomMetricsCard metrics={monitoring.customMetrics} />
              </Col>
            </Row>
          )}
        </>
      )}
    </div>
  );
};

// System Health Card Component
const SystemHealthCard = ({ health }: { health: any }) => {
  const overallStatus = health.status;
  const statusIcon = overallStatus === 'UP' ? faCheck : faTimes;
  const statusColor = overallStatus === 'UP' ? 'success' : 'danger';

  return (
    <DSCard>
      <div className="monitoring-card">
        <div className="card-header">
          <h5 className="card-title">
            <FontAwesomeIcon icon={faHeart} />
            <Translate contentKey="systemMonitoring.systemHealth">System Health</Translate>
          </h5>
          <div className={`card-status status-${overallStatus.toLowerCase()}`}>
            <FontAwesomeIcon icon={statusIcon} className="me-1" />
            {overallStatus}
          </div>
        </div>

        <div className="health-components">
          <div className="component-list">
            {Object.entries(health.components).map(([name, component]: [string, any]) => (
              <div key={name} className="component-item">
                <div className="component-info">
                  <div className="component-name">{name}</div>
                  {component.description && <div className="component-description">{component.description}</div>}
                </div>
                <div className="component-status">
                  <span className={`status-badge status-${component.status.toLowerCase()}`}>{component.status}</span>
                  {component.responseTime && <span className="response-time">{component.responseTime}ms</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DSCard>
  );
};

// CPU Metrics Card Component
const CpuMetricsCard = ({ metrics }: { metrics: any }) => {
  const usageColor = getMetricColor(metrics.usage, { warning: 70, danger: 90 });

  return (
    <div className="monitoring-card">
      <div className="card-header">
        <h6 className="card-title">
          <FontAwesomeIcon icon={faMicrochip} />
          <Translate contentKey="systemMonitoring.cpu">CPU</Translate>
        </h6>
      </div>
      <div className={`metric-value metric-${usageColor}`}>{metrics.usage.toFixed(1)}%</div>
      <div className="metric-label">
        <Translate contentKey="systemMonitoring.cpuUsage">CPU Usage</Translate>
      </div>
      <div className="progress-bar">
        <div className={`progress-fill progress-${usageColor}`} style={{ width: `${metrics.usage}%` }} />
      </div>
      <div className="metric-details">
        <div className="detail-item">
          <span>
            <Translate contentKey="systemMonitoring.cores">Cores</Translate>
          </span>
          <span className="detail-value">{metrics.cores}</span>
        </div>
        <div className="detail-item">
          <span>
            <Translate contentKey="systemMonitoring.loadAverage">Load Avg</Translate>
          </span>
          <span className="detail-value">{metrics.loadAverage >= 0 ? metrics.loadAverage.toFixed(2) : 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

// Memory Metrics Card Component
const MemoryMetricsCard = ({ metrics }: { metrics: any }) => {
  const usageColor = getMetricColor(metrics.usagePercentage, { warning: 70, danger: 90 });

  return (
    <div className="monitoring-card">
      <div className="card-header">
        <h6 className="card-title">
          <FontAwesomeIcon icon={faMemory} />
          <Translate contentKey="systemMonitoring.memory">Memory</Translate>
        </h6>
      </div>
      <div className={`metric-value metric-${usageColor}`}>{metrics.usagePercentage.toFixed(1)}%</div>
      <div className="metric-label">
        <Translate contentKey="systemMonitoring.memoryUsage">Memory Usage</Translate>
      </div>
      <div className="progress-bar">
        <div className={`progress-fill progress-${usageColor}`} style={{ width: `${metrics.usagePercentage}%` }} />
      </div>
      <div className="metric-details">
        <div className="detail-item">
          <span>
            <Translate contentKey="systemMonitoring.used">Used</Translate>
          </span>
          <span className="detail-value">{formatBytes(metrics.used)}</span>
        </div>
        <div className="detail-item">
          <span>
            <Translate contentKey="systemMonitoring.total">Total</Translate>
          </span>
          <span className="detail-value">{formatBytes(metrics.total)}</span>
        </div>
      </div>
    </div>
  );
};

// Disk Metrics Card Component
const DiskMetricsCard = ({ metrics }: { metrics: any }) => {
  const usageColor = getMetricColor(metrics.usagePercentage, { warning: 80, danger: 95 });

  return (
    <div className="monitoring-card">
      <div className="card-header">
        <h6 className="card-title">
          <FontAwesomeIcon icon={faServer} />
          <Translate contentKey="systemMonitoring.disk">Disk</Translate>
        </h6>
      </div>
      <div className={`metric-value metric-${usageColor}`}>{metrics.usagePercentage.toFixed(1)}%</div>
      <div className="metric-label">
        <Translate contentKey="systemMonitoring.diskUsage">Disk Usage</Translate>
      </div>
      <div className="progress-bar">
        <div className={`progress-fill progress-${usageColor}`} style={{ width: `${metrics.usagePercentage}%` }} />
      </div>
      <div className="metric-details">
        <div className="detail-item">
          <span>
            <Translate contentKey="systemMonitoring.used">Used</Translate>
          </span>
          <span className="detail-value">{formatBytes(metrics.used)}</span>
        </div>
        <div className="detail-item">
          <span>
            <Translate contentKey="systemMonitoring.free">Free</Translate>
          </span>
          <span className="detail-value">{formatBytes(metrics.free)}</span>
        </div>
      </div>
    </div>
  );
};

// Database Metrics Card Component
const DatabaseMetricsCard = ({ metrics }: { metrics: any }) => {
  const connectionColor = getMetricColor(metrics.connectionUsagePercentage, { warning: 70, danger: 90 });

  return (
    <div className="monitoring-card">
      <div className="card-header">
        <h6 className="card-title">
          <FontAwesomeIcon icon={faNetworkWired} />
          <Translate contentKey="systemMonitoring.database">Database</Translate>
        </h6>
      </div>
      <div className={`metric-value metric-${connectionColor}`}>{metrics.activeConnections}</div>
      <div className="metric-label">
        <Translate contentKey="systemMonitoring.activeConnections">Active Connections</Translate>
      </div>
      <div className="progress-bar">
        <div className={`progress-fill progress-${connectionColor}`} style={{ width: `${metrics.connectionUsagePercentage}%` }} />
      </div>
      <div className="metric-details">
        <div className="detail-item">
          <span>
            <Translate contentKey="systemMonitoring.maxConnections">Max</Translate>
          </span>
          <span className="detail-value">{metrics.maxConnections}</span>
        </div>
        <div className="detail-item">
          <span>
            <Translate contentKey="systemMonitoring.avgQueryTime">Avg Query</Translate>
          </span>
          <span className="detail-value">{metrics.averageQueryTime.toFixed(1)}ms</span>
        </div>
      </div>
    </div>
  );
};

// Active Alerts Card Component
const ActiveAlertsCard = ({ alerts, onAcknowledge }: { alerts: IAlert[]; onAcknowledge: (id: string) => void }) => (
  <DSCard>
    <CardHeader>
      <h5>
        <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
        <Translate contentKey="systemMonitoring.activeAlerts">Active Alerts</Translate>
      </h5>
    </CardHeader>
    <CardBody>
      <div className="alerts-section">
        {alerts.length === 0 ? (
          <div className="text-center text-muted">
            <Translate contentKey="systemMonitoring.noAlerts">No active alerts</Translate>
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className={`alert-item alert-${alert.severity.toLowerCase()} ${alert.acknowledged ? 'acknowledged' : ''}`}>
              <div className="alert-header">
                <h6 className="alert-title">{alert.title}</h6>
                <div className="alert-actions">
                  {!alert.acknowledged && (
                    <Button size="sm" color="outline-primary" onClick={() => onAcknowledge(alert.id)}>
                      <Translate contentKey="systemMonitoring.acknowledge">Acknowledge</Translate>
                    </Button>
                  )}
                </div>
              </div>
              <div className="alert-meta">
                <span className={`alert-severity severity-${alert.severity.toLowerCase()}`}>{alert.severity}</span>
                <span className="alert-type">{alert.type}</span>
                <span className="alert-time">
                  <TextFormat value={alert.createdAt} type="date" format="MMM DD, HH:mm" />
                </span>
              </div>
              <div className="alert-message">{alert.message}</div>
            </div>
          ))
        )}
      </div>
    </CardBody>
  </DSCard>
);

// Recent Errors Card Component
const RecentErrorsCard = ({ errors }: { errors: IErrorLog[] }) => (
  <DSCard>
    <CardHeader>
      <h5>
        <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
        <Translate contentKey="systemMonitoring.recentErrors">Recent Errors</Translate>
      </h5>
    </CardHeader>
    <CardBody>
      <div className="error-logs">
        {errors.length === 0 ? (
          <div className="text-center text-muted">
            <Translate contentKey="systemMonitoring.noErrors">No recent errors</Translate>
          </div>
        ) : (
          errors.map((error, index) => (
            <div key={index} className="log-item">
              <div className="log-timestamp">
                <TextFormat value={error.timestamp} type="date" format="HH:mm:ss" />
              </div>
              <div className={`log-level level-${error.level.toLowerCase()}`}>{error.level}</div>
              <div className="log-content">
                <div className="log-message">{error.message}</div>
                <div className="log-logger">{error.logger}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </CardBody>
  </DSCard>
);

// Custom Metrics Card Component
const CustomMetricsCard = ({ metrics }: { metrics: Record<string, any> }) => (
  <DSCard>
    <CardHeader>
      <h5>
        <FontAwesomeIcon icon={faChartLine} className="me-2" />
        <Translate contentKey="systemMonitoring.customMetrics">Custom Metrics</Translate>
      </h5>
    </CardHeader>
    <CardBody>
      <div className="monitoring-grid">
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key} className="monitoring-card">
            <div className="metric-value">{typeof value === 'number' ? value.toFixed(2) : value}</div>
            <div className="metric-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
          </div>
        ))}
      </div>
    </CardBody>
  </DSCard>
);

const getMetricColor = (value: number, thresholds: { warning: number; danger: number }): string => {
  if (value >= thresholds.danger) return 'danger';
  if (value >= thresholds.warning) return 'warning';
  return 'success';
};

export default SystemMonitoringDashboard;
