import React from 'react';
import { Translate } from 'react-jhipster';
import { Card, CardBody, CardHeader, Row, Col, Progress, Badge, Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faUsers, faChartLine, faTrophy } from '@fortawesome/free-solid-svg-icons';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import { CoursePerformanceMetrics, TimeRange } from 'app/shared/services/comprehensive-analytics.service';

interface CoursePerformanceWidgetProps {
  data: CoursePerformanceMetrics;
  compact?: boolean;
  timeRange: TimeRange;
}

const CoursePerformanceWidget: React.FC<CoursePerformanceWidgetProps> = ({ data, compact = false, timeRange }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getPerformanceColor = (rate: number) => {
    if (rate >= 80) return '#28a745';
    if (rate >= 60) return '#ffc107';
    return '#dc3545';
  };

  // Prepare chart data
  const chartData = data.courseDetails.map(course => ({
    name: course.courseTitle.length > 15 ? course.courseTitle.substring(0, 15) + '...' : course.courseTitle,
    fullName: course.courseTitle,
    completionRate: course.completionRate,
    averageScore: course.averageScore,
    enrollmentCount: course.enrollmentCount,
  }));

  const difficultyData = data.courseDetails.reduce(
    (acc, course) => {
      const difficulty = course.difficulty;
      acc[difficulty] = (acc[difficulty] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const pieData = Object.entries(difficultyData).map(([difficulty, count]) => ({
    name: difficulty,
    value: count,
    color: difficulty === 'Easy' ? '#28a745' : difficulty === 'Medium' ? '#ffc107' : '#dc3545',
  }));

  if (compact) {
    return (
      <Card className="h-100">
        <CardHeader>
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faGraduationCap} className="me-2 text-primary" />
            <h5 className="mb-0">
              <Translate contentKey="comprehensiveAnalytics.coursePerformance.title">Course Performance</Translate>
            </h5>
          </div>
        </CardHeader>
        <CardBody>
          <Row className="text-center">
            <Col xs="6">
              <div className="mb-3">
                <h3 className="text-primary mb-1">{data.averageCompletionRate.toFixed(1)}%</h3>
                <small className="text-muted">
                  <Translate contentKey="comprehensiveAnalytics.coursePerformance.avgCompletion">Avg Completion</Translate>
                </small>
              </div>
            </Col>
            <Col xs="6">
              <div className="mb-3">
                <h3 className="text-success mb-1">{data.averageQuizScore.toFixed(1)}</h3>
                <small className="text-muted">
                  <Translate contentKey="comprehensiveAnalytics.coursePerformance.avgScore">Avg Score</Translate>
                </small>
              </div>
            </Col>
            <Col xs="6">
              <div className="mb-3">
                <h3 className="text-info mb-1">{data.totalEnrollments}</h3>
                <small className="text-muted">
                  <Translate contentKey="comprehensiveAnalytics.coursePerformance.totalEnrollments">Total Enrollments</Translate>
                </small>
              </div>
            </Col>
            <Col xs="6">
              <div className="mb-3">
                <h3 className="text-warning mb-1">{data.activeStudents}</h3>
                <small className="text-muted">
                  <Translate contentKey="comprehensiveAnalytics.coursePerformance.activeStudents">Active Students</Translate>
                </small>
              </div>
            </Col>
          </Row>

          {/* Mini chart */}
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  formatter={(value, name) => [
                    `${value}${name === 'completionRate' ? '%' : ''}`,
                    name === 'completionRate' ? 'Completion Rate' : 'Average Score',
                  ]}
                  labelFormatter={label => chartData.find(d => d.name === label)?.fullName || label}
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
      {/* Summary Cards */}
      <Row className="mb-4">
        <Col lg="3" md="6" className="mb-3">
          <Card className="border-left-primary">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    <Translate contentKey="comprehensiveAnalytics.coursePerformance.avgCompletion">Average Completion Rate</Translate>
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{data.averageCompletionRate.toFixed(1)}%</div>
                </div>
                <div className="col-auto">
                  <FontAwesomeIcon icon={faChartLine} size="2x" className="text-primary" />
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
                    <Translate contentKey="comprehensiveAnalytics.coursePerformance.avgScore">Average Quiz Score</Translate>
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{data.averageQuizScore.toFixed(1)}</div>
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
                    <Translate contentKey="comprehensiveAnalytics.coursePerformance.totalEnrollments">Total Enrollments</Translate>
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{data.totalEnrollments}</div>
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
                    <Translate contentKey="comprehensiveAnalytics.coursePerformance.activeStudents">Active Students</Translate>
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{data.activeStudents}</div>
                </div>
                <div className="col-auto">
                  <FontAwesomeIcon icon={faGraduationCap} size="2x" className="text-warning" />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col lg="8">
          <Card>
            <CardHeader>
              <h6 className="m-0 font-weight-bold text-primary">
                <Translate contentKey="comprehensiveAnalytics.coursePerformance.completionRates">Course Completion Rates</Translate>
              </h6>
            </CardHeader>
            <CardBody>
              <div style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        `${value}${name === 'completionRate' ? '%' : ''}`,
                        name === 'completionRate' ? 'Completion Rate' : 'Average Score',
                      ]}
                      labelFormatter={label => chartData.find(d => d.name === label)?.fullName || label}
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
                <Translate contentKey="comprehensiveAnalytics.coursePerformance.difficultyDistribution">Difficulty Distribution</Translate>
              </h6>
            </CardHeader>
            <CardBody>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <h6 className="m-0 font-weight-bold text-primary">
            <Translate contentKey="comprehensiveAnalytics.coursePerformance.detailedMetrics">Detailed Course Metrics</Translate>
          </h6>
        </CardHeader>
        <CardBody>
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>
                    <Translate contentKey="comprehensiveAnalytics.coursePerformance.courseName">Course Name</Translate>
                  </th>
                  <th>
                    <Translate contentKey="comprehensiveAnalytics.coursePerformance.completionRate">Completion Rate</Translate>
                  </th>
                  <th>
                    <Translate contentKey="comprehensiveAnalytics.coursePerformance.averageScore">Average Score</Translate>
                  </th>
                  <th>
                    <Translate contentKey="comprehensiveAnalytics.coursePerformance.enrollments">Enrollments</Translate>
                  </th>
                  <th>
                    <Translate contentKey="comprehensiveAnalytics.coursePerformance.difficulty">Difficulty</Translate>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.courseDetails.map((course, index) => (
                  <tr key={course.courseId}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div>
                          <div className="font-weight-bold">{course.courseTitle}</div>
                          <small className="text-muted">ID: {course.courseId}</small>
                        </div>
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
                      <Badge color={getDifficultyColor(course.difficulty)} pill>
                        {course.difficulty}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CoursePerformanceWidget;
