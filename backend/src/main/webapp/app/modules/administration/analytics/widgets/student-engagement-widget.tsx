import React from 'react';
import { Translate } from 'react-jhipster';
import { Card, CardBody, CardHeader, Row, Col, Progress, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faUsers, faSync, faChartArea } from '@fortawesome/free-solid-svg-icons';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

import { StudentEngagementMetrics, TimeRange } from 'app/shared/services/comprehensive-analytics.service';

interface StudentEngagementWidgetProps {
  data: StudentEngagementMetrics;
  compact?: boolean;
  timeRange: TimeRange;
}

const StudentEngagementWidget: React.FC<StudentEngagementWidgetProps> = ({ data, compact = false, timeRange }) => {
  // Prepare engagement trend data for charts
  const trendData = data.engagementTrends.map(trend => ({
    ...trend,
    date: new Date(trend.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }));

  // Prepare activity pattern data
  const activityData = data.activityPatterns.map(pattern => ({
    ...pattern,
    hour: parseInt(pattern.timeSlot.split(':')[0], 10),
  }));

  // Group activity patterns by time periods
  const timeGroups = [
    { name: 'Morning (6-12)', range: [6, 12], color: '#ffc107' },
    { name: 'Afternoon (12-18)', range: [12, 18], color: '#28a745' },
    { name: 'Evening (18-24)', range: [18, 24], color: '#007bff' },
    { name: 'Night (0-6)', range: [0, 6], color: '#6c757d' },
  ];

  const groupedActivity = timeGroups.map(group => ({
    name: group.name,
    users: activityData.filter(d => d.hour >= group.range[0] && d.hour < group.range[1]).reduce((sum, d) => sum + d.userCount, 0),
    color: group.color,
  }));

  if (compact) {
    return (
      <Card className="h-100">
        <CardHeader>
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faUsers} className="me-2 text-success" />
            <h5 className="mb-0">
              <Translate contentKey="comprehensiveAnalytics.studentEngagement.title">Student Engagement</Translate>
            </h5>
          </div>
        </CardHeader>
        <CardBody>
          <Row className="text-center">
            <Col xs="6">
              <div className="mb-3">
                <h3 className="text-primary mb-1">{data.averageSessionDuration.toFixed(1)}</h3>
                <small className="text-muted">
                  <Translate contentKey="comprehensiveAnalytics.studentEngagement.avgSession">Avg Session (min)</Translate>
                </small>
              </div>
            </Col>
            <Col xs="6">
              <div className="mb-3">
                <h3 className="text-success mb-1">{data.dailyActiveUsers.toFixed(0)}</h3>
                <small className="text-muted">
                  <Translate contentKey="comprehensiveAnalytics.studentEngagement.dailyActive">Daily Active Users</Translate>
                </small>
              </div>
            </Col>
            <Col xs="12">
              <div className="mb-3">
                <h3 className="text-info mb-1">{data.weeklyRetentionRate.toFixed(1)}%</h3>
                <small className="text-muted">
                  <Translate contentKey="comprehensiveAnalytics.studentEngagement.retention">Weekly Retention</Translate>
                </small>
                <Progress
                  value={data.weeklyRetentionRate}
                  color={data.weeklyRetentionRate >= 70 ? 'success' : data.weeklyRetentionRate >= 50 ? 'warning' : 'danger'}
                  className="mt-2"
                  style={{ height: '8px' }}
                />
              </div>
            </Col>
          </Row>

          {/* Mini engagement trend chart */}
          <div style={{ height: '150px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData.slice(-7)}>
                <XAxis dataKey="date" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Line type="monotone" dataKey="activeUsers" stroke="#007bff" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div>
      {/* Summary Cards */}
      <Row className="mb-4">
        <Col lg="3" md="6" className="mb-3">
          <Card className="border-left-primary">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    <Translate contentKey="comprehensiveAnalytics.studentEngagement.avgSession">Average Session Duration</Translate>
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{data.averageSessionDuration.toFixed(1)} min</div>
                </div>
                <div className="col-auto">
                  <FontAwesomeIcon icon={faClock} size="2x" className="text-primary" />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg="3" md="6" className="mb-3">
          <Card className="border-left-success">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    <Translate contentKey="comprehensiveAnalytics.studentEngagement.dailyActive">Daily Active Users</Translate>
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{data.dailyActiveUsers.toFixed(0)}</div>
                </div>
                <div className="col-auto">
                  <FontAwesomeIcon icon={faUsers} size="2x" className="text-success" />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg="3" md="6" className="mb-3">
          <Card className="border-left-info">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    <Translate contentKey="comprehensiveAnalytics.studentEngagement.retention">Weekly Retention Rate</Translate>
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{data.weeklyRetentionRate.toFixed(1)}%</div>
                </div>
                <div className="col-auto">
                  <FontAwesomeIcon icon={faSync} size="2x" className="text-info" />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg="3" md="6" className="mb-3">
          <Card className="border-left-warning">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    <Translate contentKey="comprehensiveAnalytics.studentEngagement.totalLessons">Total Lessons Completed</Translate>
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {data.engagementTrends.reduce((sum, trend) => sum + trend.completedLessons, 0)}
                  </div>
                </div>
                <div className="col-auto">
                  <FontAwesomeIcon icon={faChartArea} size="2x" className="text-warning" />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Engagement Trends Chart */}
      <Row className="mb-4">
        <Col lg="8">
          <Card>
            <CardHeader>
              <h6 className="m-0 font-weight-bold text-primary">
                <Translate contentKey="comprehensiveAnalytics.studentEngagement.engagementTrends">Engagement Trends Over Time</Translate>
              </h6>
            </CardHeader>
            <CardBody>
              <div style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'activeUsers' ? `${value} users` : name === 'averageSessionTime' ? `${value} min` : `${value} lessons`,
                        name === 'activeUsers' ? 'Active Users' : name === 'averageSessionTime' ? 'Avg Session Time' : 'Completed Lessons',
                      ]}
                    />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="activeUsers"
                      stackId="1"
                      stroke="#007bff"
                      fill="#007bff"
                      fillOpacity={0.6}
                      name="Active Users"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="averageSessionTime"
                      stackId="2"
                      stroke="#28a745"
                      fill="#28a745"
                      fillOpacity={0.6}
                      name="Avg Session Time (min)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="completedLessons"
                      stroke="#ffc107"
                      strokeWidth={3}
                      name="Completed Lessons"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg="4">
          <Card>
            <CardHeader>
              <h6 className="m-0 font-weight-bold text-primary">
                <Translate contentKey="comprehensiveAnalytics.studentEngagement.activityByTime">Activity by Time Period</Translate>
              </h6>
            </CardHeader>
            <CardBody>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={groupedActivity} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={value => [`${value} users`, 'Active Users']} />
                    <Bar dataKey="users" fill="#007bff" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Hourly Activity Pattern */}
      <Row className="mb-4">
        <Col lg="12">
          <Card>
            <CardHeader>
              <h6 className="m-0 font-weight-bold text-primary">
                <Translate contentKey="comprehensiveAnalytics.studentEngagement.hourlyActivity">Hourly Activity Pattern</Translate>
              </h6>
            </CardHeader>
            <CardBody>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" domain={[0, 23]} type="number" tickFormatter={value => `${value}:00`} />
                    <YAxis />
                    <Tooltip formatter={value => [`${value} users`, 'Active Users']} labelFormatter={value => `${value}:00`} />
                    <Area type="monotone" dataKey="userCount" stroke="#007bff" fill="#007bff" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Engagement Metrics Summary */}
      <Row>
        <Col lg="12">
          <Card>
            <CardHeader>
              <h6 className="m-0 font-weight-bold text-primary">
                <Translate contentKey="comprehensiveAnalytics.studentEngagement.summary">Engagement Summary</Translate>
              </h6>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md="4">
                  <div className="text-center mb-3">
                    <h4 className="text-primary">
                      {data.engagementTrends.length > 0 ? Math.max(...data.engagementTrends.map(t => t.activeUsers)) : 0}
                    </h4>
                    <p className="text-muted mb-0">
                      <Translate contentKey="comprehensiveAnalytics.studentEngagement.peakUsers">Peak Daily Users</Translate>
                    </p>
                  </div>
                </Col>
                <Col md="4">
                  <div className="text-center mb-3">
                    <h4 className="text-success">
                      {data.engagementTrends.length > 0
                        ? (data.engagementTrends.reduce((sum, t) => sum + t.averageSessionTime, 0) / data.engagementTrends.length).toFixed(
                            1,
                          )
                        : 0}{' '}
                      min
                    </h4>
                    <p className="text-muted mb-0">
                      <Translate contentKey="comprehensiveAnalytics.studentEngagement.avgSessionOverall">Overall Avg Session</Translate>
                    </p>
                  </div>
                </Col>
                <Col md="4">
                  <div className="text-center mb-3">
                    <h4 className="text-info">{data.engagementTrends.reduce((sum, t) => sum + t.completedLessons, 0)}</h4>
                    <p className="text-muted mb-0">
                      <Translate contentKey="comprehensiveAnalytics.studentEngagement.totalLessonsCompleted">
                        Total Lessons Completed
                      </Translate>
                    </p>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentEngagementWidget;
