import React from 'react';
import { Translate } from 'react-jhipster';
import { Card, CardBody, CardHeader, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AssignedCourse } from '../teacher-dashboard.reducer';

interface CourseOverviewWidgetProps {
  courses?: AssignedCourse[];
  loading: boolean;
}

const CourseOverviewWidget: React.FC<CourseOverviewWidgetProps> = ({ courses, loading }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'draft':
        return 'warning';
      case 'completed':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  return (
    <Card className="h-100">
      <CardHeader>
        <FontAwesomeIcon icon="book" className="me-2" />
        <Translate contentKey="teacherDashboard.assignedCourses">Assigned Courses</Translate>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="text-center text-muted">
            <FontAwesomeIcon icon="spinner" spin /> <Translate contentKey="teacherDashboard.loading">Loading...</Translate>
          </div>
        ) : courses && courses.length > 0 ? (
          <div>
            {courses.map((course, index) => (
              <div key={course.id} className={`mb-3 ${index === courses.length - 1 ? '' : 'border-bottom pb-3'}`}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{course.title}</h6>
                    <small className="text-muted">{course.courseCode}</small>
                  </div>
                  <Badge color={getStatusColor(course.status)} size="sm">
                    {course.status}
                  </Badge>
                </div>
                <div className="row text-center">
                  <div className="col-4">
                    <div className="small text-muted">Students</div>
                    <div className="fw-bold text-primary">{course.enrollmentCount}</div>
                  </div>
                  <div className="col-4">
                    <div className="small text-muted">Lessons</div>
                    <div className="fw-bold text-info">{course.lessonsCount}</div>
                  </div>
                  <div className="col-4">
                    <div className="small text-muted">Progress</div>
                    <div className="fw-bold text-success">{Math.round((course.enrollmentCount / (course.enrollmentCount + 5)) * 100)}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted">
            <FontAwesomeIcon icon="book-open" className="mb-2" size="2x" />
            <div>
              <Translate contentKey="teacherDashboard.noCourses">No courses assigned</Translate>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default CourseOverviewWidget;
