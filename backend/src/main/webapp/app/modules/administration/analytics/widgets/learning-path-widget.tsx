import React from 'react';
import { Translate } from 'react-jhipster';
import { Card, CardBody, CardHeader, Row, Col, Progress, Badge, Table, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute, faExclamationTriangle, faTachometerAlt, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
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
  ScatterChart,
  Scatter,
  FunnelChart,
  Funnel,
  Cell,
} from 'recharts';

import { LearningPathAnalytics, TimeRange } from 'app/shared/services/comprehensive-analytics.service';

interface LearningPathWidgetProps {
  data: LearningPathAnalytics;
  compact?: boolean;
  timeRange: TimeRange;
}

const LearningPathWidget: React.FC<LearningPathWidgetProps> = ({ data, compact = false, timeRange }) => {
  // Prepare path progress data for charts
  const pathProgressData = data.pathProgress.map(path => ({
    ...path,
    shortName: path.courseName.length > 20 ? path.courseName.substring(0, 20) + '...' : path.courseName,
  }));

  // Prepare dropoff data
  const dropoffData = data.commonDropoffPoints.sort((a, b) => b.dropoffRate - a.dropoffRate);

  // Prepare learning velocity data
  const velocityData = data.learningVelocities.map(velocity => ({
    ...velocity,
    shortName: velocity.studentName.length > 15 ? velocity.studentName.substring(0, 15) + '...' : velocity.studentName,
  }));

  // Learning style distribution
  const learningStyleData = data.learningVelocities.reduce(
    (acc, velocity) => {
      const style = velocity.learningStyle;
      acc[style] = (acc[style] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const styleChartData = Object.entries(learningStyleData).map(([style, count]) => ({
    name: style,
    value: count,
    color: style === 'Visual' ? '#007bff' : '#28a745',
  }));

  if (compact) {
    return (
      <Card className="h-100">
        <CardHeader>
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faRoute} className="me-2 text-info" />
            <h5 className="mb-0">
              <Translate contentKey="comprehensiveAnalytics.learningPath.title">Learning Paths</Translate>
            </h5>
          </div>
        </CardHeader>
        <CardBody>
          <Row className="text-center">
            <Col xs="12">
              <div className="mb-3">
                <h3 className="text-primary mb-1">{data.averagePathCompletion.toFixed(1)}%</h3>
                <small className="text-muted">
                  <Translate contentKey="comprehensiveAnalytics.learningPath.avgCompletion">Avg Path Completion</Translate>
                </small>
                <Progress
                  value={data.averagePathCompletion}
                  color={data.averagePathCompletion >= 70 ? 'success' : data.averagePathCompletion >= 50 ? 'warning' : 'danger'}
                  className="mt-2"
                  style={{ height: '8px' }}
                />
              </div>
            </Col>
          </Row>

          {/* Top dropoff points */}
          <div className="mb-3">
            <h6 className="text-warning">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
              <Translate contentKey="comprehensiveAnalytics.learningPath.topDropoffs">Top Dropoff Points</Translate>
            </h6>
            {dropoffData.slice(0, 3).map((dropoff, index) => (
              <div key={dropoff.lessonId} className="d-flex justify-content-between align-items-center mb-2">
                <small className="text-truncate me-2">{dropoff.lessonTitle}</small>
                <Badge color="warning" pill>
                  {dropoff.dropoffRate.toFixed(1)}%
                </Badge>
              </div>
            ))}
          </div>

          {/* Mini progress chart */}
          <div style={{ height: '120px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pathProgressData.slice(0, 4)}>
                <XAxis dataKey="shortName" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip
                  formatter={value => [`${value}%`, 'Progress']}
                  labelFormatter={label => pathProgressData.find(d => d.shortName === label)?.courseName || label}
                />
                <Bar dataKey="averageProgress" fill="#007bff" />
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
                    <Translate contentKey="comprehensiveAnalytics.learningPath.avgCompletion">Average Path Completion</Translate>
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{data.averagePathCompletion.toFixed(1)}%</div>
                </div>
                <div className="col-auto">
                  <FontAwesomeIcon icon={faRoute} size="2x" className="text-primary" />
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
                    <Translate contentKey="comprehensiveAnalytics.learningPath.dropoffPoints">Critical Dropoff Points</Translate>
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{data.commonDropoffPoints.length}</div>
                </div>
                <div className="col-auto">
                  <FontAwesomeIcon icon={faExclamationTriangle} size="2x" className="text-warning" />
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
                    <Translate contentKey="comprehensiveAnalytics.learningPath.avgVelocity">Avg Learning Velocity</Translate>
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {data.learningVelocities.length > 0
                      ? (data.learningVelocities.reduce((sum, v) => sum + v.lessonsPerWeek, 0) / data.learningVelocities.length).toFixed(1)
                      : 0}{' '}
                    /week
                  </div>
                </div>
                <div className="col-auto">
                  <FontAwesomeIcon icon={faTachometerAlt} size="2x" className="text-success" />
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
                    <Translate contentKey="comprehensiveAnalytics.learningPath.totalStudents">Total Students Tracked</Translate>
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{data.learningVelocities.length}</div>
                </div>
                <div className="col-auto">
                  <FontAwesomeIcon icon={faGraduationCap} size="2x" className="text-info" />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Path Progress Chart */}
      <Row className="mb-4">
        <Col lg="8">
          <Card>
            <CardHeader>
              <h6 className="m-0 font-weight-bold text-primary">
                <Translate contentKey="comprehensiveAnalytics.learningPath.pathProgress">Learning Path Progress by Course</Translate>
              </h6>
            </CardHeader>
            <CardBody>
              <div style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pathProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="shortName" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'averageProgress' ? `${value}%` : value,
                        name === 'averageProgress'
                          ? 'Average Progress'
                          : name === 'studentsEnrolled'
                            ? 'Students Enrolled'
                            : 'Total Lessons',
                      ]}
                      labelFormatter={label => pathProgressData.find(d => d.shortName === label)?.courseName || label}
                    />
                    <Legend />
                    <Bar dataKey="averageProgress" fill="#007bff" name="Average Progress (%)" />
                    <Bar dataKey="studentsEnrolled" fill="#28a745" name="Students Enrolled" />
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
                <Translate contentKey="comprehensiveAnalytics.learningPath.learningStyles">Learning Style Distribution</Translate>
              </h6>
            </CardHeader>
            <CardBody>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={styleChartData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip formatter={value => [`${value} students`, 'Count']} />
                    <Bar dataKey="value" fill="#007bff" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Dropoff Analysis */}
      <Row className="mb-4">
        <Col lg="6">
          <Card>
            <CardHeader>
              <h6 className="m-0 font-weight-bold text-warning">
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                <Translate contentKey="comprehensiveAnalytics.learningPath.dropoffAnalysis">Common Dropoff Points</Translate>
              </h6>
            </CardHeader>
            <CardBody>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dropoffData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="lessonTitle" angle={-45} textAnchor="end" height={100} fontSize={10} />
                    <YAxis />
                    <Tooltip formatter={value => [`${value}%`, 'Dropoff Rate']} />
                    <Bar dataKey="dropoffRate" fill="#dc3545" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg="6">
          <Card>
            <CardHeader>
              <h6 className="m-0 font-weight-bold text-success">
                <Translate contentKey="comprehensiveAnalytics.learningPath.velocityAnalysis">Learning Velocity Analysis</Translate>
              </h6>
            </CardHeader>
            <CardBody>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={velocityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="lessonsPerWeek" name="Lessons/Week" type="number" />
                    <YAxis dataKey="averageQuizScore" name="Quiz Score" type="number" />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'lessonsPerWeek' ? `${value} lessons/week` : `${value} score`,
                        name === 'lessonsPerWeek' ? 'Learning Velocity' : 'Average Quiz Score',
                      ]}
                      labelFormatter={(label, payload) => (payload && payload[0] ? payload[0].payload.studentName : '')}
                    />
                    <Scatter dataKey="averageQuizScore" fill="#28a745" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Detailed Tables */}
      <Row>
        <Col lg="6">
          <Card>
            <CardHeader>
              <h6 className="m-0 font-weight-bold text-primary">
                <Translate contentKey="comprehensiveAnalytics.learningPath.pathDetails">Path Progress Details</Translate>
              </h6>
            </CardHeader>
            <CardBody>
              <div className="table-responsive">
                <Table hover size="sm">
                  <thead>
                    <tr>
                      <th>
                        <Translate contentKey="comprehensiveAnalytics.learningPath.course">Course</Translate>
                      </th>
                      <th>
                        <Translate contentKey="comprehensiveAnalytics.learningPath.progress">Progress</Translate>
                      </th>
                      <th>
                        <Translate contentKey="comprehensiveAnalytics.learningPath.students">Students</Translate>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.pathProgress.map((path, index) => (
                      <tr key={path.courseId}>
                        <td>
                          <div>
                            <div className="font-weight-bold">{path.courseName}</div>
                            <small className="text-muted">{path.totalLessons} lessons</small>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span>{path.averageProgress.toFixed(1)}%</span>
                            </div>
                            <Progress
                              value={path.averageProgress}
                              color={path.averageProgress >= 70 ? 'success' : path.averageProgress >= 50 ? 'warning' : 'danger'}
                              style={{ height: '6px' }}
                            />
                          </div>
                        </td>
                        <td>
                          <Badge color="info" pill>
                            {path.studentsEnrolled}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg="6">
          <Card>
            <CardHeader>
              <h6 className="m-0 font-weight-bold text-warning">
                <Translate contentKey="comprehensiveAnalytics.learningPath.dropoffDetails">Dropoff Point Details</Translate>
              </h6>
            </CardHeader>
            <CardBody>
              <div className="table-responsive">
                <Table hover size="sm">
                  <thead>
                    <tr>
                      <th>
                        <Translate contentKey="comprehensiveAnalytics.learningPath.lesson">Lesson</Translate>
                      </th>
                      <th>
                        <Translate contentKey="comprehensiveAnalytics.learningPath.dropoffRate">Dropoff Rate</Translate>
                      </th>
                      <th>
                        <Translate contentKey="comprehensiveAnalytics.learningPath.count">Count</Translate>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dropoffData.map((dropoff, index) => (
                      <tr key={dropoff.lessonId}>
                        <td>
                          <div className="font-weight-bold">{dropoff.lessonTitle}</div>
                        </td>
                        <td>
                          <Badge color={dropoff.dropoffRate > 20 ? 'danger' : dropoff.dropoffRate > 10 ? 'warning' : 'success'} pill>
                            {dropoff.dropoffRate.toFixed(1)}%
                          </Badge>
                        </td>
                        <td>
                          <span className="text-muted">{dropoff.dropoffCount}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LearningPathWidget;
