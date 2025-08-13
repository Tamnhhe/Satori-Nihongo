import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Progress,
  Button,
  Select,
  DatePicker,
  Space,
  Spin,
  message,
  Tabs,
  Tag,
  Tooltip,
  Empty,
  Typography,
  Divider,
  Dropdown,
  Menu,
} from 'antd';
import {
  DownloadOutlined,
  ArrowLeftOutlined,
  TrophyOutlined,
  AlertOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FileTextOutlined,
  BarChartOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { Translate, translate } from 'react-jhipster';
import { Line, Bar, Pie } from '@ant-design/plots';
import axios from 'axios';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

interface QuizAnalytics {
  quizId: number;
  quizTitle: string;
  totalAttempts: number;
  completedAttempts: number;
  uniqueStudents: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  completionRate: number;
  averageTimeSpent?: number;
  lastAttempt?: string;
  scoreDistribution: Record<string, number>;
  questionAnalytics: QuestionAnalytics[];
  timeBasedAnalytics: TimeBasedAnalytics[];
  topPerformers: StudentPerformance[];
  strugglingStudents: StudentPerformance[];
}

interface QuestionAnalytics {
  questionId: number;
  questionContent: string;
  questionType: string;
  totalAnswers: number;
  correctAnswers: number;
  correctPercentage: number;
  averageTimeSpent?: number;
  answerDistribution: Record<string, number>;
  commonWrongAnswers: string[];
}

interface TimeBasedAnalytics {
  period: string;
  attempts: number;
  averageScore: number;
  uniqueStudents: number;
}

interface StudentPerformance {
  studentId: number;
  studentName: string;
  studentCode: string;
  bestScore: number;
  averageScore: number;
  totalAttempts: number;
  lastAttempt?: string;
  timeSpent?: number;
}

export const QuizAnalyticsDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<QuizAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [timeRange, setTimeRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      fetchAnalytics();
    }
  }, [id, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/quiz-analytics/${id}`);
      setAnalytics(response.data);
    } catch (error) {
      message.error('Failed to load quiz analytics');
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type: 'results' | 'analytics') => {
    try {
      setExporting(true);
      const endpoint = type === 'results' ? `/api/admin/quiz-analytics/${id}/export` : `/api/admin/quiz-analytics/${id}/export-analytics`;

      const response = await axios.get(endpoint, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = type === 'results' ? `quiz_results_${id}.csv` : `quiz_analytics_${id}.csv`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      const successMessage = type === 'results' ? 'Quiz results exported successfully' : 'Quiz analytics exported successfully';
      message.success(successMessage);
    } catch (error) {
      message.error('Failed to export data');
      console.error('Error exporting:', error);
    } finally {
      setExporting(false);
    }
  };

  const exportMenu = (
    <Menu
      items={[
        {
          key: 'results',
          label: (
            <span onClick={() => handleExport('results')}>
              <Translate contentKey="quizAnalytics.exportResults">Export Student Results</Translate>
            </span>
          ),
        },
        {
          key: 'analytics',
          label: (
            <span onClick={() => handleExport('analytics')}>
              <Translate contentKey="quizAnalytics.exportAnalytics">Export Full Analytics</Translate>
            </span>
          ),
        },
      ]}
    />
  );

  const getScoreDistributionData = () => {
    if (!analytics?.scoreDistribution) return [];

    return Object.entries(analytics.scoreDistribution).map(([range, count]) => ({
      range,
      count,
      percentage: ((count / analytics.completedAttempts) * 100).toFixed(1),
    }));
  };

  const getTimeBasedData = () => {
    if (!analytics?.timeBasedAnalytics) return [];

    return analytics.timeBasedAnalytics.map(item => ({
      period: item.period,
      attempts: item.attempts,
      averageScore: item.averageScore,
      uniqueStudents: item.uniqueStudents,
    }));
  };

  // eslint-disable-next-line complexity
  const renderOverviewTab = () => (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={<Translate contentKey="quizAnalytics.totalAttempts">Total Attempts</Translate>}
              value={analytics?.totalAttempts || 0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={<Translate contentKey="quizAnalytics.completedAttempts">Completed Attempts</Translate>}
              value={analytics?.completedAttempts || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={<Translate contentKey="quizAnalytics.uniqueStudents">Unique Students</Translate>}
              value={analytics?.uniqueStudents || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={<Translate contentKey="quizAnalytics.averageScore">Average Score</Translate>}
              value={analytics?.averageScore || 0}
              precision={1}
              suffix="%"
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={<Translate contentKey="quizAnalytics.highestScore">Highest Score</Translate>}
              value={analytics?.highestScore || 0}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#3f8600' }}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={<Translate contentKey="quizAnalytics.lowestScore">Lowest Score</Translate>}
              value={analytics?.lowestScore || 0}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#cf1322' }}
              prefix={<AlertOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={<Translate contentKey="quizAnalytics.completionRate">Completion Rate</Translate>}
              value={analytics?.completionRate || 0}
              precision={1}
              suffix="%"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={<Translate contentKey="quizAnalytics.averageTimeSpent">Avg Time Spent</Translate>}
              value={analytics?.averageTimeSpent || 0}
              precision={1}
              suffix=" min"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title={<Translate contentKey="quizAnalytics.lastAttempt">Last Attempt</Translate>}
              value={analytics?.lastAttempt ? dayjs(analytics.lastAttempt).format('MMM DD, YYYY HH:mm') : 'N/A'}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title={<Translate contentKey="quizAnalytics.scoreDistribution">Score Distribution</Translate>}>
            {analytics?.scoreDistribution && Object.keys(analytics.scoreDistribution).length > 0 ? (
              <Bar
                data={getScoreDistributionData()}
                xField="count"
                yField="range"
                seriesField="range"
                color="#1890ff"
                height={300}
                label={{
                  position: 'middle',
                  style: {
                    fill: '#FFFFFF',
                    opacity: 0.6,
                  },
                }}
                tooltip={{
                  formatter: datum => ({
                    name: 'Students',
                    value: `${datum.count} (${datum.percentage}%)`,
                  }),
                }}
              />
            ) : (
              <Empty description="No data available" />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<Translate contentKey="quizAnalytics.timeBasedAnalytics">Time-based Analytics</Translate>}>
            {analytics?.timeBasedAnalytics && analytics.timeBasedAnalytics.length > 0 ? (
              <Line
                data={getTimeBasedData()}
                xField="period"
                yField="averageScore"
                height={300}
                point={{
                  size: 5,
                  shape: 'diamond',
                }}
                label={{
                  style: {
                    fill: '#aaa',
                  },
                }}
                tooltip={{
                  formatter: datum => [
                    { name: 'Average Score', value: `${datum.averageScore.toFixed(1)}%` },
                    { name: 'Attempts', value: datum.attempts },
                    { name: 'Unique Students', value: datum.uniqueStudents },
                  ],
                }}
                yAxis={{
                  label: {
                    formatter: v => `${v}%`,
                  },
                }}
              />
            ) : (
              <Empty description="No data available" />
            )}
          </Card>
        </Col>
      </Row>

      {/* Additional Analytics Cards */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card title={<Translate contentKey="quizAnalytics.performanceInsights">Performance Insights</Translate>}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                    {analytics?.scoreDistribution ? Math.max(...Object.values(analytics.scoreDistribution)) : 0}
                  </div>
                  <div style={{ color: '#666' }}>Most Common Score Range</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {analytics?.scoreDistribution
                      ? Object.entries(analytics.scoreDistribution).reduce((a, b) =>
                          analytics.scoreDistribution[a[0]] > analytics.scoreDistribution[b[0]] ? a : b,
                        )[0]
                      : 'N/A'}
                  </div>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                    {analytics?.completedAttempts && analytics?.totalAttempts
                      ? ((analytics.completedAttempts / analytics.totalAttempts) * 100).toFixed(1)
                      : 0}
                    %
                  </div>
                  <div style={{ color: '#666' }}>Completion Rate</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {analytics?.completedAttempts || 0} of {analytics?.totalAttempts || 0} attempts
                  </div>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
                    {analytics?.averageScore
                      ? analytics.averageScore >= 80
                        ? 'Excellent'
                        : analytics.averageScore >= 60
                          ? 'Good'
                          : analytics.averageScore >= 40
                            ? 'Fair'
                            : 'Needs Improvement'
                      : 'N/A'}
                  </div>
                  <div style={{ color: '#666' }}>Overall Performance</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    Based on average score of {analytics?.averageScore?.toFixed(1) || 0}%
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderStudentPerformanceTab = () => {
    const topPerformersColumns = [
      {
        title: <Translate contentKey="quizAnalytics.studentName">Student Name</Translate>,
        dataIndex: 'studentName',
        key: 'studentName',
        render: (text: string, record: StudentPerformance) => (
          <div>
            <strong>{text}</strong>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.studentCode}</div>
          </div>
        ),
      },
      {
        title: <Translate contentKey="quizAnalytics.bestScore">Best Score</Translate>,
        dataIndex: 'bestScore',
        key: 'bestScore',
        render: (score: number) => <Tag color="green">{score.toFixed(1)}%</Tag>,
        sorter: (a: StudentPerformance, b: StudentPerformance) => a.bestScore - b.bestScore,
      },
      {
        title: <Translate contentKey="quizAnalytics.averageScore">Average Score</Translate>,
        dataIndex: 'averageScore',
        key: 'averageScore',
        render: (score: number) => `${score.toFixed(1)}%`,
        sorter: (a: StudentPerformance, b: StudentPerformance) => a.averageScore - b.averageScore,
      },
      {
        title: <Translate contentKey="quizAnalytics.totalAttempts">Total Attempts</Translate>,
        dataIndex: 'totalAttempts',
        key: 'totalAttempts',
        align: 'center' as const,
      },
      {
        title: <Translate contentKey="quizAnalytics.lastAttempt">Last Attempt</Translate>,
        dataIndex: 'lastAttempt',
        key: 'lastAttempt',
        render: (date: string) => (date ? dayjs(date).format('MMM DD, YYYY') : 'N/A'),
      },
    ];

    const strugglingStudentsColumns = [
      ...topPerformersColumns.slice(0, -1),
      {
        title: <Translate contentKey="quizAnalytics.needsHelp">Needs Help</Translate>,
        key: 'needsHelp',
        render: (record: StudentPerformance) => <Tag color="red">{record.averageScore < 50 ? 'High Priority' : 'Medium Priority'}</Tag>,
      },
      topPerformersColumns[topPerformersColumns.length - 1],
    ];

    return (
      <div>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <TrophyOutlined style={{ color: '#faad14' }} />
                  <Translate contentKey="quizAnalytics.topPerformers">Top Performers</Translate>
                </Space>
              }
            >
              <Table
                columns={topPerformersColumns}
                dataSource={analytics?.topPerformers || []}
                rowKey="studentId"
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <AlertOutlined style={{ color: '#ff4d4f' }} />
                  <Translate contentKey="quizAnalytics.strugglingStudents">Struggling Students</Translate>
                </Space>
              }
            >
              <Table
                columns={strugglingStudentsColumns}
                dataSource={analytics?.strugglingStudents || []}
                rowKey="studentId"
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  const renderQuestionAnalysisTab = () => {
    const questionColumns = [
      {
        title: <Translate contentKey="quizAnalytics.questionContent">Question</Translate>,
        dataIndex: 'questionContent',
        key: 'questionContent',
        width: '35%',
        render: (text: string) => (
          <Tooltip title={text}>
            <div
              style={{
                maxWidth: '300px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {text}
            </div>
          </Tooltip>
        ),
      },
      {
        title: <Translate contentKey="quizAnalytics.questionType">Type</Translate>,
        dataIndex: 'questionType',
        key: 'questionType',
        width: '10%',
        render: (type: string) => <Tag>{type}</Tag>,
      },
      {
        title: <Translate contentKey="quizAnalytics.correctPercentage">Correct %</Translate>,
        dataIndex: 'correctPercentage',
        key: 'correctPercentage',
        width: '20%',
        render: (percentage: number) => (
          <div>
            <Progress
              percent={percentage}
              size="small"
              status={percentage < 50 ? 'exception' : percentage < 70 ? 'active' : 'success'}
              strokeColor={percentage < 50 ? '#ff4d4f' : percentage < 70 ? '#faad14' : '#52c41a'}
            />
            <Text style={{ fontSize: '12px', fontWeight: 'bold' }}>{percentage.toFixed(1)}%</Text>
          </div>
        ),
        sorter: (a: QuestionAnalytics, b: QuestionAnalytics) => a.correctPercentage - b.correctPercentage,
      },
      {
        title: <Translate contentKey="quizAnalytics.totalAnswers">Total Answers</Translate>,
        dataIndex: 'totalAnswers',
        key: 'totalAnswers',
        width: '10%',
        align: 'center' as const,
      },
      {
        title: <Translate contentKey="quizAnalytics.correctAnswers">Correct Answers</Translate>,
        dataIndex: 'correctAnswers',
        key: 'correctAnswers',
        width: '10%',
        align: 'center' as const,
        render: (correct: number, record: QuestionAnalytics) => (
          <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
            {correct}/{record.totalAnswers}
          </span>
        ),
      },
      {
        title: <Translate contentKey="quizAnalytics.difficulty">Difficulty</Translate>,
        key: 'difficulty',
        width: '15%',
        render(record: QuestionAnalytics) {
          const difficulty = record.correctPercentage > 80 ? 'Easy' : record.correctPercentage > 50 ? 'Medium' : 'Hard';
          const color = difficulty === 'Easy' ? 'green' : difficulty === 'Medium' ? 'orange' : 'red';
          return <Tag color={color}>{difficulty}</Tag>;
        },
        filters: [
          { text: 'Easy', value: 'Easy' },
          { text: 'Medium', value: 'Medium' },
          { text: 'Hard', value: 'Hard' },
        ],
        onFilter(value: string, record: QuestionAnalytics) {
          const difficulty = record.correctPercentage > 80 ? 'Easy' : record.correctPercentage > 50 ? 'Medium' : 'Hard';
          return difficulty === value;
        },
      },
    ];

    // Calculate question difficulty distribution
    const getDifficultyDistribution = () => {
      if (!analytics?.questionAnalytics) return [];

      const distribution = { Easy: 0, Medium: 0, Hard: 0 };
      analytics.questionAnalytics.forEach(q => {
        const difficulty = q.correctPercentage > 80 ? 'Easy' : q.correctPercentage > 50 ? 'Medium' : 'Hard';
        distribution[difficulty]++;
      });

      return Object.entries(distribution).map(([difficulty, count]) => ({
        difficulty,
        count,
        percentage: ((count / analytics.questionAnalytics.length) * 100).toFixed(1),
      }));
    };

    return (
      <div>
        {/* Question Difficulty Overview */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={12}>
            <Card title={<Translate contentKey="quizAnalytics.questionDifficultyDistribution">Question Difficulty Distribution</Translate>}>
              {analytics?.questionAnalytics && analytics.questionAnalytics.length > 0 ? (
                <Pie
                  data={getDifficultyDistribution()}
                  angleField="count"
                  colorField="difficulty"
                  radius={0.8}
                  height={250}
                  color={['#52c41a', '#faad14', '#ff4d4f']}
                  label={{
                    type: 'outer',
                    content: '{name}: {percentage}%',
                  }}
                  legend={{
                    position: 'bottom',
                  }}
                />
              ) : (
                <Empty description="No data available" />
              )}
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title={<Translate contentKey="quizAnalytics.questionPerformanceOverview">Question Performance Overview</Translate>}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                      {analytics?.questionAnalytics ? analytics.questionAnalytics.filter(q => q.correctPercentage > 80).length : 0}
                    </div>
                    <div style={{ color: '#666' }}>Easy Questions</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>&gt;80% correct</div>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                      {analytics?.questionAnalytics
                        ? analytics.questionAnalytics.filter(q => q.correctPercentage > 50 && q.correctPercentage <= 80).length
                        : 0}
                    </div>
                    <div style={{ color: '#666' }}>Medium Questions</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>50-80% correct</div>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                      {analytics?.questionAnalytics ? analytics.questionAnalytics.filter(q => q.correctPercentage <= 50).length : 0}
                    </div>
                    <div style={{ color: '#666' }}>Hard Questions</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>&le;50% correct</div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Detailed Question Analysis Table */}
        <Card title={<Translate contentKey="quizAnalytics.detailedQuestionAnalysis">Detailed Question Analysis</Translate>}>
          {analytics?.questionAnalytics && analytics.questionAnalytics.length > 0 ? (
            <Table
              columns={questionColumns}
              dataSource={analytics.questionAnalytics}
              rowKey="questionId"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} questions`,
              }}
              scroll={{ x: 800 }}
              expandable={{
                expandedRowRender: (record: QuestionAnalytics) => (
                  <div style={{ padding: '16px', backgroundColor: '#fafafa' }}>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={12}>
                        <div>
                          <strong>Average Time Spent:</strong> {record.averageTimeSpent ? `${record.averageTimeSpent.toFixed(1)}s` : 'N/A'}
                        </div>
                        {record.commonWrongAnswers && record.commonWrongAnswers.length > 0 && (
                          <div style={{ marginTop: '8px' }}>
                            <strong>Common Wrong Answers:</strong>
                            <div style={{ marginTop: '4px' }}>
                              {record.commonWrongAnswers.map((answer, index) => (
                                <Tag key={index} color="red" style={{ marginBottom: '4px' }}>
                                  {answer}
                                </Tag>
                              ))}
                            </div>
                          </div>
                        )}
                      </Col>
                      <Col xs={24} md={12}>
                        {record.answerDistribution && Object.keys(record.answerDistribution).length > 0 && (
                          <div>
                            <strong>Answer Distribution:</strong>
                            <div style={{ marginTop: '8px' }}>
                              {Object.entries(record.answerDistribution).map(([answer, count]) => (
                                <div key={answer} style={{ marginBottom: '4px' }}>
                                  <span style={{ marginRight: '8px' }}>{answer}:</span>
                                  <Tag color="blue">{count} responses</Tag>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </Col>
                    </Row>
                  </div>
                ),
                rowExpandable: (record: QuestionAnalytics) =>
                  (record.commonWrongAnswers && record.commonWrongAnswers.length > 0) ||
                  (record.answerDistribution && Object.keys(record.answerDistribution).length > 0),
              }}
            />
          ) : (
            <Empty
              description={
                <span>
                  <Translate contentKey="quizAnalytics.noQuestionData">
                    No question-level analytics available. This feature requires detailed answer tracking.
                  </Translate>
                </span>
              }
            />
          )}
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Translate contentKey="quizAnalytics.loading">Loading analytics...</Translate>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Empty description={<Translate contentKey="quizAnalytics.noData">No analytics data available</Translate>} />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/quiz-management')}>
              <Translate contentKey="entity.action.back">Back</Translate>
            </Button>
            <div>
              <Title level={3} style={{ margin: 0 }}>
                <Translate contentKey="quizAnalytics.title">Quiz Analytics</Translate>
              </Title>
              <Text type="secondary">{analytics.quizTitle}</Text>
            </div>
          </div>
          <Space>
            <RangePicker
              value={timeRange}
              onChange={setTimeRange}
              placeholder={[translate('quizAnalytics.startDate'), translate('quizAnalytics.endDate')]}
            />
            <Dropdown overlay={exportMenu} trigger={['click']} disabled={exporting}>
              <Button type="primary" loading={exporting}>
                <DownloadOutlined />
                <Translate contentKey="quizAnalytics.export">Export</Translate>
                <DownOutlined />
              </Button>
            </Dropdown>
          </Space>
        </div>
        <Divider />
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={
            <span>
              <BarChartOutlined />
              <Translate contentKey="quizAnalytics.overview">Overview</Translate>
            </span>
          }
          key="overview"
        >
          {renderOverviewTab()}
        </TabPane>
        <TabPane
          tab={
            <span>
              <UserOutlined />
              <Translate contentKey="quizAnalytics.studentPerformance">Student Performance</Translate>
            </span>
          }
          key="students"
        >
          {renderStudentPerformanceTab()}
        </TabPane>
        <TabPane
          tab={
            <span>
              <FileTextOutlined />
              <Translate contentKey="quizAnalytics.questionAnalysis">Question Analysis</Translate>
            </span>
          }
          key="questions"
        >
          {renderQuestionAnalysisTab()}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default QuizAnalyticsDashboard;
