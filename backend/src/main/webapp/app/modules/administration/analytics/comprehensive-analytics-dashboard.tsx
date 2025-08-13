import React, { useState, useEffect } from 'react';
import { Translate, translate } from 'react-jhipster';
import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  Button,
  ButtonGroup,
  Spinner,
  Alert,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faUsers, faRoute, faBalanceScale, faDownload, faRefresh } from '@fortawesome/free-solid-svg-icons';

import comprehensiveAnalyticsService, { ComprehensiveAnalyticsData, TimeRange } from 'app/shared/services/comprehensive-analytics.service';
import CoursePerformanceWidget from './widgets/course-performance-widget';
import StudentEngagementWidget from './widgets/student-engagement-widget';
import LearningPathWidget from './widgets/learning-path-widget';
import ComparativeAnalyticsWidget from './widgets/comparative-analytics-widget';
import AnalyticsExportModal from './modals/analytics-export-modal';

import './comprehensive-analytics-dashboard.scss';

interface ComprehensiveAnalyticsDashboardProps {
  isTeacherView?: boolean;
  teacherId?: string;
}

const ComprehensiveAnalyticsDashboard: React.FC<ComprehensiveAnalyticsDashboardProps> = ({ isTeacherView = false, teacherId }) => {
  const [analyticsData, setAnalyticsData] = useState<ComprehensiveAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [activeTab, setActiveTab] = useState('overview');
  const [showExportModal, setShowExportModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange, isTeacherView, teacherId]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      let data: ComprehensiveAnalyticsData;

      if (isTeacherView && teacherId) {
        data = await comprehensiveAnalyticsService.getSpecificTeacherAnalytics(teacherId, timeRange);
      } else if (isTeacherView) {
        data = await comprehensiveAnalyticsService.getTeacherAnalytics(timeRange);
      } else {
        data = await comprehensiveAnalyticsService.getComprehensiveAnalytics(timeRange);
      }

      setAnalyticsData(data);
    } catch (err) {
      console.error('Error loading analytics data:', err);
      setError(translate('comprehensiveAnalytics.error.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
  };

  const handleTimeRangeChange = (newTimeRange: TimeRange) => {
    setTimeRange(newTimeRange);
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner color="primary" />
        <span className="ms-2">
          <Translate contentKey="comprehensiveAnalytics.loading">Loading analytics...</Translate>
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert color="danger">
        <FontAwesomeIcon icon="exclamation-triangle" className="me-2" />
        {error}
        <Button color="link" onClick={loadAnalyticsData} className="ms-2">
          <Translate contentKey="comprehensiveAnalytics.retry">Retry</Translate>
        </Button>
      </Alert>
    );
  }

  if (!analyticsData) {
    return (
      <Alert color="info">
        <Translate contentKey="comprehensiveAnalytics.noData">No analytics data available</Translate>
      </Alert>
    );
  }

  return (
    <div className="comprehensive-analytics-dashboard">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>
            <FontAwesomeIcon icon={faChartLine} className="me-2" />
            <Translate contentKey={`comprehensiveAnalytics.title.${isTeacherView ? 'teacher' : 'admin'}`}>
              {isTeacherView ? 'Teacher Analytics Dashboard' : 'Comprehensive Analytics Dashboard'}
            </Translate>
          </h2>
          <p className="text-muted mb-0">
            <Translate contentKey="comprehensiveAnalytics.subtitle">
              Comprehensive insights into course performance, student engagement, and learning outcomes
            </Translate>
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button color="outline-primary" onClick={handleRefresh} disabled={refreshing}>
            <FontAwesomeIcon icon={faRefresh} spin={refreshing} className="me-1" />
            <Translate contentKey="comprehensiveAnalytics.refresh">Refresh</Translate>
          </Button>
          <Button color="primary" onClick={handleExport}>
            <FontAwesomeIcon icon={faDownload} className="me-1" />
            <Translate contentKey="comprehensiveAnalytics.export">Export</Translate>
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <Card className="mb-4">
        <CardBody>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <Translate contentKey="comprehensiveAnalytics.timeRange.title">Time Range</Translate>
            </h5>
            <ButtonGroup>
              {(['week', 'month', 'quarter', 'year'] as TimeRange[]).map(range => (
                <Button
                  key={range}
                  color={timeRange === range ? 'primary' : 'outline-primary'}
                  onClick={() => handleTimeRangeChange(range)}
                  size="sm"
                >
                  <Translate contentKey={`comprehensiveAnalytics.timeRange.${range}`}>
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </Translate>
                </Button>
              ))}
            </ButtonGroup>
          </div>
          <small className="text-muted">
            <Translate contentKey="comprehensiveAnalytics.generatedAt">Generated at</Translate>:{' '}
            {new Date(analyticsData.generatedAt).toLocaleString()}
          </small>
        </CardBody>
      </Card>

      {/* Navigation Tabs */}
      <Nav tabs className="mb-4">
        <NavItem>
          <NavLink
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
            style={{ cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={faChartLine} className="me-1" />
            <Translate contentKey="comprehensiveAnalytics.tabs.overview">Overview</Translate>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === 'performance' ? 'active' : ''}
            onClick={() => setActiveTab('performance')}
            style={{ cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={faChartLine} className="me-1" />
            <Translate contentKey="comprehensiveAnalytics.tabs.performance">Course Performance</Translate>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === 'engagement' ? 'active' : ''}
            onClick={() => setActiveTab('engagement')}
            style={{ cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={faUsers} className="me-1" />
            <Translate contentKey="comprehensiveAnalytics.tabs.engagement">Student Engagement</Translate>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === 'learning' ? 'active' : ''}
            onClick={() => setActiveTab('learning')}
            style={{ cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={faRoute} className="me-1" />
            <Translate contentKey="comprehensiveAnalytics.tabs.learning">Learning Paths</Translate>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === 'comparative' ? 'active' : ''}
            onClick={() => setActiveTab('comparative')}
            style={{ cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={faBalanceScale} className="me-1" />
            <Translate contentKey="comprehensiveAnalytics.tabs.comparative">Comparative Analysis</Translate>
          </NavLink>
        </NavItem>
      </Nav>

      {/* Tab Content */}
      <TabContent activeTab={activeTab}>
        <TabPane tabId="overview">
          <Row>
            <Col lg="6" className="mb-4">
              <CoursePerformanceWidget data={analyticsData.coursePerformance} compact={true} timeRange={timeRange} />
            </Col>
            <Col lg="6" className="mb-4">
              <StudentEngagementWidget data={analyticsData.studentEngagement} compact={true} timeRange={timeRange} />
            </Col>
            <Col lg="6" className="mb-4">
              <LearningPathWidget data={analyticsData.learningPath} compact={true} timeRange={timeRange} />
            </Col>
            <Col lg="6" className="mb-4">
              <ComparativeAnalyticsWidget data={analyticsData.comparative} compact={true} timeRange={timeRange} />
            </Col>
          </Row>
        </TabPane>

        <TabPane tabId="performance">
          <CoursePerformanceWidget data={analyticsData.coursePerformance} compact={false} timeRange={timeRange} />
        </TabPane>

        <TabPane tabId="engagement">
          <StudentEngagementWidget data={analyticsData.studentEngagement} compact={false} timeRange={timeRange} />
        </TabPane>

        <TabPane tabId="learning">
          <LearningPathWidget data={analyticsData.learningPath} compact={false} timeRange={timeRange} />
        </TabPane>

        <TabPane tabId="comparative">
          <ComparativeAnalyticsWidget data={analyticsData.comparative} compact={false} timeRange={timeRange} />
        </TabPane>
      </TabContent>

      {/* Export Modal */}
      <AnalyticsExportModal
        isOpen={showExportModal}
        toggle={() => setShowExportModal(false)}
        analyticsData={analyticsData}
        timeRange={timeRange}
        isTeacherView={isTeacherView}
      />
    </div>
  );
};

export default ComprehensiveAnalyticsDashboard;
