import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { StudentProgressChart } from './student-progress-chart';

expect.extend(toHaveNoViolations);

const mockProgressData = [
  {
    studentId: '1',
    studentName: 'John Doe',
    courseProgress: [
      { courseId: 'c1', courseName: 'Basic Japanese', progress: 75, completedLessons: 15, totalLessons: 20 },
      { courseId: 'c2', courseName: 'Intermediate Japanese', progress: 45, completedLessons: 9, totalLessons: 20 },
    ],
    overallGPA: 3.8,
    completionRate: 60,
  },
  {
    studentId: '2',
    studentName: 'Jane Smith',
    courseProgress: [
      { courseId: 'c1', courseName: 'Basic Japanese', progress: 90, completedLessons: 18, totalLessons: 20 },
      { courseId: 'c2', courseName: 'Intermediate Japanese', progress: 70, completedLessons: 14, totalLessons: 20 },
    ],
    overallGPA: 4.0,
    completionRate: 80,
  },
];

// Mock recharts components
jest.mock('recharts', () => ({
  LineChart: ({ children, ...props }: any) => (
    <div data-testid="line-chart" {...props}>
      {children}
    </div>
  ),
  BarChart: ({ children, ...props }: any) => (
    <div data-testid="bar-chart" {...props}>
      {children}
    </div>
  ),
  PieChart: ({ children, ...props }: any) => (
    <div data-testid="pie-chart" {...props}>
      {children}
    </div>
  ),
  Line: (props: any) => <div data-testid="line" {...props} />,
  Bar: (props: any) => <div data-testid="bar" {...props} />,
  Pie: (props: any) => <div data-testid="pie" {...props} />,
  Cell: (props: any) => <div data-testid="cell" {...props} />,
  XAxis: (props: any) => <div data-testid="x-axis" {...props} />,
  YAxis: (props: any) => <div data-testid="y-axis" {...props} />,
  CartesianGrid: (props: any) => <div data-testid="cartesian-grid" {...props} />,
  Tooltip: (props: any) => <div data-testid="tooltip" {...props} />,
  Legend: (props: any) => <div data-testid="legend" {...props} />,
  ResponsiveContainer: ({ children, ...props }: any) => (
    <div data-testid="responsive-container" {...props}>
      {children}
    </div>
  ),
}));

