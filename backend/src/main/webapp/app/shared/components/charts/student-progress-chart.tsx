import React, { useState, useMemo } from 'react';
import { Card, Select, DatePicker, Row, Col, Spin, Empty } from 'antd';
import { Line, Column, Pie } from '@ant-design/plots';
import dayjs from 'dayjs';
import { Translate } from 'react-jhipster';

const { Option } = Select;
const { RangePicker } = DatePicker;

export interface StudentProgressData {
  studentId: number;
  studentName: string;
  courseId: number;
  courseName: string;
  date: string;
  score: number;
  completionRate: number;
  timeSpent: number; // in minutes
  quizCount: number;
  lessonCount: number;
}

export interface CourseProgress {
  courseId: number;
  courseName: string;
  progress: number;
  averageScore: number;
  completedLessons: number;
  totalLessons: number;
}

export interface StudentProgressChartProps {
  data: StudentProgressData[];
  courseProgress?: CourseProgress[];
  loading?: boolean;
  onDrillDown?: (studentId: number, courseId?: number, dateRange?: [string, string]) => void;
  className?: string;
}

export type ChartType = 'line' | 'bar' | 'pie';
export type TimeRange = '7d' | '30d' | '90d' | '1y' | 'custom';

const StudentProgressChart: React.FC<StudentProgressChartProps> = ({
  data,
  courseProgress = [],
  loading = false,
  onDrillDown,
  className,
}) => {
  const [chartType, setChartType] = useState<ChartType>('line');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [customDateRange, setCustomDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<number | undefined>(undefined);

  // Filter data based on time range and course selection
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Filter by course if selected
    if (selectedCourse) {
      filtered = filtered.filter(item => item.courseId === selectedCourse);
    }

    // Filter by time range
    const now = dayjs();
    let startDate: dayjs.Dayjs;

    switch (timeRange) {
      case '7d':
        startDate = now.subtract(7, 'day');
        break;
      case '30d':
        startDate = now.subtract(30, 'day');
        break;
      case '90d':
        startDate = now.subtract(90, 'day');
        break;
      case '1y':
        startDate = now.subtract(1, 'year');
        break;
      case 'custom':
        if (customDateRange) {
          startDate = customDateRange[0];
          const endDate = customDateRange[1];
          filtered = filtered.filter(item => {
            const itemDate = dayjs(item.date);
            return itemDate.isAfter(startDate) && itemDate.isBefore(endDate);
          });
          return filtered;
        }
        return filtered;
      default:
        startDate = now.subtract(30, 'day');
    }

    return filtered.filter(item => dayjs(item.date).isAfter(startDate));
  }, [data, timeRange, customDateRange, selectedCourse]);

  // Prepare data for different chart types
  const chartData = useMemo(() => {
    switch (chartType) {
      case 'line':
        return filteredData.map(item => ({
          date: item.date,
          score: item.score,
          completionRate: item.completionRate,
          student: item.studentName,
          course: item.courseName,
          studentId: item.studentId,
          courseId: item.courseId,
        }));

      case 'bar': {
        // Aggregate by student
        const studentAggregates = filteredData.reduce(
          (acc, item) => {
            const key = `${item.studentId}-${item.studentName}`;
            if (!acc[key]) {
              acc[key] = {
                student: item.studentName,
                studentId: item.studentId,
                totalScore: 0,
                totalCompletion: 0,
                count: 0,
              };
            }
            acc[key].totalScore += item.score;
            acc[key].totalCompletion += item.completionRate;
            acc[key].count += 1;
            return acc;
          },
          {} as Record<string, any>,
        );

        return Object.values(studentAggregates).map((item: any) => ({
          student: item.student,
          studentId: item.studentId,
          averageScore: Math.round(item.totalScore / item.count),
          averageCompletion: Math.round(item.totalCompletion / item.count),
        }));
      }

      case 'pie': {
        // Course progress distribution
        if (courseProgress.length > 0) {
          return courseProgress.map(course => ({
            course: course.courseName,
            courseId: course.courseId,
            progress: course.progress,
            value: course.progress,
          }));
        }
        // Fallback to completion rate distribution
        const completionRanges = {
          'Excellent (90-100%)': 0,
          'Good (70-89%)': 0,
          'Average (50-69%)': 0,
          'Below Average (<50%)': 0,
        };

        filteredData.forEach(item => {
          if (item.completionRate >= 90) completionRanges['Excellent (90-100%)']++;
          else if (item.completionRate >= 70) completionRanges['Good (70-89%)']++;
          else if (item.completionRate >= 50) completionRanges['Average (50-69%)']++;
          else completionRanges['Below Average (<50%)']++;
        });

        return Object.entries(completionRanges).map(([range, count]) => ({
          range,
          count,
          value: count,
        }));
      }

      default:
        return [];
    }
  }, [filteredData, chartType, courseProgress]);

  // Get unique courses for filter dropdown
  const courses = useMemo(() => {
    const uniqueCourses = new Map();
    data.forEach(item => {
      uniqueCourses.set(item.courseId, item.courseName);
    });
    return Array.from(uniqueCourses.entries()).map(([id, name]) => ({ id, name }));
  }, [data]);

  const handleChartClick = (event: any) => {
    if (onDrillDown && event.data) {
      const { studentId, courseId } = event.data;
      const dateRange = customDateRange
        ? ([customDateRange[0].format('YYYY-MM-DD'), customDateRange[1].format('YYYY-MM-DD')] as [string, string])
        : undefined;
      onDrillDown(studentId, courseId, dateRange);
    }
  };

  const renderChart = () => {
    if (chartData.length === 0) {
      return <Empty description={<Translate contentKey="studentProgress.noData">No data available</Translate>} />;
    }

    switch (chartType) {
      case 'line':
        return (
          <Line
            data={chartData}
            xField="date"
            yField="score"
            seriesField="student"
            smooth
            point={{ size: 5, shape: 'diamond' }}
            tooltip={{
              formatter: (datum: any) => ({
                name: datum.student,
                value: `Score: ${datum.score}%, Completion: ${datum.completionRate}%`,
              }),
            }}
            onReady={plot => {
              plot.on('point:click', handleChartClick);
            }}
            animation={{
              appear: {
                animation: 'path-in',
                duration: 1000,
              },
            }}
          />
        );

      case 'bar':
        return (
          <Column
            data={chartData}
            xField="student"
            yField="averageScore"
            tooltip={{
              formatter: (datum: any) => ({
                name: 'Average Performance',
                value: `Score: ${datum.averageScore}%, Completion: ${datum.averageCompletion}%`,
              }),
            }}
            onReady={plot => {
              plot.on('element:click', handleChartClick);
            }}
            columnStyle={{
              radius: [4, 4, 0, 0],
            }}
            animation={{
              appear: {
                animation: 'grow-in-y',
                duration: 1000,
              },
            }}
          />
        );

      case 'pie':
        return (
          <Pie
            data={chartData}
            angleField="value"
            colorField={chartData[0] && 'course' in chartData[0] ? 'course' : 'range'}
            radius={0.8}
            innerRadius={0.4}
            label={{
              type: 'outer',
              content: '{name}: {percentage}',
            }}
            tooltip={{
              formatter: (datum: any) => ({
                name: datum.course || datum.range,
                value: `${datum.value}${datum.course ? '%' : ' students'}`,
              }),
            }}
            onReady={plot => {
              plot.on('element:click', handleChartClick);
            }}
            animation={{
              appear: {
                animation: 'grow-in-x',
                duration: 1000,
              },
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card
      className={className}
      title={<Translate contentKey="studentProgress.chartTitle">Student Progress Analytics</Translate>}
      extra={
        <Row gutter={16}>
          <Col>
            <Select value={chartType} onChange={setChartType} style={{ width: 120 }}>
              <Option value="line">
                <Translate contentKey="studentProgress.chartType.line">Line Chart</Translate>
              </Option>
              <Option value="bar">
                <Translate contentKey="studentProgress.chartType.bar">Bar Chart</Translate>
              </Option>
              <Option value="pie">
                <Translate contentKey="studentProgress.chartType.pie">Pie Chart</Translate>
              </Option>
            </Select>
          </Col>
          <Col>
            <Select value={timeRange} onChange={setTimeRange} style={{ width: 120 }}>
              <Option value="7d">
                <Translate contentKey="studentProgress.timeRange.7d">Last 7 days</Translate>
              </Option>
              <Option value="30d">
                <Translate contentKey="studentProgress.timeRange.30d">Last 30 days</Translate>
              </Option>
              <Option value="90d">
                <Translate contentKey="studentProgress.timeRange.90d">Last 90 days</Translate>
              </Option>
              <Option value="1y">
                <Translate contentKey="studentProgress.timeRange.1y">Last year</Translate>
              </Option>
              <Option value="custom">
                <Translate contentKey="studentProgress.timeRange.custom">Custom</Translate>
              </Option>
            </Select>
          </Col>
          {timeRange === 'custom' && (
            <Col>
              <RangePicker value={customDateRange} onChange={setCustomDateRange} format="YYYY-MM-DD" />
            </Col>
          )}
          {courses.length > 0 && (
            <Col>
              <Select
                value={selectedCourse}
                onChange={setSelectedCourse}
                placeholder={<Translate contentKey="studentProgress.filterByCourse">Filter by course</Translate>}
                style={{ width: 200 }}
                allowClear
              >
                {courses.map(course => (
                  <Option key={course.id} value={course.id}>
                    {course.name}
                  </Option>
                ))}
              </Select>
            </Col>
          )}
        </Row>
      }
    >
      <Spin spinning={loading}>
        <div style={{ height: 400 }}>{renderChart()}</div>
      </Spin>
    </Card>
  );
};

export default StudentProgressChart;
