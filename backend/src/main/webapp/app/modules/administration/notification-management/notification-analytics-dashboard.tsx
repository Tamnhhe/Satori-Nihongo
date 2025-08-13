import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Translate, translate } from 'react-jhipster';
import { Card } from 'app/shared/design-system/components/Card/Card';
import { Button } from 'app/shared/design-system/components/Button/Button';
import { Input } from 'app/shared/design-system/components/Input/Input';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getNotificationAnalytics, getDeliveryFailures } from './notification-analytics.reducer';
import './notification-analytics-dashboard.scss';

interface ChannelStats {
  successful: number;
  total: number;
  deliveryRate: number;
}

interface TypeStats {
  successful: number;
  total: number;
  deliveryRate: number;
}

const NotificationAnalyticsDashboard = () => {
  const dispatch = useAppDispatch();

  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0], // today
  });

  const { analytics, deliveryFailures, loading } = useAppSelector(state => state.notificationAnalytics);

  useEffect(() => {
    loadAnalytics();
  }, [dispatch, dateRange]);

  const loadAnalytics = () => {
    dispatch(
      getNotificationAnalytics({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      }),
    );
    dispatch(
      getDeliveryFailures({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      }),
    );
  };

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const getDeliveryRateColor = (rate: number) => {
    if (rate >= 95) return 'success';
    if (rate >= 85) return 'warning';
    return 'danger';
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  return (
    <div className="notification-analytics-dashboard">
      <div className="notification-analytics-dashboard__header">
        <div className="notification-analytics-dashboard__breadcrumb">
          <Link to="/admin/notifications">
            <Translate contentKey="notificationManagement.title">Notification Management</Translate>
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span>
            <Translate contentKey="notificationManagement.analytics">Analytics</Translate>
          </span>
        </div>

        <h1>
          <Translate contentKey="notificationManagement.analytics">Notification Analytics</Translate>
        </h1>

        <p className="notification-analytics-dashboard__description">
          <Translate contentKey="notificationManagement.analyticsDescription">
            Monitor notification delivery performance, engagement metrics, and identify areas for improvement
          </Translate>
        </p>
      </div>

      <div className="notification-analytics-dashboard__filters">
        <Card>
          <div className="filters-row">
            <div className="filter-group">
              <label>
                <Translate contentKey="notificationManagement.analytics.startDate">Start Date</Translate>
              </label>
              <Input type="date" value={dateRange.startDate} onChange={e => handleDateRangeChange('startDate', e.target.value)} />
            </div>

            <div className="filter-group">
              <label>
                <Translate contentKey="notificationManagement.analytics.endDate">End Date</Translate>
              </label>
              <Input type="date" value={dateRange.endDate} onChange={e => handleDateRangeChange('endDate', e.target.value)} />
            </div>

            <Button variant="primary" onClick={loadAnalytics} loading={loading}>
              <Translate contentKey="notificationManagement.analytics.refresh">Refresh</Translate>
            </Button>
          </div>
        </Card>
      </div>

      <div className="notification-analytics-dashboard__content">
        {/* Overview Metrics */}
        <div className="metrics-grid">
          <Card className="metric-card">
            <div className="metric-card__header">
              <h3>
                <Translate contentKey="notificationManagement.analytics.totalSent">Total Sent</Translate>
              </h3>
            </div>
            <div className="metric-card__value">{formatNumber(analytics?.overallStats?.SENT || 0)}</div>
            <div className="metric-card__change">
              <span className="change-indicator positive">+{formatNumber(analytics?.overallStats?.DELIVERED || 0)} delivered</span>
            </div>
          </Card>

          <Card className="metric-card">
            <div className="metric-card__header">
              <h3>
                <Translate contentKey="notificationManagement.analytics.deliveryRate">Delivery Rate</Translate>
              </h3>
            </div>
            <div className={`metric-card__value metric-card__value--${getDeliveryRateColor(analytics?.overallDeliveryRate || 0)}`}>
              {formatPercentage(analytics?.overallDeliveryRate || 0)}
            </div>
            <div className="metric-card__change">
              <span className="change-indicator">Target: 95%</span>
            </div>
          </Card>

          <Card className="metric-card">
            <div className="metric-card__header">
              <h3>
                <Translate contentKey="notificationManagement.analytics.avgDeliveryTime">Avg Delivery Time</Translate>
              </h3>
            </div>
            <div className="metric-card__value">{(analytics?.averageDeliveryTimeSeconds || 0).toFixed(1)}s</div>
            <div className="metric-card__change">
              <span className="change-indicator">
                <Translate contentKey="notificationManagement.analytics.seconds">seconds</Translate>
              </span>
            </div>
          </Card>

          <Card className="metric-card">
            <div className="metric-card__header">
              <h3>
                <Translate contentKey="notificationManagement.analytics.failedDeliveries">Failed Deliveries</Translate>
              </h3>
            </div>
            <div className="metric-card__value metric-card__value--danger">{formatNumber(analytics?.overallStats?.FAILED || 0)}</div>
            <div className="metric-card__change">
              <span className="change-indicator negative">
                {formatPercentage(((analytics?.overallStats?.FAILED || 0) / (analytics?.overallStats?.SENT || 1)) * 100)} failure rate
              </span>
            </div>
          </Card>
        </div>

        {/* Delivery Status Breakdown */}
        <div className="analytics-section">
          <Card>
            <div className="card-header">
              <h3>
                <Translate contentKey="notificationManagement.analytics.deliveryStatusBreakdown">Delivery Status Breakdown</Translate>
              </h3>
            </div>

            <div className="status-breakdown">
              {analytics?.overallStats &&
                Object.entries(analytics.overallStats).map(([status, count]) => (
                  <div key={status} className="status-item">
                    <div className="status-item__header">
                      <span className={`status-badge status-badge--${status.toLowerCase()}`}>
                        <Translate contentKey={`notificationManagement.deliveryStatus.${status.toLowerCase()}`}>{status}</Translate>
                      </span>
                      <span className="status-item__count">{formatNumber(count as number)}</span>
                    </div>
                    <div className="status-item__bar">
                      <div
                        className={`status-bar status-bar--${status.toLowerCase()}`}
                        style={{
                          width: `${((count as number) / Math.max(...Object.values(analytics.overallStats).map(v => v as number))) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>

        {/* Channel Performance */}
        <div className="analytics-section">
          <Card>
            <div className="card-header">
              <h3>
                <Translate contentKey="notificationManagement.analytics.channelPerformance">Channel Performance</Translate>
              </h3>
            </div>

            <div className="channel-performance">
              {analytics?.statsByChannel &&
                Object.entries(analytics.statsByChannel).map(([channel, stats]: [string, ChannelStats]) => (
                  <div key={channel} className="channel-item">
                    <div className="channel-item__header">
                      <div className="channel-info">
                        <span className="channel-icon">{channel === 'EMAIL' ? '📧' : channel === 'PUSH' ? '📱' : '🔔'}</span>
                        <span className="channel-name">
                          <Translate contentKey={`notificationManagement.channel.${channel.toLowerCase()}`}>{channel}</Translate>
                        </span>
                      </div>
                      <div className="channel-metrics">
                        <span className="metric">
                          {formatNumber(stats.successful)} / {formatNumber(stats.total)}
                        </span>
                        <span className={`delivery-rate delivery-rate--${getDeliveryRateColor(stats.deliveryRate)}`}>
                          {formatPercentage(stats.deliveryRate)}
                        </span>
                      </div>
                    </div>
                    <div className="channel-item__bar">
                      <div className="channel-bar channel-bar--success" style={{ width: `${stats.deliveryRate}%` }} />
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>

        {/* Notification Type Performance */}
        <div className="analytics-section">
          <Card>
            <div className="card-header">
              <h3>
                <Translate contentKey="notificationManagement.analytics.typePerformance">Notification Type Performance</Translate>
              </h3>
            </div>

            <div className="type-performance">
              {analytics?.statsByType &&
                Object.entries(analytics.statsByType).map(([type, stats]: [string, TypeStats]) => (
                  <div key={type} className="type-item">
                    <div className="type-item__header">
                      <span className="type-name">
                        <Translate contentKey={`notificationManagement.type.${type.toLowerCase()}`}>{type}</Translate>
                      </span>
                      <div className="type-metrics">
                        <span className="metric">
                          {formatNumber(stats.successful)} / {formatNumber(stats.total)}
                        </span>
                        <span className={`delivery-rate delivery-rate--${getDeliveryRateColor(stats.deliveryRate)}`}>
                          {formatPercentage(stats.deliveryRate)}
                        </span>
                      </div>
                    </div>
                    <div className="type-item__bar">
                      <div className="type-bar type-bar--success" style={{ width: `${stats.deliveryRate}%` }} />
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>

        {/* Failure Analysis */}
        <div className="analytics-section">
          <Card>
            <div className="card-header">
              <h3>
                <Translate contentKey="notificationManagement.analytics.failureAnalysis">Failure Analysis</Translate>
              </h3>
            </div>

            <div className="failure-analysis">
              {analytics?.failureReasons && Object.entries(analytics.failureReasons).length > 0 ? (
                <div className="failure-reasons">
                  {Object.entries(analytics.failureReasons).map(([reason, count]) => (
                    <div key={reason} className="failure-item">
                      <div className="failure-item__header">
                        <span className="failure-reason">{reason}</span>
                        <span className="failure-count">{formatNumber(count as number)}</span>
                      </div>
                      <div className="failure-item__bar">
                        <div
                          className="failure-bar"
                          style={{
                            width: `${((count as number) / Math.max(...Object.values(analytics.failureReasons).map(v => v as number))) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-failures">
                  <p>
                    <Translate contentKey="notificationManagement.analytics.noFailures">
                      No delivery failures in the selected time period.
                    </Translate>
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Daily Trends */}
        <div className="analytics-section">
          <Card>
            <div className="card-header">
              <h3>
                <Translate contentKey="notificationManagement.analytics.dailyTrends">Daily Delivery Trends</Translate>
              </h3>
            </div>

            <div className="daily-trends">
              {analytics?.dailyTrends && analytics.dailyTrends.length > 0 ? (
                <div className="trends-chart">
                  {analytics.dailyTrends.map((trend, index) => (
                    <div key={index} className="trend-item">
                      <div className="trend-date">{trend.date ? new Date(trend.date).toLocaleDateString() : `Day ${index + 1}`}</div>
                      <div className="trend-metrics">
                        <div className="trend-bar-container">
                          <div
                            className="trend-bar trend-bar--total"
                            style={{ height: `${(trend.total / Math.max(...analytics.dailyTrends.map(t => t.total))) * 100}%` }}
                            title={`Total: ${trend.total}`}
                          />
                        </div>
                        <div className="trend-stats">
                          <span className="trend-total">{formatNumber(trend.total)}</span>
                          <span className={`trend-rate trend-rate--${getDeliveryRateColor(trend.deliveryRate)}`}>
                            {formatPercentage(trend.deliveryRate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-trends">
                  <p>
                    <Translate contentKey="notificationManagement.analytics.noTrends">
                      No trend data available for the selected time period.
                    </Translate>
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotificationAnalyticsDashboard;
