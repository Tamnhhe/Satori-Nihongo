describe('Teacher Workflow E2E Tests', () => {
  beforeEach(() => {
    cy.loginAsTeacher();
    cy.visit('/teacher/dashboard');
  });

  describe('Teacher Dashboard and Navigation', () => {
    it('should display teacher dashboard with relevant information', () => {
      // Measure page load performance
      cy.measurePageLoad('Teacher Dashboard');

      // Verify dashboard components
      cy.getBySel('teacher-dashboard').should('be.visible');
      cy.getBySel('assigned-courses-widget').should('be.visible');
      cy.getBySel('active-classes-widget').should('be.visible');
      cy.getBySel('pending-quizzes-widget').should('be.visible');
      cy.getBySel('student-progress-widget').should('be.visible');

      // Test quick actions
      cy.getBySel('quick-actions-widget').should('be.visible');
      cy.getBySel('create-lesson-quick-action').should('be.visible');
      cy.getBySel('grade-assignments-quick-action').should('be.visible');
      cy.getBySel('view-analytics-quick-action').should('be.visible');

      // Test navigation to different sections
      cy.getBySel('sidebar-menu-courses').click();
      cy.url().should('include', '/teacher/courses');
      cy.getBySel('teacher-course-list').should('be.visible');

      cy.getBySel('sidebar-menu-classes').click();
      cy.url().should('include', '/teacher/classes');
      cy.getBySel('teacher-class-list').should('be.visible');

      cy.getBySel('sidebar-menu-quizzes').click();
      cy.url().should('include', '/teacher/quizzes');
      cy.getBySel('teacher-quiz-list').should('be.visible');

      // Check accessibility
      cy.checkAccessibility();
    });

    it('should handle teacher notifications and alerts', () => {
      // Test notification center
      cy.getBySel('notification-bell').click();
      cy.getBySel('notification-dropdown').should('be.visible');

      // Verify different notification types
      cy.getBySel('notification-list').should('contain', 'New student enrolled');
      cy.getBySel('notification-list').should('contain', 'Quiz submission received');
      cy.getBySel('notification-list').should('contain', 'Assignment due tomorrow');

      // Test notification actions
      cy.getBySelLike('notification-item').first().click();
      cy.getBySel('notification-detail-modal').should('be.visible');

      cy.getBySel('mark-as-read-button').click();
      cy.getBySel('notification-marked-read').should('be.visible');

      // Test notification preferences
      cy.getBySel('notification-settings-button').click();
      cy.getBySel('notification-preferences-modal').should('be.visible');

      cy.getBySel('email-notifications-checkbox').should('be.checked');
      cy.getBySel('push-notifications-checkbox').check();
      cy.getBySel('quiz-submission-notifications-checkbox').check();

      cy.getBySel('save-notification-preferences-button').click();
      cy.getBySel('preferences-saved-message').should('be.visible');
    });
  });

  describe('Course and Lesson Management', () => {
    it('should manage assigned courses and create lessons', () => {
      cy.visit('/teacher/courses');

      // View assigned courses
      cy.getBySel('teacher-course-list').should('be.visible');
      cy.waitForTableToLoad('teacher-course-list');

      // Open course details
      cy.getBySelLike('view-course-button').first().click();
      cy.getBySel('course-details-panel').should('be.visible');

      // Test lesson creation
      cy.getBySel('add-lesson-button').click();
      cy.getBySel('lesson-editor-modal').should('be.visible');

      // Fill lesson details
      cy.getBySel('lesson-title-input').type('Introduction to Kanji');
      cy.getBySel('lesson-description-input').type('Basic kanji characters and stroke order');

      // Test rich text content editor
      cy.getBySel('lesson-content-editor').should('be.visible');
      cy.getBySel('rich-text-toolbar').should('be.visible');

      // Add formatted content
      cy.getBySel('lesson-content-editor').type('Welcome to our kanji lesson!');
      cy.getBySel('bold-button').click();
      cy.getBySel('lesson-content-editor').type(' This is important information.');

      // Add multimedia content
      cy.getBySel('add-video-button').click();
      cy.getBySel('video-url-input').type('https://example.com/kanji-intro.mp4');
      cy.getBySel('video-title-input').type('Kanji Introduction Video');
      cy.getBySel('add-video-confirm-button').click();

      // Upload presentation slides
      cy.getBySel('upload-slides-button').click();
      cy.uploadFile('slides-file-input', 'kanji-slides.pdf', 'application/pdf');
      cy.getBySel('slides-upload-success').should('be.visible');

      // Add interactive elements
      cy.getBySel('add-flashcards-button').click();
      cy.getBySel('flashcard-editor').should('be.visible');

      // Create flashcards
      for (let i = 0; i < 3; i++) {
        cy.getBySel('add-flashcard-button').click();
        cy.getBySel(`flashcard-front-${i}`).type(`Kanji ${i + 1}`);
        cy.getBySel(`flashcard-back-${i}`).type(`Meaning ${i + 1}`);
      }

      cy.getBySel('save-flashcards-button').click();

      // Save lesson
      cy.getBySel('save-lesson-button').click();
      cy.getBySel('lesson-saved-success').should('be.visible');

      // Verify lesson appears in course
      cy.getBySel('course-lessons-list').should('contain', 'Introduction to Kanji');
    });

    it('should handle lesson scheduling and calendar integration', () => {
      // Test lesson scheduling
      cy.getBySel('schedule-lesson-button').click();
      cy.getBySel('lesson-scheduler-modal').should('be.visible');

      // Set schedule details
      cy.getBySel('lesson-date-input').type('2024-02-15');
      cy.getBySel('lesson-start-time-input').type('10:00');
      cy.getBySel('lesson-end-time-input').type('11:30');
      cy.getBySel('lesson-room-input').type('Room B205');

      // Add recurring schedule
      cy.getBySel('recurring-schedule-checkbox').check();
      cy.getBySel('recurrence-pattern-select').select('WEEKLY');
      cy.getBySel('recurrence-end-date-input').type('2024-06-15');

      // Check for conflicts
      cy.getBySel('check-schedule-conflicts-button').click();
      cy.getBySel('conflict-check-results').should('be.visible');

      cy.getBySel('save-schedule-button').click();
      cy.getBySel('schedule-saved-success').should('be.visible');

      // Test calendar view
      cy.getBySel('calendar-view-button').click();
      cy.getBySel('teacher-calendar').should('be.visible');

      // Navigate calendar
      cy.getBySel('calendar-next-button').click();
      cy.getBySel('calendar-prev-button').click();

      // View different calendar formats
      cy.getBySel('calendar-view-select').select('week');
      cy.getBySel('weekly-calendar-view').should('be.visible');

      cy.getBySel('calendar-view-select').select('day');
      cy.getBySel('daily-calendar-view').should('be.visible');

      // Test drag-and-drop rescheduling
      cy.getBySel('scheduled-lesson-item').drag('[data-testid="calendar-slot-next-day"]');
      cy.getBySel('reschedule-confirmation-modal').should('be.visible');
      cy.getBySel('confirm-reschedule-button').click();
      cy.getBySel('lesson-rescheduled-success').should('be.visible');
    });

    it('should manage student progress and provide feedback', () => {
      // Navigate to student progress
      cy.getBySel('view-student-progress-button').click();
      cy.getBySel('student-progress-dashboard').should('be.visible');

      // View class overview
      cy.getBySel('class-progress-overview').should('be.visible');
      cy.getBySel('progress-charts').should('be.visible');

      // Filter by class
      cy.getBySel('class-filter-select').select('Advanced Japanese A1');
      cy.waitForTableToLoad('student-progress-table');

      // View individual student progress
      cy.getBySelLike('view-student-details-button').first().click();
      cy.getBySel('student-detail-modal').should('be.visible');

      // Check student's lesson completion
      cy.getBySel('lesson-completion-chart').should('be.visible');
      cy.getBySel('quiz-scores-chart').should('be.visible');
      cy.getBySel('attendance-record').should('be.visible');

      // Add teacher feedback
      cy.getBySel('add-feedback-button').click();
      cy.getBySel('feedback-editor').should('be.visible');

      cy.getBySel('feedback-type-select').select('PROGRESS_NOTE');
      cy.getBySel('feedback-content-input').type('Great improvement in kanji recognition. Keep practicing stroke order.');
      cy.getBySel('feedback-visibility-select').select('STUDENT_AND_PARENT');

      cy.getBySel('save-feedback-button').click();
      cy.getBySel('feedback-saved-success').should('be.visible');

      // Test bulk feedback for multiple students
      cy.getBySel('close-student-detail-button').click();
      cy.selectTableRows([0, 1, 2]);
      cy.getBySel('bulk-feedback-button').click();

      cy.getBySel('bulk-feedback-modal').should('be.visible');
      cy.getBySel('bulk-feedback-template-select').select('WEEKLY_PROGRESS');
      cy.getBySel('bulk-feedback-content-input').type('Good progress this week. Continue with daily practice.');

      cy.getBySel('send-bulk-feedback-button').click();
      cy.getBySel('bulk-feedback-sent-success').should('be.visible');
    });
  });

  describe('Quiz and Assessment Management', () => {
    it('should create and manage quizzes for assigned courses', () => {
      cy.visit('/teacher/quizzes');

      // Create new quiz
      cy.getBySel('create-quiz-button').click();
      cy.getBySel('quiz-creation-wizard').should('be.visible');

      // Step 1: Basic information
      cy.getBySel('quiz-title-input').type('Weekly Kanji Assessment');
      cy.getBySel('quiz-description-input').type('Assessment covering kanji learned this week');
      cy.getBySel('target-course-select').select('Advanced Japanese A1');

      cy.getBySel('next-step-button').click();

      // Step 2: Quiz settings
      cy.getBySel('quiz-settings-step').should('be.visible');
      cy.getBySel('time-limit-input').type('30');
      cy.getBySel('attempts-allowed-input').type('2');
      cy.getBySel('show-results-immediately-checkbox').check();
      cy.getBySel('randomize-questions-checkbox').check();

      cy.getBySel('next-step-button').click();

      // Step 3: Add questions
      cy.getBySel('question-creation-step').should('be.visible');

      // Add multiple choice question
      cy.getBySel('add-question-button').click();
      cy.getBySel('question-type-select').select('MULTIPLE_CHOICE');
      cy.getBySel('question-content-input').type('What is the meaning of 水?');

      cy.getBySel('add-option-button').click();
      cy.getBySel('option-0-input').type('Water');
      cy.getBySel('option-0-correct-checkbox').check();

      cy.getBySel('add-option-button').click();
      cy.getBySel('option-1-input').type('Fire');

      cy.getBySel('add-option-button').click();
      cy.getBySel('option-2-input').type('Earth');

      cy.getBySel('add-option-button').click();
      cy.getBySel('option-3-input').type('Air');

      cy.getBySel('save-question-button').click();

      // Add fill-in-the-blank question
      cy.getBySel('add-question-button').click();
      cy.getBySel('question-type-select').select('FILL_IN_BLANK');
      cy.getBySel('question-content-input').type('The kanji for "mountain" is ___.');
      cy.getBySel('correct-answer-input').type('山');
      cy.getBySel('save-question-button').click();

      cy.getBySel('next-step-button').click();

      // Step 4: Review and publish
      cy.getBySel('quiz-review-step').should('be.visible');
      cy.getBySel('quiz-preview').should('be.visible');

      cy.getBySel('publish-quiz-button').click();
      cy.getBySel('quiz-published-success').should('be.visible');

      // Assign quiz to students
      cy.getBySel('assign-quiz-button').click();
      cy.getBySel('quiz-assignment-modal').should('be.visible');

      cy.getBySel('assignment-type-select').select('CLASS');
      cy.getBySel('target-class-select').select('Advanced Japanese A1 - Morning');
      cy.getBySel('due-date-input').type('2024-02-20');
      cy.getBySel('due-time-input').type('23:59');

      cy.getBySel('send-notifications-checkbox').check();
      cy.getBySel('confirm-assignment-button').click();
      cy.getBySel('quiz-assigned-success').should('be.visible');
    });

    it('should grade quizzes and provide detailed feedback', () => {
      // Navigate to grading interface
      cy.getBySel('grade-quizzes-button').click();
      cy.getBySel('grading-dashboard').should('be.visible');

      // Filter pending submissions
      cy.getBySel('submission-status-filter').select('PENDING');
      cy.waitForTableToLoad('quiz-submissions-table');

      // Grade individual submission
      cy.getBySelLike('grade-submission-button').first().click();
      cy.getBySel('grading-interface').should('be.visible');

      // Review student answers
      cy.getBySel('student-answers-panel').should('be.visible');
      cy.getBySel('question-navigation').should('be.visible');

      // Grade essay question manually
      cy.getBySel('question-2').click(); // Assuming question 2 is essay type
      cy.getBySel('student-essay-answer').should('be.visible');
      cy.getBySel('rubric-grading-panel').should('be.visible');

      // Use rubric for grading
      cy.getBySel('content-score-select').select('4');
      cy.getBySel('grammar-score-select').select('3');
      cy.getBySel('vocabulary-score-select').select('4');

      // Add detailed feedback
      cy.getBySel('question-feedback-input').type('Good understanding of the concept. Work on grammar structure.');

      // Add overall feedback
      cy.getBySel('overall-feedback-input').type('Excellent work overall. Continue practicing kanji writing.');

      // Save grades
      cy.getBySel('save-grades-button').click();
      cy.getBySel('grades-saved-success').should('be.visible');

      // Test bulk grading for auto-gradable questions
      cy.getBySel('auto-grade-all-button').click();
      cy.getBySel('auto-grading-progress').should('be.visible');
      cy.getBySel('auto-grading-complete').should('be.visible');

      // Review grading statistics
      cy.getBySel('grading-statistics-button').click();
      cy.getBySel('grading-stats-modal').should('be.visible');

      cy.getBySel('average-score-display').should('be.visible');
      cy.getBySel('score-distribution-chart').should('be.visible');
      cy.getBySel('question-difficulty-analysis').should('be.visible');
    });

    it('should analyze quiz results and generate reports', () => {
      // Navigate to quiz analytics
      cy.getBySel('quiz-analytics-button').click();
      cy.getBySel('quiz-analytics-dashboard').should('be.visible');

      // Select quiz for analysis
      cy.getBySel('quiz-select').select('Weekly Kanji Assessment');
      cy.getBySel('analytics-date-range').select('LAST_MONTH');
      cy.getBySel('apply-filters-button').click();

      // View performance analytics
      cy.getBySel('performance-overview').should('be.visible');
      cy.getBySel('class-comparison-chart').should('be.visible');
      cy.getBySel('question-analysis-table').should('be.visible');

      // Identify struggling students
      cy.getBySel('struggling-students-panel').should('be.visible');
      cy.getBySel('intervention-suggestions').should('be.visible');

      // Generate detailed report
      cy.getBySel('generate-report-button').click();
      cy.getBySel('report-options-modal').should('be.visible');

      cy.getBySel('report-type-select').select('COMPREHENSIVE');
      cy.getBySel('include-student-details-checkbox').check();
      cy.getBySel('include-recommendations-checkbox').check();
      cy.getBySel('report-format-select').select('PDF');

      cy.getBySel('generate-report-confirm-button').click();
      cy.getBySel('report-generation-progress').should('be.visible');
      cy.getBySel('report-ready-notification').should('be.visible');

      // Share report with administration
      cy.getBySel('share-report-button').click();
      cy.getBySel('share-options-modal').should('be.visible');

      cy.getBySel('share-with-admin-checkbox').check();
      cy.getBySel('share-with-parents-checkbox').check();
      cy.getBySel('add-sharing-note-input').type('Monthly progress report for review');

      cy.getBySel('confirm-sharing-button').click();
      cy.getBySel('report-shared-success').should('be.visible');
    });
  });

  describe('Communication and Collaboration', () => {
    it('should communicate with students and parents', () => {
      // Navigate to communication center
      cy.getBySel('communication-center-button').click();
      cy.getBySel('communication-dashboard').should('be.visible');

      // Send message to individual student
      cy.getBySel('compose-message-button').click();
      cy.getBySel('message-composer').should('be.visible');

      cy.getBySel('recipient-type-select').select('STUDENT');
      cy.getBySel('student-search-input').type('John Doe');
      cy.getBySel('student-search-results').should('be.visible');
      cy.getBySelLike('select-student-button').first().click();

      cy.getBySel('message-subject-input').type("Great progress in today's lesson");
      cy.getBySel('message-content-input').type(
        'I noticed significant improvement in your kanji recognition today. Keep up the excellent work!',
      );

      cy.getBySel('message-priority-select').select('NORMAL');
      cy.getBySel('send-message-button').click();
      cy.getBySel('message-sent-success').should('be.visible');

      // Send announcement to entire class
      cy.getBySel('class-announcement-button').click();
      cy.getBySel('announcement-composer').should('be.visible');

      cy.getBySel('target-class-select').select('Advanced Japanese A1 - Morning');
      cy.getBySel('announcement-title-input').type('Upcoming Cultural Festival');
      cy.getBySel('announcement-content-input').type(
        "Don't forget about our Japanese cultural festival next Friday. Please prepare your presentations.",
      );

      cy.getBySel('include-parents-checkbox').check();
      cy.getBySel('schedule-announcement-checkbox').check();
      cy.getBySel('scheduled-date-input').type('2024-02-18');
      cy.getBySel('scheduled-time-input').type('08:00');

      cy.getBySel('send-announcement-button').click();
      cy.getBySel('announcement-scheduled-success').should('be.visible');

      // Test parent communication
      cy.getBySel('parent-communication-tab').click();
      cy.getBySel('parent-contact-list').should('be.visible');

      cy.getBySel('send-progress-report-button').click();
      cy.getBySel('progress-report-composer').should('be.visible');

      cy.getBySel('student-select').select('Jane Smith');
      cy.getBySel('report-period-select').select('WEEKLY');
      cy.getBySel('include-attendance-checkbox').check();
      cy.getBySel('include-grades-checkbox').check();
      cy.getBySel('include-behavior-notes-checkbox').check();

      cy.getBySel('additional-comments-input').type('Jane has shown excellent participation and improvement this week.');

      cy.getBySel('send-progress-report-button').click();
      cy.getBySel('progress-report-sent-success').should('be.visible');
    });

    it('should collaborate with other teachers', () => {
      // Navigate to teacher collaboration area
      cy.getBySel('teacher-collaboration-button').click();
      cy.getBySel('collaboration-dashboard').should('be.visible');

      // Join teacher discussion forum
      cy.getBySel('discussion-forums-tab').click();
      cy.getBySel('forum-list').should('be.visible');

      cy.getBySelLike('join-forum-button').first().click();
      cy.getBySel('forum-discussion-view').should('be.visible');

      // Post in forum
      cy.getBySel('new-post-button').click();
      cy.getBySel('post-composer').should('be.visible');

      cy.getBySel('post-title-input').type('Effective Kanji Teaching Strategies');
      cy.getBySel('post-content-input').type(
        "I've found that using visual mnemonics helps students remember kanji better. What techniques do you use?",
      );
      cy.getBySel('post-category-select').select('TEACHING_METHODS');

      cy.getBySel('publish-post-button').click();
      cy.getBySel('post-published-success').should('be.visible');

      // Share teaching resources
      cy.getBySel('resource-sharing-tab').click();
      cy.getBySel('shared-resources-library').should('be.visible');

      cy.getBySel('upload-resource-button').click();
      cy.getBySel('resource-upload-modal').should('be.visible');

      cy.uploadFile('resource-file-input', 'kanji-worksheet.pdf', 'application/pdf');
      cy.getBySel('resource-title-input').type('Beginner Kanji Practice Worksheet');
      cy.getBySel('resource-description-input').type('Practice worksheet for basic kanji characters');
      cy.getBySel('resource-subject-select').select('JAPANESE');
      cy.getBySel('resource-level-select').select('BEGINNER');

      cy.getBySel('resource-tags-input').type('kanji, practice, worksheet');
      cy.getBySel('allow-modifications-checkbox').check();

      cy.getBySel('share-resource-button').click();
      cy.getBySel('resource-shared-success').should('be.visible');

      // Request peer observation
      cy.getBySel('peer-observation-tab').click();
      cy.getBySel('observation-requests').should('be.visible');

      cy.getBySel('request-observation-button').click();
      cy.getBySel('observation-request-modal').should('be.visible');

      cy.getBySel('observer-teacher-select').select('Ms. Tanaka');
      cy.getBySel('observation-date-input').type('2024-02-22');
      cy.getBySel('observation-time-input').type('10:00');
      cy.getBySel('lesson-topic-input').type('Introduction to Keigo');

      cy.getBySel('observation-focus-select').select('STUDENT_ENGAGEMENT');
      cy.getBySel('additional-notes-input').type('Please focus on how students respond to interactive activities');

      cy.getBySel('send-observation-request-button').click();
      cy.getBySel('observation-requested-success').should('be.visible');
    });
  });

  describe('Professional Development and Analytics', () => {
    it('should track teaching analytics and professional growth', () => {
      // Navigate to teacher analytics
      cy.getBySel('teacher-analytics-button').click();
      cy.getBySel('teacher-analytics-dashboard').should('be.visible');

      // View teaching performance metrics
      cy.getBySel('performance-overview').should('be.visible');
      cy.getBySel('student-satisfaction-score').should('be.visible');
      cy.getBySel('lesson-completion-rate').should('be.visible');
      cy.getBySel('quiz-average-scores').should('be.visible');

      // Analyze student engagement
      cy.getBySel('engagement-analytics-tab').click();
      cy.getBySel('engagement-trends-chart').should('be.visible');
      cy.getBySel('participation-metrics').should('be.visible');

      // View professional development recommendations
      cy.getBySel('development-recommendations-tab').click();
      cy.getBySel('skill-assessment-results').should('be.visible');
      cy.getBySel('recommended-courses').should('be.visible');

      // Enroll in professional development course
      cy.getBySelLike('enroll-course-button').first().click();
      cy.getBySel('course-enrollment-modal').should('be.visible');

      cy.getBySel('enrollment-confirmation-checkbox').check();
      cy.getBySel('confirm-enrollment-button').click();
      cy.getBySel('enrollment-success-message').should('be.visible');

      // Set professional goals
      cy.getBySel('professional-goals-tab').click();
      cy.getBySel('goals-management-panel').should('be.visible');

      cy.getBySel('add-goal-button').click();
      cy.getBySel('goal-title-input').type('Improve student quiz scores by 15%');
      cy.getBySel('goal-description-input').type('Focus on interactive teaching methods and personalized feedback');
      cy.getBySel('goal-deadline-input').type('2024-06-30');
      cy.getBySel('goal-category-select').select('STUDENT_OUTCOMES');

      cy.getBySel('save-goal-button').click();
      cy.getBySel('goal-saved-success').should('be.visible');

      // Track goal progress
      cy.getBySel('goal-progress-tracker').should('be.visible');
      cy.getBySel('update-progress-button').click();
      cy.getBySel('progress-percentage-input').type('25');
      cy.getBySel('progress-notes-input').type('Implemented new interactive quiz format');
      cy.getBySel('save-progress-button').click();
    });

    it('should generate and review teaching reports', () => {
      // Generate comprehensive teaching report
      cy.getBySel('generate-teaching-report-button').click();
      cy.getBySel('report-generation-wizard').should('be.visible');

      // Select report parameters
      cy.getBySel('report-period-select').select('SEMESTER');
      cy.getBySel('include-student-feedback-checkbox').check();
      cy.getBySel('include-parent-feedback-checkbox').check();
      cy.getBySel('include-peer-observations-checkbox').check();
      cy.getBySel('include-professional-development-checkbox').check();

      cy.getBySel('generate-report-button').click();
      cy.getBySel('report-generation-progress').should('be.visible');
      cy.getBySel('report-generated-success').should('be.visible');

      // Review generated report
      cy.getBySel('view-report-button').click();
      cy.getBySel('teaching-report-viewer').should('be.visible');

      // Navigate through report sections
      cy.getBySel('report-navigation').should('be.visible');
      cy.getBySel('student-outcomes-section').click();
      cy.getBySel('outcomes-charts').should('be.visible');

      cy.getBySel('teaching-methods-section').click();
      cy.getBySel('methods-analysis').should('be.visible');

      cy.getBySel('professional-growth-section').click();
      cy.getBySel('growth-metrics').should('be.visible');

      // Export report for portfolio
      cy.getBySel('export-report-button').click();
      cy.getBySel('export-options-modal').should('be.visible');

      cy.getBySel('export-format-select').select('PDF');
      cy.getBySel('include-appendices-checkbox').check();
      cy.getBySel('watermark-checkbox').uncheck();

      cy.getBySel('confirm-export-button').click();
      cy.getBySel('export-complete-message').should('be.visible');

      // Share report with supervisor
      cy.getBySel('share-with-supervisor-button').click();
      cy.getBySel('supervisor-sharing-modal').should('be.visible');

      cy.getBySel('supervisor-select').select('Dr. Johnson');
      cy.getBySel('sharing-message-input').type('Please review my semester teaching report for our upcoming evaluation meeting.');
      cy.getBySel('request-feedback-checkbox').check();

      cy.getBySel('send-to-supervisor-button').click();
      cy.getBySel('report-shared-with-supervisor-success').should('be.visible');
    });
  });

  describe('Accessibility and Performance', () => {
    it('should be fully accessible for teachers with disabilities', () => {
      // Test keyboard navigation throughout teacher interface
      cy.getBySel('teacher-dashboard').focus();
      cy.realPress('Tab');
      cy.getBySel('assigned-courses-widget').should('have.focus');

      // Test screen reader compatibility
      cy.getBySel('teacher-dashboard').should('have.attr', 'role', 'main');
      cy.getBySel('sidebar-navigation').should('have.attr', 'role', 'navigation');

      // Test high contrast mode
      cy.window().then(win => {
        win.document.body.classList.add('high-contrast');
      });

      cy.getBySel('teacher-dashboard').should('be.visible');
      cy.getBySel('course-cards').should('be.visible');

      // Test voice commands (simulated)
      cy.window().then(win => {
        win.dispatchEvent(
          new CustomEvent('voice-command', {
            detail: { command: 'navigate to courses' },
          }),
        );
      });

      cy.url().should('include', '/teacher/courses');

      // Comprehensive accessibility audit
      cy.checkAccessibility();
    });

    it('should perform well with large amounts of data', () => {
      // Test performance with large class sizes
      cy.intercept('GET', '/api/teacher/classes*', { fixture: 'large-class-data.json' }).as('largeClassData');
      cy.visit('/teacher/classes');

      cy.wait('@largeClassData');
      cy.measurePageLoad('Large Class Data');

      // Test virtual scrolling performance
      cy.getBySel('student-list-container').should('be.visible');
      cy.getBySel('virtual-scroll-indicator').should('be.visible');

      // Test search performance with large datasets
      const startTime = Date.now();
      cy.getBySel('student-search-input').type('John');
      cy.getBySel('search-results').should('be.visible');

      cy.then(() => {
        const searchTime = Date.now() - startTime;
        expect(searchTime).to.be.lessThan(1000);
      });

      // Test grading performance with many submissions
      cy.getBySel('grade-all-submissions-button').click();
      cy.getBySel('bulk-grading-progress').should('be.visible');
      cy.getBySel('bulk-grading-complete').should('be.visible');

      // Verify UI remains responsive during heavy operations
      cy.getBySel('navigation-menu').should('be.visible');
      cy.getBySel('user-menu').click();
      cy.getBySel('user-dropdown').should('be.visible');
    });
  });
});
