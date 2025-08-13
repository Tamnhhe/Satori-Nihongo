describe('Admin Quiz Management E2E Tests', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/admin/quizzes');
  });

  describe('Quiz Creation and Management Workflow', () => {
    it('should complete comprehensive quiz creation workflow', () => {
      // Measure page load performance
      cy.measurePageLoad('Quiz Management');

      // Verify page loads correctly
      cy.getBySel('quiz-management-table').should('be.visible');
      cy.waitForTableToLoad('quiz-management-table');

      // Test quiz creation with multiple question types
      const newQuiz = {
        title: `E2E Test Quiz ${Date.now()}`,
        description: 'Comprehensive test quiz with multiple question types',
        quizType: 'COURSE',
        questions: [
          {
            content: 'What is the Japanese word for "hello"?',
            type: 'MULTIPLE_CHOICE',
            correctAnswer: 'こんにちは',
            options: ['こんにちは', 'さようなら', 'ありがとう', 'すみません'],
          },
          {
            content: 'Fill in the blank: 私は___です。(I am a student)',
            type: 'FILL_IN_BLANK',
            correctAnswer: '学生',
          },
          {
            content: 'Explain the difference between は and が particles.',
            type: 'ESSAY',
            correctAnswer: 'Sample answer about particle usage',
          },
        ],
      };

      cy.createTestQuiz(newQuiz);

      // Verify quiz was created
      cy.getBySel('quiz-management-table').should('contain', newQuiz.title);

      // Test quiz builder drag-and-drop functionality
      cy.getBySelLike('edit-quiz-button').first().click();
      cy.getBySel('quiz-builder').should('be.visible');

      // Test question reordering via drag and drop
      cy.getBySel('question-item-1').drag('[data-testid="question-item-3"]');
      cy.getBySel('reorder-success-message').should('be.visible');

      // Test question bank integration
      cy.getBySel('question-bank-button').click();
      cy.getBySel('question-bank-modal').should('be.visible');

      // Search and filter questions in bank
      cy.getBySel('question-search-input').type('grammar');
      cy.getBySel('question-type-filter').select('MULTIPLE_CHOICE');
      cy.getBySel('difficulty-filter').select('INTERMEDIATE');

      cy.getBySel('question-bank-results').should('be.visible');
      cy.getBySelLike('question-checkbox').first().check();
      cy.getBySelLike('question-checkbox').eq(1).check();

      cy.getBySel('add-selected-questions-button').click();
      cy.getBySel('questions-added-success').should('be.visible');

      // Test quiz settings configuration
      cy.getBySel('quiz-settings-button').click();
      cy.getBySel('quiz-settings-modal').should('be.visible');

      cy.getBySel('time-limit-input').clear().type('45');
      cy.getBySel('max-attempts-input').clear().type('3');
      cy.getBySel('show-correct-answers-checkbox').check();
      cy.getBySel('randomize-questions-checkbox').check();
      cy.getBySel('allow-review-checkbox').check();

      cy.getBySel('save-settings-button').click();
      cy.getBySel('settings-saved-message').should('be.visible');

      // Test quiz preview functionality
      cy.getBySel('preview-quiz-button').click();
      cy.getBySel('quiz-preview-modal').should('be.visible');

      // Navigate through preview questions
      cy.getBySel('preview-question-1').should('be.visible');
      cy.getBySel('next-question-button').click();
      cy.getBySel('preview-question-2').should('be.visible');

      // Test preview answer submission
      cy.getBySel('preview-answer-option-1').click();
      cy.getBySel('submit-preview-answer-button').click();
      cy.getBySel('preview-feedback').should('be.visible');

      cy.getBySel('close-preview-button').click();

      // Save the quiz
      cy.getBySel('save-quiz-button').click();
      cy.getBySel('quiz-saved-success').should('be.visible');

      // Check accessibility
      cy.checkAccessibility();
    });

    it('should handle quiz assignment and scheduling', () => {
      // Test quiz assignment to courses
      cy.getBySelLike('assign-quiz-button').first().click();
      cy.getBySel('quiz-assignment-modal').should('be.visible');

      // Configure assignment details
      cy.getBySel('assignment-type-select').select('COURSE');
      cy.getBySel('target-course-select').select(['course-1', 'course-2']);

      // Set assignment dates
      cy.getBySel('start-date-input').type('2024-02-01');
      cy.getBySel('start-time-input').type('09:00');
      cy.getBySel('end-date-input').type('2024-02-28');
      cy.getBySel('end-time-input').type('23:59');

      // Configure assignment options
      cy.getBySel('is-required-checkbox').check();
      cy.getBySel('auto-grade-checkbox').check();
      cy.getBySel('send-notifications-checkbox').check();

      // Test conflict detection
      cy.getBySel('check-conflicts-button').click();
      cy.getBySel('conflict-check-results').should('be.visible');

      cy.getBySel('save-assignment-button').click();
      cy.getBySel('assignment-success-message').should('be.visible');

      // Test assignment to specific students
      cy.getBySel('assign-to-students-button').click();
      cy.getBySel('student-assignment-modal').should('be.visible');

      cy.getBySel('student-search-input').type('john');
      cy.getBySel('student-search-results').should('be.visible');
      cy.getBySelLike('select-student-checkbox').first().check();
      cy.getBySelLike('select-student-checkbox').eq(1).check();

      cy.getBySel('assign-to-selected-button').click();
      cy.getBySel('student-assignment-success').should('be.visible');

      // Test bulk assignment
      cy.selectTableRows([0, 1, 2]);
      cy.getBySel('bulk-assign-button').click();
      cy.getBySel('bulk-assignment-modal').should('be.visible');

      cy.getBySel('bulk-target-type-select').select('CLASS');
      cy.getBySel('bulk-target-class-select').select('class-advanced-001');
      cy.getBySel('bulk-due-date-input').type('2024-03-15');

      cy.getBySel('confirm-bulk-assignment-button').click();
      cy.getBySel('bulk-assignment-progress').should('be.visible');
      cy.getBySel('bulk-assignment-complete').should('be.visible');
    });

    it('should provide comprehensive quiz analytics', () => {
      // Navigate to quiz analytics
      cy.getBySelLike('view-analytics-button').first().click();
      cy.getBySel('quiz-analytics-dashboard').should('be.visible');

      // Verify analytics widgets load
      cy.getBySel('quiz-attempts-chart').should('be.visible');
      cy.getBySel('score-distribution-chart').should('be.visible');
      cy.getBySel('question-difficulty-chart').should('be.visible');
      cy.getBySel('completion-time-chart').should('be.visible');

      // Test analytics filtering
      cy.getBySel('analytics-date-range').click();
      cy.getBySel('last-7-days-option').click();
      cy.getBySel('apply-filter-button').click();

      // Wait for charts to update
      cy.getBySel('analytics-loading').should('not.exist');

      // Test question-level analytics
      cy.getBySel('question-analytics-tab').click();
      cy.getBySel('question-performance-table').should('be.visible');

      // Sort by difficulty
      cy.getBySel('sort-by-difficulty').click();
      cy.getBySel('question-performance-table').should('be.visible');

      // Test drill-down functionality
      cy.getBySelLike('question-details-button').first().click();
      cy.getBySel('question-details-modal').should('be.visible');

      cy.getBySel('answer-distribution-chart').should('be.visible');
      cy.getBySel('response-time-chart').should('be.visible');
      cy.getBySel('student-responses-table').should('be.visible');

      // Test analytics export
      cy.getBySel('export-analytics-button').click();
      cy.getBySel('export-format-select').select('xlsx');
      cy.getBySel('include-student-details-checkbox').check();
      cy.getBySel('confirm-export-button').click();

      cy.getBySel('export-progress').should('be.visible');
      cy.getBySel('export-complete-message').should('be.visible');

      // Test comparative analytics
      cy.getBySel('compare-quizzes-button').click();
      cy.getBySel('quiz-comparison-modal').should('be.visible');

      cy.getBySel('comparison-quiz-select').select(['quiz-2', 'quiz-3']);
      cy.getBySel('comparison-metric-select').select('average-score');
      cy.getBySel('generate-comparison-button').click();

      cy.getBySel('comparison-chart').should('be.visible');
      cy.getBySel('comparison-insights').should('be.visible');
    });
  });

  describe('Advanced Quiz Features', () => {
    it('should handle adaptive quiz functionality', () => {
      // Create adaptive quiz
      cy.getBySel('create-adaptive-quiz-button').click();
      cy.getBySel('adaptive-quiz-builder').should('be.visible');

      // Configure adaptive settings
      cy.getBySel('adaptive-algorithm-select').select('DIFFICULTY_BASED');
      cy.getBySel('initial-difficulty-select').select('MEDIUM');
      cy.getBySel('difficulty-adjustment-rate').type('0.3');
      cy.getBySel('termination-criteria-select').select('CONFIDENCE_LEVEL');
      cy.getBySel('confidence-threshold').type('0.85');

      // Add questions with difficulty levels
      cy.getBySel('add-adaptive-question-button').click();
      cy.getBySel('question-content-input').type('Easy question about hiragana');
      cy.getBySel('difficulty-level-select').select('EASY');
      cy.getBySel('save-question-button').click();

      cy.getBySel('add-adaptive-question-button').click();
      cy.getBySel('question-content-input').type('Medium question about grammar');
      cy.getBySel('difficulty-level-select').select('MEDIUM');
      cy.getBySel('save-question-button').click();

      cy.getBySel('add-adaptive-question-button').click();
      cy.getBySel('question-content-input').type('Hard question about keigo');
      cy.getBySel('difficulty-level-select').select('HARD');
      cy.getBySel('save-question-button').click();

      // Test adaptive quiz simulation
      cy.getBySel('simulate-adaptive-quiz-button').click();
      cy.getBySel('simulation-modal').should('be.visible');

      cy.getBySel('student-ability-slider').invoke('val', 0.6).trigger('change');
      cy.getBySel('run-simulation-button').click();

      cy.getBySel('simulation-results').should('be.visible');
      cy.getBySel('question-sequence-chart').should('be.visible');
      cy.getBySel('ability-estimation-chart').should('be.visible');

      cy.getBySel('save-adaptive-quiz-button').click();
      cy.getBySel('adaptive-quiz-saved-success').should('be.visible');
    });

    it('should handle collaborative quiz creation', () => {
      // Test collaborative editing
      cy.getBySel('enable-collaboration-button').click();
      cy.getBySel('collaboration-settings-modal').should('be.visible');

      // Add collaborators
      cy.getBySel('add-collaborator-input').type('teacher2@example.com');
      cy.getBySel('collaborator-role-select').select('EDITOR');
      cy.getBySel('add-collaborator-button').click();

      cy.getBySel('collaborator-list').should('contain', 'teacher2@example.com');

      // Set collaboration permissions
      cy.getBySel('allow-question-editing-checkbox').check();
      cy.getBySel('allow-settings-modification-checkbox').uncheck();
      cy.getBySel('require-approval-checkbox').check();

      cy.getBySel('save-collaboration-settings-button').click();

      // Test real-time collaboration indicators
      cy.getBySel('collaboration-indicator').should('be.visible');
      cy.getBySel('active-collaborators-count').should('contain', '2');

      // Simulate collaborator activity
      cy.window().then(win => {
        win.dispatchEvent(
          new CustomEvent('collaborator-joined', {
            detail: {
              userId: 'teacher2-id',
              userName: 'Teacher Two',
              action: 'editing-question-1',
            },
          }),
        );
      });

      cy.getBySel('collaborator-activity-indicator').should('be.visible');
      cy.getBySel('question-being-edited-indicator').should('be.visible');

      // Test comment system
      cy.getBySel('add-comment-button').click();
      cy.getBySel('comment-input').type('This question might be too difficult for beginners');
      cy.getBySel('submit-comment-button').click();

      cy.getBySel('comments-panel').should('contain', 'This question might be too difficult');

      // Test change approval workflow
      cy.getBySel('pending-changes-indicator').should('be.visible');
      cy.getBySel('review-changes-button').click();
      cy.getBySel('changes-review-modal').should('be.visible');

      cy.getBySel('approve-change-button').click();
      cy.getBySel('change-approved-message').should('be.visible');
    });

    it('should handle quiz versioning and history', () => {
      // Test quiz versioning
      cy.getBySelLike('edit-quiz-button').first().click();
      cy.getBySel('quiz-builder').should('be.visible');

      // Make changes to create new version
      cy.getBySel('quiz-title-input').clear().type('Updated Quiz Title v2');
      cy.getBySel('save-as-new-version-button').click();

      cy.getBySel('version-notes-input').type('Updated title and added new questions');
      cy.getBySel('confirm-new-version-button').click();

      cy.getBySel('new-version-created-message').should('be.visible');

      // Test version history
      cy.getBySel('version-history-button').click();
      cy.getBySel('version-history-modal').should('be.visible');

      cy.getBySel('version-list').should('be.visible');
      cy.getBySel('version-list').should('contain', 'v1.0');
      cy.getBySel('version-list').should('contain', 'v2.0');

      // Test version comparison
      cy.getBySel('compare-versions-button').click();
      cy.getBySel('version-1-select').select('v1.0');
      cy.getBySel('version-2-select').select('v2.0');
      cy.getBySel('generate-comparison-button').click();

      cy.getBySel('version-diff-viewer').should('be.visible');
      cy.getBySel('changes-summary').should('be.visible');

      // Test version rollback
      cy.getBySel('rollback-to-version-button').click();
      cy.getBySel('rollback-confirmation-modal').should('be.visible');

      cy.getBySel('rollback-reason-input').type('Reverting due to student feedback');
      cy.getBySel('confirm-rollback-button').click();

      cy.getBySel('rollback-success-message').should('be.visible');

      // Test version branching
      cy.getBySel('create-branch-button').click();
      cy.getBySel('branch-name-input').type('experimental-features');
      cy.getBySel('branch-description-input').type('Testing new question types');
      cy.getBySel('create-branch-button').click();

      cy.getBySel('branch-created-message').should('be.visible');
      cy.getBySel('current-branch-indicator').should('contain', 'experimental-features');
    });
  });

  describe('Quiz Import/Export and Integration', () => {
    it('should handle various quiz import formats', () => {
      // Test QTI import
      cy.getBySel('import-quiz-button').click();
      cy.getBySel('import-format-select').select('QTI');
      cy.uploadFile('import-file-input', 'sample-qti-quiz.xml', 'application/xml');

      cy.getBySel('import-preview').should('be.visible');
      cy.getBySel('questions-count').should('contain', '15 questions');
      cy.getBySel('import-warnings').should('be.visible');

      cy.getBySel('confirm-import-button').click();
      cy.getBySel('import-progress').should('be.visible');
      cy.getBySel('import-success-message').should('be.visible');

      // Test CSV import
      cy.getBySel('import-quiz-button').click();
      cy.getBySel('import-format-select').select('CSV');
      cy.uploadFile('import-file-input', 'quiz-questions.csv', 'text/csv');

      // Map CSV columns
      cy.getBySel('column-mapping-section').should('be.visible');
      cy.getBySel('question-column-select').select('Question Text');
      cy.getBySel('answer-column-select').select('Correct Answer');
      cy.getBySel('type-column-select').select('Question Type');

      cy.getBySel('validate-mapping-button').click();
      cy.getBySel('mapping-validation-results').should('be.visible');

      cy.getBySel('confirm-csv-import-button').click();
      cy.getBySel('csv-import-success').should('be.visible');

      // Test Moodle XML import
      cy.getBySel('import-quiz-button').click();
      cy.getBySel('import-format-select').select('MOODLE_XML');
      cy.uploadFile('import-file-input', 'moodle-quiz.xml', 'application/xml');

      cy.getBySel('moodle-import-options').should('be.visible');
      cy.getBySel('preserve-categories-checkbox').check();
      cy.getBySel('import-images-checkbox').check();

      cy.getBySel('confirm-moodle-import-button').click();
      cy.getBySel('moodle-import-progress').should('be.visible');
      cy.getBySel('moodle-import-complete').should('be.visible');
    });

    it('should handle quiz export to multiple formats', () => {
      // Test comprehensive export
      cy.selectTableRows([0, 1, 2]);
      cy.getBySel('export-selected-button').click();
      cy.getBySel('export-options-modal').should('be.visible');

      // Configure export options
      cy.getBySel('export-format-select').select('QTI_2_1');
      cy.getBySel('include-media-checkbox').check();
      cy.getBySel('include-analytics-checkbox').check();
      cy.getBySel('anonymize-data-checkbox').uncheck();

      cy.getBySel('export-destination-select').select('DOWNLOAD');
      cy.getBySel('confirm-export-button').click();

      cy.getBySel('export-progress').should('be.visible');
      cy.getBySel('export-complete-message').should('be.visible');

      // Test LMS integration export
      cy.getBySel('export-to-lms-button').click();
      cy.getBySel('lms-integration-modal').should('be.visible');

      cy.getBySel('lms-platform-select').select('MOODLE');
      cy.getBySel('lms-course-select').select('japanese-101');
      cy.getBySel('export-settings-button').click();

      cy.getBySel('lms-export-settings').should('be.visible');
      cy.getBySel('grade-passback-checkbox').check();
      cy.getBySel('attempt-limit-input').type('3');

      cy.getBySel('export-to-lms-confirm-button').click();
      cy.getBySel('lms-export-progress').should('be.visible');
      cy.getBySel('lms-export-success').should('be.visible');

      // Test print-friendly export
      cy.getBySel('export-for-print-button').click();
      cy.getBySel('print-options-modal').should('be.visible');

      cy.getBySel('include-answer-key-checkbox').check();
      cy.getBySel('page-layout-select').select('A4');
      cy.getBySel('font-size-select').select('12pt');

      cy.getBySel('generate-pdf-button').click();
      cy.getBySel('pdf-generation-progress').should('be.visible');
      cy.getBySel('pdf-ready-message').should('be.visible');
    });

    it('should integrate with external assessment tools', () => {
      // Test Turnitin integration
      cy.getBySel('plagiarism-detection-button').click();
      cy.getBySel('turnitin-integration-modal').should('be.visible');

      cy.getBySel('enable-turnitin-checkbox').check();
      cy.getBySel('similarity-threshold-input').type('15');
      cy.getBySel('exclude-bibliography-checkbox').check();

      cy.getBySel('save-turnitin-settings-button').click();
      cy.getBySel('turnitin-enabled-message').should('be.visible');

      // Test proctoring integration
      cy.getBySel('proctoring-settings-button').click();
      cy.getBySel('proctoring-modal').should('be.visible');

      cy.getBySel('proctoring-provider-select').select('RESPONDUS');
      cy.getBySel('lockdown-browser-checkbox').check();
      cy.getBySel('webcam-monitoring-checkbox').check();
      cy.getBySel('screen-recording-checkbox').check();

      cy.getBySel('save-proctoring-settings-button').click();
      cy.getBySel('proctoring-configured-message').should('be.visible');

      // Test gradebook integration
      cy.getBySel('gradebook-integration-button').click();
      cy.getBySel('gradebook-settings-modal').should('be.visible');

      cy.getBySel('auto-sync-grades-checkbox').check();
      cy.getBySel('grade-category-select').select('Quizzes');
      cy.getBySel('points-possible-input').type('100');

      cy.getBySel('test-gradebook-connection-button').click();
      cy.getBySel('connection-test-success').should('be.visible');

      cy.getBySel('save-gradebook-settings-button').click();
      cy.getBySel('gradebook-integration-saved').should('be.visible');
    });
  });

  describe('Performance and Accessibility', () => {
    it('should handle large-scale quiz operations efficiently', () => {
      // Test performance with large question banks
      cy.intercept('GET', '/api/questions*', { fixture: 'large-question-bank.json' }).as('largeQuestionBank');

      cy.getBySel('question-bank-button').click();
      cy.wait('@largeQuestionBank');

      cy.measurePageLoad('Large Question Bank');

      // Test search performance
      const startTime = Date.now();
      cy.getBySel('question-search-input').type('grammar');
      cy.getBySel('search-results').should('be.visible');

      cy.then(() => {
        const searchTime = Date.now() - startTime;
        expect(searchTime).to.be.lessThan(1000);
      });

      // Test bulk operations performance
      cy.getBySel('select-all-questions-checkbox').check();
      cy.getBySel('bulk-add-to-quiz-button').click();

      cy.getBySel('bulk-operation-progress').should('be.visible');
      cy.getBySel('bulk-operation-complete').should('be.visible');

      // Test quiz with many questions performance
      cy.getBySel('save-quiz-button').click();
      cy.getBySel('large-quiz-warning').should('be.visible');
      cy.getBySel('optimize-quiz-button').click();

      cy.getBySel('optimization-suggestions').should('be.visible');
      cy.getBySel('apply-optimizations-button').click();
      cy.getBySel('quiz-optimized-message').should('be.visible');
    });

    it('should be fully accessible for all users', () => {
      // Test keyboard navigation
      cy.getBySel('quiz-management-table').focus();
      cy.realPress('Tab');
      cy.getBySel('create-quiz-button').should('have.focus');

      cy.realPress('Enter');
      cy.getBySel('quiz-builder').should('be.visible');

      // Navigate through quiz builder with keyboard
      cy.getBySel('quiz-title-input').should('have.focus');
      cy.realPress('Tab');
      cy.getBySel('quiz-description-input').should('have.focus');

      // Test screen reader support
      cy.getBySel('quiz-builder').should('have.attr', 'role', 'main');
      cy.getBySel('questions-list').should('have.attr', 'role', 'list');
      cy.getBySel('questions-list').find('[role="listitem"]').should('exist');

      // Test ARIA labels and descriptions
      cy.getBySel('add-question-button').should('have.attr', 'aria-label');
      cy.getBySel('question-type-select').should('have.attr', 'aria-describedby');

      // Test high contrast mode
      cy.window().then(win => {
        win.document.body.classList.add('high-contrast');
      });

      cy.getBySel('quiz-builder').should('be.visible');
      cy.checkAccessibility();

      // Test focus management in modals
      cy.getBySel('quiz-settings-button').click();
      cy.getBySel('quiz-settings-modal').should('be.visible');
      cy.getBySel('time-limit-input').should('have.focus');

      cy.realPress('Escape');
      cy.getBySel('quiz-settings-modal').should('not.exist');
      cy.getBySel('quiz-settings-button').should('have.focus');

      // Comprehensive accessibility audit
      cy.checkAccessibility();
    });
  });
});
