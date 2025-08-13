import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spin, Alert, Button, Modal } from 'antd';
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import { Translate } from 'react-jhipster';
import dayjs from 'dayjs';

import { StudentProgressChart, StudentProgressData, CourseProgress } from 'app/shared/components/charts';
import studentProgressAnalyticsService, { ProgressSummary } from 'app/shared/services/student-progress-analytics.service';

const StudentProgressAnalytics: React.FC = () => {
  const [progressData, setProgressData] = useState<StudentProgressData[]>([]);
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drillDownVisible, setDrillDownVisible] = useState(false);
  const [drillDownData, setDrillDownData] = useState<StudentProgressData[]>([]);
  const [drillDownLoading, setDrillDownLoading] = useState(false);

  // Default date range: last 30 days
  const defaultEndDate = dayjs();
  const defaultStartDate = defaultEndDate.subtract(30, 'day');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);

    try {
      const startDate = defaultStartDate.format('YYYY-MM-DD');
      const endDate = defaultEndDate.format('YYYY-MM-DD');

      // Load all data in parallel
      const [progressResult, courseResult, summaryResult] = await Promise.all([
        studentProgressAnalyticsService.getStudentProgressData({ startDate, endDate }),
        studentProgressAnalyticsService.getCourseProgressData(),
        studentProgressAnalyticsService.getProgressSummary({ startDate, endDate }),
      ]);

      setProgressData(progressResult);
      setCourseProgress(courseResult);
      setSummary(summaryResult);
    } catch (err) {
      console.error('Error loading analytics data:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleDrillDown = async (studentId: number, courseId?: number, dateRange?: [string, string]) => {
    setDrillDownLoading(true);
    setDrillDownVisible(true);

    try {
      const startDate = dateRange ? dateRange[0] : defaultStartDate.format('YYYY-MM-DD');
      const endDate = dateRange ? dateRange[1] : defaultEndDate.format('YYYY-MM-DD');

      const detailedData = await studentProgressAnalyticsService.getDetailedStudentProgress({
        studentId,
        courseId,
        startDate,
        endDate,
      });

      setDrillDownData(detailedData);
    } catch (err) {
      console.error('Error loading detailed progress:', err);
    } finally {
      setDrillDownLoading(false);
    }
  };

  const handleExportData = () => {
    // TODO: Implement export functionality
    // eslint-disable-next-line no-console
    console.log('Export data functionality to be implemented');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>
          <Translate contentKey="studentProgress.loading">Loading analytics data...</Translate>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message={<Translate contentKey="studentProgress.error">Failed to load analytics data</Translate>}
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={loadInitialData}>
            Retry
          </Button>
        }
      />
    );
  }

  return (
    <div className="student-progress-analytics">
      <Row gutter={[16, 16]}>
        {/* Summary Cards */}
        {summary && (
          <>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>{summary.averageScore.toFixed(1)}%</div>
                  <div style={{ color: '#666' }}>
                    <Translate contentKey="studentProgress.summary.averageScore">Average Score</Translate>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>{summary.averageCompletion.toFixed(1)}%</div>
                  <div style={{ color: '#666' }}>
                    <Translate contentKey="studentProgress.summary.averageCompletion">Average Completion</Translate>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>{summary.totalQuizzes}</div>
                  <div style={{ color: '#666' }}>
                    <Translate contentKey="studentProgress.summary.totalQuizzes">Total Quizzes</Translate>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>{summary.activeStudents}</div>
                  <div style={{ color: '#666' }}>
                    <Translate contentKey="studentProgress.summary.activeStudents">Active Students</Translate>
                  </div>
                </div>
              </Card>
            </Col>
          </>
        )}

        {/* Main Chart */}
        <Col xs={24}>
          <StudentProgressChart
            data={progressData}
            courseProgress={courseProgress}
            loading={false}
            onDrillDown={handleDrillDown}
            className="student-progress-chart"
          />
        </Col>

        {/* Export Button */}
        <Col xs={24}>
          <div style={{ textAlign: 'right', marginTop: '16px' }}>
            <Button type="primary" icon={<DownloadOutlined />} onClick={handleExportData}>
              Export Data
            </Button>
          </div>
        </Col>
      </Row>

      {/* Drill-down Modal */}
      <Modal
        title={
          <span>
            <EyeOutlined style={{ marginRight: '8px' }} />
            <Translate contentKey="studentProgress.drillDown.title">Detailed Progress Analysis</Translate>
          </span>
        }
        open={drillDownVisible}
        onCancel={() => setDrillDownVisible(false)}
        width={1000}
        footer={null}
      >
        <Spin spinning={drillDownLoading}>
          {drillDownData.length > 0 ? (
            <StudentProgressChart data={drillDownData} loading={drillDownLoading} className="student-progress-chart" />
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Translate contentKey="studentProgress.noData">No data available</Translate>
            </div>
          )}
        </Spin>
      </Modal>
    </div>
  );
};

export default StudentProgressAnalytics;
