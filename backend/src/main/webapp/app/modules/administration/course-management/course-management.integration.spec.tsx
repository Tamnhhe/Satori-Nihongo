import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CourseManagementGrid } from './course-management-grid';
import { renderWithProviders } from '../../../shared/util/test-utils';
import {
  createMockAxios,
  API_ENDPOINTS,
  generateMockCourses,
  mockPaginatedResponse,
  simulateServerError,
  validateApiRequest,
  MockAxiosType,
} from '../../../shared/util/api-test-utils';

describe('CourseManagement Integration Tests', () => {
  let mockAxios: MockAxiosType;

  beforeEach(() => {
    mockAxios = createMockAxios();
  });

  describe('Course API Integration', () => {
    it('should fetch courses on component mount', async () => {
      const mockCourses = generateMockCourses(3);
      mockAxios.onGet(API_ENDPOINTS.COURSES).reply(200, mockPaginatedResponse(mockCourses));

      renderWithProviders(
        <CourseManagementGrid
          courses={[]}
          onCourseCreate={jest.fn()}
          onCourseEdit={jest.fn()}
          onCourseDelete={jest.fn()}
          userRole="ADMIN"
        />,
      );

      await waitFor(() => {
        expect(screen.getByText(mockCourses[0].title)).toBeInTheDocument();
        expect(screen.getByText(mockCourses[1].title)).toBeInTheDocument();
      });

      expect(mockAxios.history.get).toHaveLength(1);
      expect(mockAxios.history.get[0].url).toContain(API_ENDPOINTS.COURSES);
    });

    it('should handle course creation with lessons', async () => {
      const newCourse = {
        title: 'Advanced Japanese',
        description: 'Advanced level Japanese course',
        courseCode: 'ADV001',
        lessons: [
          {
            title: 'Lesson 1',
            content: 'Introduction to advanced grammar',
            videoUrl: 'https://example.com/video1.mp4',
            slideUrl: 'https://example.com/slides1.pdf',
          },
        ],
      };

      mockAxios.onPost(API_ENDPOINTS.COURSES).reply(201, { id: 'new-course-id', ...newCourse });
      mockAxios.onPost(API_ENDPOINTS.LESSONS).reply(201, { id: 'new-lesson-id', ...newCourse.lessons[0] });

      const user = userEvent.setup();
      renderWithProviders(
        <CourseManagementGrid
          courses={[]}
          onCourseCreate={jest.fn()}
          onCourseEdit={jest.fn()}
          onCourseDelete={jest.fn()}
          userRole="ADMIN"
        />,
      );

      // Open create course modal
      const createButton = screen.getByTestId('create-course-button');
      await user.click(createButton);

      // Fill course details
      await user.type(screen.getByTestId('course-title-input'), newCourse.title);
      await user.type(screen.getByTestId('course-description-input'), newCourse.description);
      await user.type(screen.getByTestId('course-code-input'), newCourse.courseCode);

      // Add lesson
      const addLessonButton = screen.getByTestId('add-lesson-button');
      await user.click(addLessonButton);

      await user.type(screen.getByTestId('lesson-title-input'), newCourse.lessons[0].title);
      await user.type(screen.getByTestId('lesson-content-input'), newCourse.lessons[0].content);
      await user.type(screen.getByTestId('lesson-video-input'), newCourse.lessons[0].videoUrl);
      await user.type(screen.getByTestId('lesson-slide-input'), newCourse.lessons[0].slideUrl);

      // Save course
      const saveButton = screen.getByTestId('save-course-button');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockAxios.history.post).toHaveLength(2); // Course + Lesson
      });

      // Verify course creation API call
      const courseRequest = mockAxios.history.post.find(req => req.url === API_ENDPOINTS.COURSES);
      expect(courseRequest).toBeDefined();
      validateApiRequest(
        courseRequest,
        expect.objectContaining({
          title: newCourse.title,
          description: newCourse.description,
          courseCode: newCourse.courseCode,
        }),
      );

      // Verify lesson creation API call
      const lessonRequest = mockAxios.history.post.find(req => req.url === API_ENDPOINTS.LESSONS);
      expect(lessonRequest).toBeDefined();
    });

    it('should handle course assignment to teachers', async () => {
      const mockCourses = generateMockCourses(1);
      const teacherId = 'teacher-123';
      const assignmentData = {
        courseId: mockCourses[0].id,
        teacherId,
        startDate: '2024-02-01',
        endDate: '2024-06-30',
      };

      mockAxios.onGet(API_ENDPOINTS.COURSES).reply(200, mockPaginatedResponse(mockCourses));
      mockAxios.onPost('/api/course-assignments').reply(201, assignmentData);

      const user = userEvent.setup();
      renderWithProviders(
        <CourseManagementGrid
          courses={mockCourses}
          onCourseCreate={jest.fn()}
          onCourseEdit={jest.fn()}
          onCourseDelete={jest.fn()}
          userRole="ADMIN"
        />,
      );

      // Wait for courses to load
      await waitFor(() => {
        expect(screen.getByText(mockCourses[0].title)).toBeInTheDocument();
      });

      // Open assignment modal
      const assignButton = screen.getByTestId('assign-course-button');
      await user.click(assignButton);

      // Select teacher and dates
      await user.selectOptions(screen.getByTestId('teacher-select'), teacherId);
      await user.type(screen.getByTestId('start-date-input'), '2024-02-01');
      await user.type(screen.getByTestId('end-date-input'), '2024-06-30');

      // Save assignment
      const saveAssignmentButton = screen.getByTestId('save-assignment-button');
      await user.click(saveAssignmentButton);

      await waitFor(() => {
        expect(mockAxios.history.post).toHaveLength(1);
      });

      validateApiRequest(mockAxios.history.post[0], assignmentData);
    });

    it('should handle course statistics fetching', async () => {
      const mockCourses = generateMockCourses(1);
      const courseStats = {
        enrollmentCount: 45,
        completionRate: 78,
        averageGrade: 3.8,
        activeStudents: 42,
      };

      mockAxios.onGet(API_ENDPOINTS.COURSES).reply(200, mockPaginatedResponse(mockCourses));
      mockAxios.onGet(`${API_ENDPOINTS.COURSES}/${mockCourses[0].id}/stats`).reply(200, courseStats);

      renderWithProviders(
        <CourseManagementGrid
          courses={mockCourses}
          onCourseCreate={jest.fn()}
          onCourseEdit={jest.fn()}
          onCourseDelete={jest.fn()}
          userRole="ADMIN"
        />,
      );

      // Wait for courses and stats to load
      await waitFor(() => {
        expect(screen.getByText('45 students')).toBeInTheDocument();
        expect(screen.getByText('78% completion')).toBeInTheDocument();
      });

      // Verify stats API call
      const statsCall = mockAxios.history.get.find(call => call.url?.includes('/stats'));
      expect(statsCall).toBeDefined();
    });

    it('should handle lesson content updates with media upload', async () => {
      const mockCourses = generateMockCourses(1);
      const lessonId = 'lesson-123';
      const updatedLesson = {
        id: lessonId,
        title: 'Updated Lesson',
        content: 'Updated content',
        videoUrl: 'https://example.com/new-video.mp4',
      };

      // Mock file upload
      const uploadResponse = {
        url: 'https://example.com/new-video.mp4',
        filename: 'new-video.mp4',
      };

      mockAxios.onGet(API_ENDPOINTS.COURSES).reply(200, mockPaginatedResponse(mockCourses));
      mockAxios.onPost(API_ENDPOINTS.FILE_UPLOAD).reply(200, uploadResponse);
      mockAxios.onPut(`${API_ENDPOINTS.LESSONS}/${lessonId}`).reply(200, updatedLesson);

      const user = userEvent.setup();
      renderWithProviders(
        <CourseManagementGrid
          courses={mockCourses}
          onCourseCreate={jest.fn()}
          onCourseEdit={jest.fn()}
          onCourseDelete={jest.fn()}
          userRole="ADMIN"
        />,
      );

      // Open lesson editor
      const editLessonButton = screen.getByTestId('edit-lesson-button');
      await user.click(editLessonButton);

      // Update lesson content
      const contentEditor = screen.getByTestId('lesson-content-editor');
      await user.clear(contentEditor);
      await user.type(contentEditor, 'Updated content');

      // Upload video file
      const fileInput = screen.getByTestId('video-upload-input');
      const videoFile = new File(['video content'], 'new-video.mp4', { type: 'video/mp4' });
      await user.upload(fileInput, videoFile);

      // Save lesson
      const saveLessonButton = screen.getByTestId('save-lesson-button');
      await user.click(saveLessonButton);

      await waitFor(() => {
        expect(mockAxios.history.post).toHaveLength(1); // File upload
        expect(mockAxios.history.put).toHaveLength(1); // Lesson update
      });

      // Verify file upload
      const uploadRequest = mockAxios.history.post[0];
      expect(uploadRequest.url).toBe(API_ENDPOINTS.FILE_UPLOAD);

      // Verify lesson update
      const lessonUpdateRequest = mockAxios.history.put[0];
      expect(lessonUpdateRequest.url).toBe(`${API_ENDPOINTS.LESSONS}/${lessonId}`);
    });

    it('should handle course scheduling with conflict detection', async () => {
      const mockCourses = generateMockCourses(1);
      const scheduleData = {
        courseId: mockCourses[0].id,
        teacherId: 'teacher-123',
        dayOfWeek: 'MONDAY',
        startTime: '09:00',
        endTime: '10:30',
        room: 'Room A101',
      };

      const conflictResponse = {
        hasConflict: true,
        conflicts: [
          {
            type: 'TEACHER_CONFLICT',
            message: 'Teacher has another class at this time',
            conflictingSchedule: {
              courseTitle: 'Basic Japanese',
              time: '09:00-10:30',
            },
          },
        ],
      };

      mockAxios.onGet(API_ENDPOINTS.COURSES).reply(200, mockPaginatedResponse(mockCourses));
      mockAxios.onPost('/api/schedules/check-conflicts').reply(200, conflictResponse);

      const user = userEvent.setup();
      renderWithProviders(
        <CourseManagementGrid
          courses={mockCourses}
          onCourseCreate={jest.fn()}
          onCourseEdit={jest.fn()}
          onCourseDelete={jest.fn()}
          userRole="ADMIN"
        />,
      );

      // Open schedule modal
      const scheduleButton = screen.getByTestId('schedule-course-button');
      await user.click(scheduleButton);

      // Fill schedule details
      await user.selectOptions(screen.getByTestId('teacher-select'), scheduleData.teacherId);
      await user.selectOptions(screen.getByTestId('day-select'), scheduleData.dayOfWeek);
      await user.type(screen.getByTestId('start-time-input'), scheduleData.startTime);
      await user.type(screen.getByTestId('end-time-input'), scheduleData.endTime);
      await user.type(screen.getByTestId('room-input'), scheduleData.room);

      // Check for conflicts
      const checkConflictsButton = screen.getByTestId('check-conflicts-button');
      await user.click(checkConflictsButton);

      await waitFor(() => {
        expect(screen.getByTestId('conflict-warning')).toBeInTheDocument();
        expect(screen.getByText('Teacher has another class at this time')).toBeInTheDocument();
      });

      // Verify conflict check API call
      const conflictCheckRequest = mockAxios.history.post.find(req => req.url === '/api/schedules/check-conflicts');
      expect(conflictCheckRequest).toBeDefined();
      validateApiRequest(conflictCheckRequest, scheduleData);
    });
  });

  describe('Error Handling', () => {
    it('should handle course creation validation errors', async () => {
      const validationErrors = {
        message: 'Validation failed',
        errors: {
          title: 'Course title is required',
          courseCode: 'Course code must be unique',
        },
      };

      mockAxios.onPost(API_ENDPOINTS.COURSES).reply(400, validationErrors);

      const user = userEvent.setup();
      renderWithProviders(
        <CourseManagementGrid
          courses={[]}
          onCourseCreate={jest.fn()}
          onCourseEdit={jest.fn()}
          onCourseDelete={jest.fn()}
          userRole="ADMIN"
        />,
      );

      // Try to create course with invalid data
      const createButton = screen.getByTestId('create-course-button');
      await user.click(createButton);

      const saveButton = screen.getByTestId('save-course-button');
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Course title is required')).toBeInTheDocument();
        expect(screen.getByText('Course code must be unique')).toBeInTheDocument();
      });
    });

    it('should handle file upload errors', async () => {
      mockAxios.onPost(API_ENDPOINTS.FILE_UPLOAD).reply(413, {
        message: 'File too large',
      });

      const user = userEvent.setup();
      renderWithProviders(
        <CourseManagementGrid
          courses={[]}
          onCourseCreate={jest.fn()}
          onCourseEdit={jest.fn()}
          onCourseDelete={jest.fn()}
          userRole="ADMIN"
        />,
      );

      // Open lesson editor
      const createButton = screen.getByTestId('create-course-button');
      await user.click(createButton);

      const addLessonButton = screen.getByTestId('add-lesson-button');
      await user.click(addLessonButton);

      // Try to upload large file
      const fileInput = screen.getByTestId('video-upload-input');
      const largeFile = new File(['large content'], 'large-video.mp4', { type: 'video/mp4' });
      await user.upload(fileInput, largeFile);

      await waitFor(() => {
        expect(screen.getByText('File too large')).toBeInTheDocument();
      });
    });

    it('should handle course deletion with dependencies', async () => {
      const mockCourses = generateMockCourses(1);
      const dependencyError = {
        message: 'Cannot delete course with active enrollments',
        details: {
          activeEnrollments: 25,
          activeClasses: 3,
        },
      };

      mockAxios.onGet(API_ENDPOINTS.COURSES).reply(200, mockPaginatedResponse(mockCourses));
      mockAxios.onDelete(`${API_ENDPOINTS.COURSES}/${mockCourses[0].id}`).reply(409, dependencyError);

      const user = userEvent.setup();
      renderWithProviders(
        <CourseManagementGrid
          courses={mockCourses}
          onCourseCreate={jest.fn()}
          onCourseEdit={jest.fn()}
          onCourseDelete={jest.fn()}
          userRole="ADMIN"
        />,
      );

      // Try to delete course
      const deleteButton = screen.getByTestId('delete-course-button');
      await user.click(deleteButton);

      const confirmButton = screen.getByTestId('confirm-delete-button');
      await user.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText('Cannot delete course with active enrollments')).toBeInTheDocument();
        expect(screen.getByText('25 active enrollments')).toBeInTheDocument();
      });
    });
  });

  describe('Performance Optimization', () => {
    it('should implement lazy loading for course content', async () => {
      const mockCourses = generateMockCourses(20);

      // Mock paginated response
      mockAxios.onGet(API_ENDPOINTS.COURSES).reply(config => {
        const params = new URLSearchParams(config.url?.split('?')[1]);
        const page = parseInt(params.get('page') || '0', 10);
        const size = parseInt(params.get('size') || '10', 10);

        const start = page * size;
        const end = start + size;
        const pageData = mockCourses.slice(start, end);

        return [200, mockPaginatedResponse(pageData, page, size, mockCourses.length)];
      });

      renderWithProviders(
        <CourseManagementGrid
          courses={[]}
          onCourseCreate={jest.fn()}
          onCourseEdit={jest.fn()}
          onCourseDelete={jest.fn()}
          userRole="ADMIN"
        />,
      );

      // Should only load first page initially
      await waitFor(() => {
        expect(screen.getAllByTestId(/course-card-/)).toHaveLength(10);
      });

      // Verify only one API call was made
      expect(mockAxios.history.get).toHaveLength(1);
    });

    it('should cache course data to reduce API calls', async () => {
      const mockCourses = generateMockCourses(3);
      mockAxios.onGet(API_ENDPOINTS.COURSES).reply(200, mockPaginatedResponse(mockCourses));

      const { rerender } = renderWithProviders(
        <CourseManagementGrid
          courses={[]}
          onCourseCreate={jest.fn()}
          onCourseEdit={jest.fn()}
          onCourseDelete={jest.fn()}
          userRole="ADMIN"
        />,
      );

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText(mockCourses[0].title)).toBeInTheDocument();
      });

      // Re-render component
      rerender(
        <CourseManagementGrid
          courses={mockCourses}
          onCourseCreate={jest.fn()}
          onCourseEdit={jest.fn()}
          onCourseDelete={jest.fn()}
          userRole="ADMIN"
        />,
      );

      // Should not make additional API calls due to caching
      expect(mockAxios.history.get).toHaveLength(1);
    });
  });
});