describe('StudentProgressChart Component', () => {
  it('should render with default line chart', () => {
    render(<StudentProgressChart data={mockProgressData} timeRange="month" chartType="line" />);

    expect(screen.getByTestId('student-progress-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('should render bar chart when chartType is bar', () => {
    render(<StudentProgressChart data={mockProgressData} timeRange="month" chartType="bar" />);

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar')).toBeInTheDocument();
  });

  it('should render pie chart when chartType is pie', () => {
    render(<StudentProgressChart data={mockProgressData} timeRange="month" chartType="pie" />);

    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();
  });

  it('should display chart controls', () => {
    render(<StudentProgressChart data={mockProgressData} timeRange="month" chartType="line" />);

    expect(screen.getByTestId('chart-controls')).toBeInTheDocument();
    expect(screen.getByTestId('chart-type-selector')).toBeInTheDocument();
    expect(screen.getByTestId('time-range-selector')).toBeInTheDocument();
  });

  it('should handle chart type changes', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<StudentProgressChart data={mockProgressData} timeRange="month" chartType="line" />);

    expect(screen.getByTestId('line-chart')).toBeInTheDocument();

    const chartTypeSelector = screen.getByTestId('chart-type-selector');
    await user.selectOptions(chartTypeSelector, 'bar');

    rerender(<StudentProgressChart data={mockProgressData} timeRange="month" chartType="bar" />);

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('should handle time range changes', async () => {
    const user = userEvent.setup();
    render(<StudentProgressChart data={mockProgressData} timeRange="month" chartType="line" />);

    const timeRangeSelector = screen.getByTestId('time-range-selector');
    await user.selectOptions(timeRangeSelector, 'week');

    expect(timeRangeSelector).toHaveValue('week');
  });

  it('should display student names in legend', () => {
    render(<StudentProgressChart data={mockProgressData} timeRange="month" chartType="line" />);

    expect(screen.getByTestId('legend')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should show progress statistics', () => {
    render(<StudentProgressChart data={mockProgressData} timeRange="month" chartType="line" />);

    expect(screen.getByTestId('progress-stats')).toBeInTheDocument();
    expect(screen.getByText('Average GPA: 3.9')).toBeInTheDocument();
    expect(screen.getByText('Average Completion: 70%')).toBeInTheDocument();
  });

  it('should handle empty data gracefully', () => {
    render(<StudentProgressChart data={[]} timeRange="month" chartType="line" />);

    expect(screen.getByTestId('empty-chart-state')).toBeInTheDocument();
    expect(screen.getByText(/no progress data available/i)).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<StudentProgressChart data={mockProgressData} timeRange="month" chartType="line" loading={true} />);

    expect(screen.getByTestId('chart-loading')).toBeInTheDocument();
    expect(screen.getByTestId('chart-skeleton')).toBeInTheDocument();
  });

  it('should handle drill-down functionality', async () => {
    const onDrillDown = jest.fn();
    const user = userEvent.setup();

    render(<StudentProgressChart data={mockProgressData} timeRange="month" chartType="line" onDrillDown={onDrillDown} />);

    const drillDownButton = screen.getByTestId('drill-down-john-doe');
    await user.click(drillDownButton);

    expect(onDrillDown).toHaveBeenCalledWith('1', 'John Doe');
  });

  it('should export chart data', async () => {
    const user = userEvent.setup();

    render(<StudentProgressChart data={mockProgressData} timeRange="month" chartType="line" exportable={true} />);

    const exportButton = screen.getByTestId('export-chart-button');
    await user.click(exportButton);

    expect(screen.getByTestId('export-modal')).toBeInTheDocument();
  });

  it('should be responsive', () => {
    render(<StudentProgressChart data={mockProgressData} timeRange="month" chartType="line" />);

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('should handle custom colors', () => {
    const customColors = ['#FF6B6B', '#4ECDC4', '#45B7D1'];

    render(<StudentProgressChart data={mockProgressData} timeRange="month" chartType="line" colors={customColors} />);

    const chart = screen.getByTestId('line-chart');
    expect(chart).toHaveAttribute('data-colors', JSON.stringify(customColors));
  });

  it('should show tooltip on hover', async () => {
    const user = userEvent.setup();

    render(<StudentProgressChart data={mockProgressData} timeRange="month" chartType="line" />);

    const chartArea = screen.getByTestId('line-chart');
    await user.hover(chartArea);

    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('should be accessible', async () => {
    const { container } = render(
      <StudentProgressChart data={mockProgressData} timeRange="month" chartType="line" aria-label="Student progress visualization" />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes', () => {
    render(<StudentProgressChart data={mockProgressData} timeRange="month" chartType="line" />);

    const chart = screen.getByTestId('student-progress-chart');
    expect(chart).toHaveAttribute('role', 'img');
    expect(chart).toHaveAttribute('aria-label');
  });

  it('should support keyboard navigation for controls', async () => {
    const user = userEvent.setup();

    render(<StudentProgressChart data={mockProgressData} timeRange="month" chartType="line" />);

    const chartTypeSelector = screen.getByTestId('chart-type-selector');
    chartTypeSelector.focus();

    await user.keyboard('{ArrowDown}');
    expect(chartTypeSelector).toHaveFocus();

    await user.keyboard('{Tab}');
    expect(screen.getByTestId('time-range-selector')).toHaveFocus();
  });

  it('should match snapshot', () => {
    const { container } = render(
      <div>
        <StudentProgressChart data={mockProgressData} timeRange="month" chartType="line" />
        <StudentProgressChart data={mockProgressData} timeRange="week" chartType="bar" />
        <StudentProgressChart data={[]} timeRange="month" chartType="pie" />
      </div>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
