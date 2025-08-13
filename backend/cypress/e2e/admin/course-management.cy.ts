describe('Admin Course Management E2E Tests', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/admin/courses');
  });

  describe('Course Management Workflow', () => {
    it('should complete full course creation and management workflow', () => {
      // Measure page load performance
      cy.measurePageLoad('Course Management');

      // Verify page loads correctly
      cy.getBySel('course-management-grid').should('be.visible');
      cy.waitForTableToLoad('course-management-grid');

      // Test course creation with lessons
      const newCourse = {
        title: `E2E Test Course ${Date.now()}`,
        description: 'This is a test course created by E2E tests',
        courseCode: `E2E-${Date.now()}`,
        lessons: [
          {
            title: 'Introduction Lesson',
            content: 'This is the introduction lesson content',
            videoUrl: 'https://example.com/intro-video.mp4',
          },
          {
            title: 'Advanced Lesson',
            content: 'This is the advanced lesson content',
            videoUrl: 'https://example.com/advanced-video.mp4',
          },
        ],
      };

      cy.createTestCourse(newCourse);

      // Verify course was created
      cy.getBySel('course-management-grid').should('contain', newCourse.title);
      cy.getBySel('course-management-grid').should('contain', newCourse.courseCode);

      // Test course editing
      cy.getBySelLike('edit-course-button').first().click();
      cy.getBySel('course-edit-modal').should('be.visible');

      const updatedTitle = 'Updated E2E Test Course';
      cy.getBySel('course-title-input').clear().type(updatedTitle);

      // Add another lesson
      cy.getBySel('add-lesson-button').click();
      cy.getBySel('lesson-title-input-2').type('Final Lesson');
      cy.getBySel('lesson-content-input-2').type('Final lesson content');

      cy.getBySel('save-course-button').click();
      cy.getBySel('course-edit-modal').should('not.exist');

      // Verify course was updated
      cy.getBySel('course-management-grid').should('contain', updatedTitle);

      // Test lesson content editor
      cy.getBySelLike('edit-lesson-button').first().click();
      cy.getBySel('lesson-content-editor').should('be.visible');

      // Test rich text editing
      cy.getBySel('rich-text-editor').type('Updated lesson content with {bold}bold text{/bold}');

      // Test file upload for lesson materials
      cy.uploadFile('lesson-video-upload', 'test-video.mp4', 'video/mp4');
      cy.getBySel('upload-progress').should('be.visible');
      cy.getBySel('upload-success').should('be.visible');

      cy.uploadFile('lesson-slides-upload', 'test-slides.pdf', 'application/pdf');
      cy.getBySel('upload-success').should('be.visible');

      cy.getBySel('save-lesson-button').click();
      cy.getBySel('lesson-content-editor').should('not.exist');

      // Test course assignment to teachers
      cy.getBySelLike('assign-course-button').first().click();
      cy.getBySel('course-assignment-modal').should('be.visible');

      cy.getBySel('teacher-select').select('teacher-123');
      cy.getBySel('start-date-input').type('2024-02-01');
      cy.getBySel('end-date-input').type('2024-06-30');

      // Test conflict detection
      cy.getBySel('check-conflicts-button').click();
      cy.getBySel('conflict-check-results').should('be.visible');

      cy.getBySel('save-assignment-button').click();
      cy.getBySel('assignment-success-message').should('be.visible');

      // Test course scheduling
      cy.getBySelLike('schedule-course-button').first().click();
      cy.getBySel('schedule-modal').should('be.visible');

      cy.getBySel('day-select').select('MONDAY');
      cy.getBySel('start-time-input').type('09:00');
      cy.getBySel('end-time-input').type('10:30');
      cy.getBySel('room-input').type('Room A101');

      cy.getBySel('save-schedule-button').click();
      cy.getBySel('schedule-success-message').should('be.visible');

      // Check accessibility
      cy.checkAccessibility();
    });

    it('should handle course analytics and reporting', () => {
      // Navigate to course analytics
      cy.getBySelLike('view-analytics-button').first().click();
      cy.getBySel('course-analytics-dashboard').should('be.visible');

      // Verify analytics widgets load
      cy.getBySel('enrollment-chart').should('be.visible');
      cy.getBySel('completion-rate-chart').should('be.visible');
      cy.getBySel('student-progress-chart').should('be.visible');

      // Test date range filtering
      cy.getBySel('date-range-picker').click();
      cy.getBySel('last-30-days-option').click();
      cy.getBySel('apply-date-filter').click();

      // Wait for charts to update
      cy.getBySel('loading-overlay').should('not.exist');
      cy.getBySel('enrollment-chart').should('be.visible');

      // Test export functionality
      cy.getBySel('export-analytics-button').click();
      cy.getBySel('export-format-select').select('pdf');
      cy.getBySel('confirm-export-button').click();

      cy.getBySel('export-success-message').should('be.visible');

      // Test drill-down functionality
      cy.getBySel('enrollment-chart').find('.chart-bar').first().click();
      cy.getBySel('drill-down-modal').should('be.visible');
      cy.getBySel('student-details-table').should('be.visible');
    });

    it('should handle bulk course operations', () => {
      // Select multiple courses
      cy.selectTableRows([0, 1, 2]);
      cy.getBySel('bulk-actions-toolbar').should('be.visible');

      // Test bulk status change
      cy.getBySel('bulk-status-button').click();
      cy.getBySel('status-select').select('ACTIVE');
      cy.getBySel('confirm-bulk-status-button').click();

      cy.getBySel('bulk-success-message').should('be.visible');

      // Test bulk assignment
      cy.selectTableRows([0, 1]);
      cy.getBySel('bulk-assign-button').click();
      cy.getBySel('bulk-assignment-modal').should('be.visible');

      cy.getBySel('teacher-multi-select').select(['teacher-1', 'teacher-2']);
      cy.getBySel('confirm-bulk-assignment-button').click();

      cy.getBySel('bulk-assignment-success').should('be.visible');

      // Test bulk export
      cy.selectTableRows([0, 1, 2]);
      cy.getBySel('bulk-export-button').click();
      cy.getBySel('export-format-select').select('xlsx');
      cy.getBySel('include-lessons-checkbox').check();
      cy.getBySel('confirm-bulk-export-button').click();

      cy.getBySel('export-progress').should('be.visible');
      cy.getBySel('export-complete-message').should('be.visible');
    });
  });

  describe('Advanced Course Features', () => {
    it('should handle course templates and duplication', () => {
      // Test course template creation
      cy.getBySelLike('create-template-button').first().click();
      cy.getBySel('template-creation-modal').should('be.visible');

      cy.getBySel('template-name-input').type('Japanese Beginner Template');
      cy.getBySel('template-description-input').type('Template for beginner Japanese courses');
      cy.getBySel('include-lessons-checkbox').check();
      cy.getBySel('include-assessments-checkbox').check();

      cy.getBySel('save-template-button').click();
      cy.getBySel('template-success-message').should('be.visible');

      // Test course duplication
      cy.getBySelLike('duplicate-course-button').first().click();
      cy.getBySel('duplicate-course-modal').should('be.visible');

      cy.getBySel('new-course-title-input').type('Duplicated Course');
      cy.getBySel('new-course-code-input').type('DUP-001');
      cy.getBySel('include-students-checkbox').uncheck();
      cy.getBySel('reset-progress-checkbox').check();

      cy.getBySel('confirm-duplicate-button').click();
      cy.getBySel('duplication-progress').should('be.visible');
      cy.getBySel('duplication-success').should('be.visible');

      // Verify duplicated course appears
      cy.getBySel('course-management-grid').should('contain', 'Duplicated Course');
    });

    it('should handle course prerequisites and dependencies', () => {
      // Open course prerequisites modal
      cy.getBySelLike('manage-prerequisites-button').first().click();
      cy.getBySel('prerequisites-modal').should('be.visible');

      // Add prerequisite courses
      cy.getBySel('add-prerequisite-button').click();
      cy.getBySel('prerequisite-course-select').select('basic-japanese-001');
      cy.getBySel('minimum-grade-input').type('70');
      cy.getBySel('save-prerequisite-button').click();

      // Add skill prerequisites
      cy.getBySel('add-skill-prerequisite-button').click();
      cy.getBySel('skill-select').select('hiragana-reading');
      cy.getBySel('proficiency-level-select').select('intermediate');
      cy.getBySel('save-skill-prerequisite-button').click();

      cy.getBySel('save-prerequisites-button').click();
      cy.getBySel('prerequisites-success-message').should('be.visible');

      // Test prerequisite validation
      cy.getBySel('validate-prerequisites-button').click();
      cy.getBySel('validation-results').should('be.visible');
      cy.getBySel('students-without-prerequisites').should('be.visible');
    });

    it('should handle course collaboration features', () => {
      // Test co-teacher assignment
      cy.getBySelLike('manage-teachers-button').first().click();
      cy.getBySel('teachers-management-modal').should('be.visible');

      cy.getBySel('add-co-teacher-button').click();
      cy.getBySel('teacher-search-input').type('jane.teacher');
      cy.getBySel('teacher-search-results').should('be.visible');
      cy.getBySelLike('select-teacher-button').first().click();

      // Set permissions for co-teacher
      cy.getBySel('permission-edit-content').check();
      cy.getBySel('permission-grade-assignments').check();
      cy.getBySel('permission-manage-students').uncheck();

      cy.getBySel('save-co-teacher-button').click();
      cy.getBySel('co-teacher-success-message').should('be.visible');

      // Test teacher communication tools
      cy.getBySel('teacher-chat-button').click();
      cy.getBySel('teacher-chat-panel').should('be.visible');

      cy.getBySel('chat-message-input').type("Let's discuss the lesson plan for next week");
      cy.getBySel('send-message-button').click();

      cy.getBySel('chat-messages').should('contain', "Let's discuss the lesson plan");

      // Test shared resource management
      cy.getBySel('shared-resources-tab').click();
      cy.getBySel('upload-shared-resource-button').click();
      cy.uploadFile('resource-file-input', 'shared-document.pdf', 'application/pdf');

      cy.getBySel('resource-title-input').type('Shared Teaching Materials');
      cy.getBySel('resource-description-input').type('Materials for collaborative teaching');
      cy.getBySel('save-shared-resource-button').click();

      cy.getBySel('shared-resources-list').should('contain', 'Shared Teaching Materials');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle course creation errors gracefully', () => {
      // Test duplicate course code error
      cy.getBySel('create-course-button').click();
      cy.getBySel('course-title-input').type('Test Course');
      cy.getBySel('course-code-input').type('EXISTING-001'); // Existing course code
      cy.getBySel('course-description-input').type('Test description');

      cy.intercept('POST', '/api/courses/manage', {
        statusCode: 400,
        body: { message: 'Course code already exists' },
      }).as('duplicateCourseCode');

      cy.getBySel('save-course-button').click();
      cy.wait('@duplicateCourseCode');

      cy.getBySel('course-code-error').should('contain', 'Course code already exists');

      // Test file upload size limit error
      cy.getBySel('add-lesson-button').click();
      cy.getBySel('lesson-title-input-0').type('Test Lesson');

      cy.intercept('POST', '/api/files/upload', {
        statusCode: 413,
        body: { message: 'File too large' },
      }).as('fileTooLarge');

      cy.uploadFile('lesson-video-upload', 'large-video.mp4', 'video/mp4');
      cy.wait('@fileTooLarge');

      cy.getBySel('upload-error').should('contain', 'File too large');
    });

    it('should handle network connectivity issues', () => {
      // Simulate network disconnection
      cy.intercept('GET', '/api/courses/manage*', { forceNetworkError: true }).as('networkError');
      cy.reload();

      cy.getBySel('network-error-message').should('be.visible');
      cy.getBySel('offline-indicator').should('be.visible');

      // Test offline functionality
      cy.getBySel('cached-courses-message').should('be.visible');
      cy.getBySel('course-management-grid').should('be.visible'); // Should show cached data

      // Test reconnection
      cy.intercept('GET', '/api/courses/manage*', { fixture: 'courses.json' }).as('reconnected');
      cy.getBySel('retry-connection-button').click();

      cy.wait('@reconnected');
      cy.getBySel('online-indicator').should('be.visible');
      cy.getBySel('sync-success-message').should('be.visible');
    });

    it('should handle concurrent editing conflicts', () => {
      // Simulate concurrent editing scenario
      cy.getBySelLike('edit-course-button').first().click();
      cy.getBySel('course-edit-modal').should('be.visible');

      // Simulate another user editing the same course
      cy.window().then(win => {
        win.dispatchEvent(
          new CustomEvent('course-locked', {
            detail: {
              courseId: 'course-123',
              lockedBy: 'another.user@example.com',
              lockTime: new Date().toISOString(),
            },
          }),
        );
      });

      cy.getBySel('concurrent-edit-warning').should('be.visible');
      cy.getBySel('concurrent-edit-warning').should('contain', 'another.user@example.com');

      // Test conflict resolution options
      cy.getBySel('force-edit-button').should('be.visible');
      cy.getBySel('view-changes-button').should('be.visible');
      cy.getBySel('cancel-edit-button').should('be.visible');

      // Test viewing changes
      cy.getBySel('view-changes-button').click();
      cy.getBySel('changes-comparison-modal').should('be.visible');
      cy.getBySel('changes-diff-viewer').should('be.visible');
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle large course catalogs efficiently', () => {
      // Mock large dataset
      cy.intercept('GET', '/api/courses/manage*', { fixture: 'large-course-catalog.json' }).as('largeCatalog');
      cy.reload();

      cy.wait('@largeCatalog');
      cy.measurePageLoad('Large Course Catalog');

      // Test virtual scrolling performance
      cy.getBySel('course-grid-container').should('be.visible');
      cy.getBySel('virtual-scroll-indicator').should('be.visible');

      // Test search performance with large dataset
      const startTime = Date.now();
      cy.searchInTable('Advanced');
      cy.waitForTableToLoad('course-management-grid');

      cy.then(() => {
        const searchTime = Date.now() - startTime;
        expect(searchTime).to.be.lessThan(1500);
      });

      // Test filtering performance
      cy.getBySel('status-filter').select('ACTIVE');
      cy.getBySel('category-filter').select('LANGUAGE');
      cy.waitForTableToLoad('course-management-grid');

      // Test lazy loading of course details
      cy.getBySelLike('course-card').first().click();
      cy.getBySel('course-details-loading').should('be.visible');
      cy.getBySel('course-details-panel').should('be.visible');
    });
  });
});
