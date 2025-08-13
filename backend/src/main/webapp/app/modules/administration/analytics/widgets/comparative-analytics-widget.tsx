import React, { useState } from 'react';
import { Translate } from 'react-jhipster';
import { Card, CardBody, CardHeader, Row, Col, Badge, Table, Nav, NavItem, NavLink, TabContent, TabPane, Progress } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBalanceScale, faTrophy, faChartBar, faUsers } from '@fortawesome/free-solid-svg-icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  LineChart,
  Line,
} from 'recharts';

import { ComparativeAnalytics, TimeRange } from 'app/shared/services/comprehensive-analytics.service';

interface ComparativeAnalyticsWidgetProps {
  data: ComparativeAnalytics;
  compact?: boolean;
  timeRange: TimeRange;
}

const ComparativeAnalyticsWidget: React.FC<ComparativeAnalyticsWidgetProps> = ({ data, compact = false, timeRange }) => {
  const [activeTab, setActiveTab] = useState('courses');

  // Prepare course comparison data
  const courseComparisonData = data.courseComparisons.map(course => ({
    ...course,
    shortTitle: course.courseTitle.length > 15 ? course.courseTitle.substring(0, 15) + '...' : course.courseTitle,
  }));

  // Prepare class comparison data
  const classComparisonData = data.classComparisons.map(classItem => ({
    ...classItem,
    shortName: classItem.className.length > 15 ? classItem.className.substring(0, 15) + '...' : classItem.className,
  }));

  // Performance ranking data
  const performanceRanks = data.courseComparisons.reduce(
    (acc, course) => {
      const rank = course.performanceRank;
      acc[rank] = (acc[rank] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const rankData = Object.entries(performanceRanks).map(([rank, count]) => ({
    name: rank,
    value: count,
    color: rank === 'Excellent' ? '#28a745' : rank === 'Good' ? '#007bff' : rank === 'Average' ? '#ffc107' : '#dc3545',
  }));

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Excellent':
        return 'success';
      case 'Good':
        return 'primary';
      case 'Average':
        return 'warning';
      case 'Needs Improvement':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  if (compact) {
    return (
      <Card className="h-100">
        <CardHeader>
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faBalanceScale} className="me-2 text-warning" />
            <h5 className="mb-0">
              <Translate contentKey="comprehensiveAnalytics.comparative.title">Comparative Analysis</Translate>
            </h5>
          </div>
        </CardHeader>
        <CardBody>
          {/* Benchmark Summary */}
          <Row className="text-center mb-3">
            <Col xs="4">
              <div className="mb-2">
                <h4 className="text-primary mb-1">{data.benchmarks.platformAverageCompletion.toFixed(1)}%</h4>
                <small className="text-muted">
                  <Translate contentKey="comprehensiveAnalytics.comparative.avgCompletion">Platform Avg</Translate>
                </small>
              </div>
            </Col>
            <Col xs="4">
              <div className="mb-2">
                <h4 className="text-success mb-1">{data.benchmarks.platformAverageScore.toFixed(1)}</h4>
                <small className="text-muted">
                  <Translate contentKey="comprehensiveAnalytics.comparative.avgScore">Avg Score</Translate>
                </small>
              </div>
            </Col>
            <Col xs="4">
              <div className="mb-2">
                <h4 className="text-info mb-1">{data.benchmarks.platformEngagementRate.toFixed(1)}%</h4>
                <small className="text-muted">
                  <Translate contentKey="comprehensiveAnalytics.comparative.engagement">Engagement</Translate>
                </small>
              </div>
            </Col>
          </Row>

          {/* Top Performers */}
          <div className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <FontAwesomeIcon icon={faTrophy} className="text-warning me-2" />
              <h6 className="mb-0">
                <Translate contentKey="comprehensiveAnalytics.comparative.topPerformers">Top Performers</Translate>
              </h6>
            </div>
            <div className="small">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="text-muted">
                  <Translate contentKey="comprehensiveAnalytics.comparative.topCourse">Best Course:</Translate>
                </span>
                <Badge color="success" pill>
                  {data.benchmarks.topPerformingCourse}
                </Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">
                  <Translate contentKey="comprehensiveAnalytics.comparative.topClass">Best Class:</Translate>
                </span>
                <Badge color="info" pill>
                  {data.benchmarks.mostEngagingClass}
                </Badge>
              </div>
            </div>
          </div>

          {/* Mini comparison chart */}
          <div style={{ height: '120px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseComparisonData.slice(0, 4)}>
                <XAxis dataKey="shortTitle" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip
                  formatter={value => [`${value}%`, 'Completion Rate']}
                  labelFormatter={label => courseComparisonData.find(d => d.shortTitle === label)?.courseTitle || label}
                />
                <Bar dataKey="completionRate" fill="#007bff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div>
      {/* Benchmark Summary Cards */}
      <Row className="mb-4">
        <Col lg="3" md="6" className="mb-3">
          <Card className="border-left-primary">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    <Translate contentKey="comprehensiveAnalytics.comparative.platformAvgCompletion">Platform Avg Completion</Translate>
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{data.benchmarks.platformAverageCompletion.toFixed(1)}%</div>
                </div>
                <div className="col-auto">
                  <FontAwesomeIcon icon={faChartBar} size="2x" className="text-primary" />
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
                    <Translate contentKey="comprehensiveAnalytics.comparative.platformAvgScore">Platform Avg Score</Translate>
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{data.benchmarks.platformAverageScore.toFixed(1)}</div>
                </div>
                <div className="col-auto">
                  <FontAwesomeIcon icon={faTrophy} size="2x" className="text-success" />
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
                    <Translate contentKey="comprehensiveAnalytics.comparative.platformEngagement">Platform Engagement Rate</Translate>
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{data.benchmarks.platformEngagementRate.toFixed(1)}%</div>
                </div>
                <div className="col-auto">
                  <FontAwesomeIcon icon={faUsers} size="2x" className="text-info" />
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
                    <Translate contentKey="comprehensiveAnalytics.comparative.totalComparisons">Total Comparisons</Translate>
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {data.courseComparisons.length + data.classComparisons.length}
                  </div>
                </div>
                <div className="col-auto">
                  <FontAwesomeIcon icon={faBalanceScale} size="2x" className="text-warning" />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Top Performers Alert */}
      <Row className="mb-4">
        <Col lg="12">
          <Card className="border-left-warning">
            <CardBody>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faTrophy} size="2x" className="text-warning me-3" />
                <div>
                  <h5 className="text-warning mb-1">
                    <Translate contentKey="comprehensiveAnalytics.comparative.topPerformers">Top Performers</Translate>
                  </h5>
                  <p className="mb-0">
                    <strong>
                      <Translate contentKey="comprehensiveAnalytics.comparative.bestCourse">Best Performing Course:</Translate>
                    </strong>{' '}
                    {data.benchmarks.topPerformingCourse} |
                    <strong className="ms-3">
                      <Translate contentKey="comprehensiveAnalytics.comparative.mostEngaging">Most Engaging Class:</Translate>
                    </strong>{' '}
                    {data.benchmarks.mostEngagingClass}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Comparison Tabs */}
      <Nav tabs className="mb-4">
        <NavItem>
          <NavLink
            className={activeTab === 'courses' ? 'active' : ''}
            onClick={() => setActiveTab('courses')}
            style={{ cursor: 'pointer' }}
          >
            <Translate contentKey="comprehensiveAnalytics.comparative.courseComparison">Course Comparison</Translate>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === 'classes' ? 'active' : ''}
            onClick={() => setActiveTab('classes')}
            style={{ cursor: 'pointer' }}
          >
            <Translate contentKey="comprehensiveAnalytics.comparative.classComparison">Class Comparison</Translate>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === 'performance' ? 'active' : ''}
            onClick={() => setActiveTab('performance')}
            style={{ cursor: 'pointer' }}
          >
            <Translate contentKey="comprehensiveAnalytics.comparative.performanceAnalysis">Performance Analysis</Translate>
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab}>
        {/* Course Comparison Tab */}
        <TabPane tabId="courses">
          <Row className="mb-4">
            <Col lg="8">
              <Card>
                <CardHeader>
                  <h6 className="m-0 font-weight-bold text-primary">
                    <Translate contentKey="comprehensiveAnalytics.comparative.coursePerformanceComparison">
                      Course Performance Comparison
                    </Translate>
                  </h6>
                </CardHeader>
                <CardBody>
                  <div style={{ height: '400px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={courseComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="shortTitle" />
                        <YAxis />
                        <Tooltip
                          formatter={(value, name) => [
                            name === 'completionRate' ? `${value}%` : name === 'averageScore' ? `${value}` : value,
                            name === 'completionRate' ? 'Completion Rate' : name === 'averageScore' ? 'Average Score' : 'Enrollments',
                          ]}
                          labelFormatter={label => courseComparisonData.find(d => d.shortTitle === label)?.courseTitle || label}
                        />
                        <Legend />
                        <Bar dataKey="completionRate" fill="#007bff" name="Completion Rate (%)" />
                        <Bar dataKey="averageScore" fill="#28a745" name="Average Score" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col lg="4">
              <Card>
                <CardHeader>
                  <h6 className="m-0 font-weight-bold text-primary">
                    <Translate contentKey="comprehensiveAnalytics.comparative.performanceDistribution">Performance Distribution</Translate>
                  </h6>
                </CardHeader>
                <CardBody>
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={rankData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip formatter={value => [`${value} courses`, 'Count']} />
                        <Bar dataKey="value" fill="#007bff" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Course Comparison Table */}
          <Card>
            <CardHeader>
              <h6 className="m-0 font-weight-bold text-primary">
                <Translate contentKey="comprehensiveAnalytics.comparative.detailedCourseComparison">Detailed Course Comparison</Translate>
              </h6>
            </CardHeader>
            <CardBody>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>
                        <Translate contentKey="comprehensiveAnalytics.comparative.course">Course</Translate>
                      </th>
                      <th>
                        <Translate contentKey="comprehensiveAnalytics.comparative.completionRate">Completion Rate</Translate>
                      </th>
                      <th>
                        <Translate contentKey="comprehensiveAnalytics.comparative.averageScore">Average Score</Translate>
                      </th>
                      <th>
                        <Translate contentKey="comprehensiveAnalytics.comparative.enrollments">Enrollments</Translate>
                      </th>
                      <th>
                        <Translate contentKey="comprehensiveAnalytics.comparative.performance">Performance</Translate>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.courseComparisons.map((course, index) => (
                      <tr key={course.courseId}>
                        <td>
                          <div>
                            <div className="font-weight-bold">{course.courseTitle}</div>
                            <small className="text-muted">ID: {course.courseId}</small>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span>{course.completionRate.toFixed(1)}%</span>
                            </div>
                            <Progress
                              value={course.completionRate}
                              color={course.completionRate >= 80 ? 'success' : course.completionRate >= 60 ? 'warning' : 'danger'}
                              style={{ height: '6px' }}
                            />
                          </div>
                        </td>
                        <td>
                          <span
                            className={`font-weight-bold ${course.averageScore >= 80 ? 'text-success' : course.averageScore >= 60 ? 'text-warning' : 'text-danger'}`}
                          >
                            {course.averageScore.toFixed(1)}
                          </span>
                        </td>
                        <td>
                          <Badge color="info" pill>
                            {course.enrollmentCount}
                          </Badge>
                        </td>
                        <td>
                          <Badge color={getRankColor(course.performanceRank)} pill>
                            {course.performanceRank}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </TabPane>

        {/* Class Comparison Tab */}
        <TabPane tabId="classes">
          <Row className="mb-4">
            <Col lg="12">
              <Card>
                <CardHeader>
                  <h6 className="m-0 font-weight-bold text-primary">
                    <Translate contentKey="comprehensiveAnalytics.comparative.classPerformanceComparison">
                      Class Performance Comparison
                    </Translate>
                  </h6>
                </CardHeader>
                <CardBody>
                  <div style={{ height: '400px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={classComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="shortName" />
                        <YAxis />
                        <Tooltip
                          formatter={(value, name) => [
                            name === 'averageGPA' ? `${value}` : name === 'engagementScore' ? `${value}%` : value,
                            name === 'averageGPA' ? 'Average GPA' : name === 'engagementScore' ? 'Engagement Score' : 'Student Count',
                          ]}
                          labelFormatter={label => classComparisonData.find(d => d.shortName === label)?.className || label}
                        />
                        <Legend />
                        <Bar dataKey="averageGPA" fill="#007bff" name="Average GPA" />
                        <Bar dataKey="engagementScore" fill="#28a745" name="Engagement Score (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Class Comparison Table */}
          <Card>
            <CardHeader>
              <h6 className="m-0 font-weight-bold text-primary">
                <Translate contentKey="comprehensiveAnalytics.comparative.detailedClassComparison">Detailed Class Comparison</Translate>
              </h6>
            </CardHeader>
            <CardBody>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>
                        <Translate contentKey="comprehensiveAnalytics.comparative.class">Class</Translate>
                      </th>
                      <th>
                        <Translate contentKey="comprehensiveAnalytics.comparative.course">Course</Translate>
                      </th>
                      <th>
                        <Translate contentKey="comprehensiveAnalytics.comparative.averageGPA">Average GPA</Translate>
                      </th>
                      <th>
                        <Translate contentKey="comprehensiveAnalytics.comparative.studentCount">Students</Translate>
                      </th>
                      <th>
                        <Translate contentKey="comprehensiveAnalytics.comparative.engagementScore">Engagement</Translate>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.classComparisons.map((classItem, index) => (
                      <tr key={classItem.classId}>
                        <td>
                          <div>
                            <div className="font-weight-bold">{classItem.className}</div>
                            <small className="text-muted">ID: {classItem.classId}</small>
                          </div>
                        </td>
                        <td>
                          <span className="text-muted">{classItem.courseTitle}</span>
                        </td>
                        <td>
                          <span
                            className={`font-weight-bold ${classItem.averageGPA >= 3.5 ? 'text-success' : classItem.averageGPA >= 3.0 ? 'text-warning' : 'text-danger'}`}
                          >
                            {classItem.averageGPA.toFixed(2)}
                          </span>
                        </td>
                        <td>
                          <Badge color="info" pill>
                            {classItem.studentCount}
                          </Badge>
                        </td>
                        <td>
                          <div>
                            <span className="me-2">{classItem.engagementScore.toFixed(1)}%</span>
                            <Progress
                              value={classItem.engagementScore}
                              color={classItem.engagementScore >= 80 ? 'success' : classItem.engagementScore >= 60 ? 'warning' : 'danger'}
                              style={{ height: '6px', width: '60px', display: 'inline-block' }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </TabPane>

        {/* Performance Analysis Tab */}
        <TabPane tabId="performance">
          <Row>
            <Col lg="6">
              <Card>
                <CardHeader>
                  <h6 className="m-0 font-weight-bold text-primary">
                    <Translate contentKey="comprehensiveAnalytics.comparative.performanceScatter">
                      Performance vs Enrollment Analysis
                    </Translate>
                  </h6>
                </CardHeader>
                <CardBody>
                  <div style={{ height: '400px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart data={courseComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="enrollmentCount" name="Enrollments" type="number" />
                        <YAxis dataKey="completionRate" name="Completion Rate" type="number" />
                        <Tooltip
                          formatter={(value, name) => [
                            name === 'completionRate' ? `${value}%` : value,
                            name === 'completionRate' ? 'Completion Rate' : 'Enrollments',
                          ]}
                          labelFormatter={(label, payload) => (payload && payload[0] ? payload[0].payload.courseTitle : '')}
                        />
                        <Scatter dataKey="completionRate" fill="#007bff" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col lg="6">
              <Card>
                <CardHeader>
                  <h6 className="m-0 font-weight-bold text-primary">
                    <Translate contentKey="comprehensiveAnalytics.comparative.benchmarkComparison">Benchmark Comparison</Translate>
                  </h6>
                </CardHeader>
                <CardBody>
                  <div className="mb-4">
                    <h5 className="text-center mb-3">
                      <Translate contentKey="comprehensiveAnalytics.comparative.platformBenchmarks">Platform Benchmarks</Translate>
                    </h5>
                    <Row className="text-center">
                      <Col xs="4">
                        <div className="mb-3">
                          <h3 className="text-primary">{data.benchmarks.platformAverageCompletion.toFixed(1)}%</h3>
                          <small className="text-muted">
                            <Translate contentKey="comprehensiveAnalytics.comparative.avgCompletion">Avg Completion</Translate>
                          </small>
                        </div>
                      </Col>
                      <Col xs="4">
                        <div className="mb-3">
                          <h3 className="text-success">{data.benchmarks.platformAverageScore.toFixed(1)}</h3>
                          <small className="text-muted">
                            <Translate contentKey="comprehensiveAnalytics.comparative.avgScore">Avg Score</Translate>
                          </small>
                        </div>
                      </Col>
                      <Col xs="4">
                        <div className="mb-3">
                          <h3 className="text-info">{data.benchmarks.platformEngagementRate.toFixed(1)}%</h3>
                          <small className="text-muted">
                            <Translate contentKey="comprehensiveAnalytics.comparative.engagement">Engagement</Translate>
                          </small>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div className="text-center">
                    <div className="mb-3">
                      <FontAwesomeIcon icon={faTrophy} size="3x" className="text-warning mb-2" />
                      <h6 className="text-warning">
                        <Translate contentKey="comprehensiveAnalytics.comparative.champions">Platform Champions</Translate>
                      </h6>
                    </div>
                    <div className="mb-2">
                      <Badge color="success" className="me-2">
                        <Translate contentKey="comprehensiveAnalytics.comparative.topCourse">Top Course</Translate>
                      </Badge>
                      <span className="font-weight-bold">{data.benchmarks.topPerformingCourse}</span>
                    </div>
                    <div>
                      <Badge color="info" className="me-2">
                        <Translate contentKey="comprehensiveAnalytics.comparative.topClass">Top Class</Translate>
                      </Badge>
                      <span className="font-weight-bold">{data.benchmarks.mostEngagingClass}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </div>
  );
};

export default ComparativeAnalyticsWidget;
