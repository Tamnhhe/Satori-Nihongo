/// <reference types="cypress" />

// Authentication commands
Cypress.Commands.add('loginAsAdmin', () => {
  cy.session('admin', () => {
    cy.visit('/login');
    cy.getBySel('username-input').type(Cypress.env('adminUsername'));
    cy.getBySel('password-input').type(Cypress.env('adminPassword'));
    cy.getBySel('login-button').click();
    cy.url().should('include', '/admin/dashboard');
    cy.getBySel('admin-dashboard').should('be.visible');
  });
});

Cypress.Commands.add('loginAsTeacher', () => {
  cy.session('teacher', () => {
    cy.visit('/login');
    cy.getBySel('username-input').type(Cypress.env('teacherUsername'));
    cy.getBySel('password-input').type(Cypress.env('teacherPassword'));
    cy.getBySel('login-button').click();
    cy.url().should('include', '/teacher/dashboard');
    cy.getBySel('teacher-dashboard').should('be.visible');
  });
});

Cypress.Commands.add('loginAsStudent', () => {
  cy.session('student', () => {
    cy.visit('/login');
    cy.getBySel('username-input').type(Cypress.env('studentUsername'));
    cy.getBySel('password-input').type(Cypress.env('studentPassword'));
    cy.getBySel('login-button').click();
    cy.url().should('include', '/student/dashboard');
    cy.getBySel('student-dashboard').should('be.visible');
  });
});

Cypress.Commands.add('logout', () => {
  cy.getBySel('user-menu').click();
  cy.getBySel('logout-button').click();
  cy.url().should('include', '/login');
});

// Navigation commands
Cypress.Commands.add('navigateToUserManagement', () => {
  cy.getBySel('sidebar-menu-users').click();
  cy.url().should('include', '/admin/users');
  cy.getBySel('user-management-table').should('be.visible');
});

Cypress.Commands.add('navigateToCourseManagement', () => {
  cy.getBySel('sidebar-menu-courses').click();
  cy.url().should('include', '/admin/courses');
  cy.getBySel('course-management-grid').should('be.visible');
});

Cypress.Commands.add('navigateToQuizManagement', () => {
  cy.getBySel('sidebar-menu-quizzes').click();
  cy.url().should('include', '/admin/quizzes');
  cy.getBySel('quiz-management-table').should('be.visible');
});

// Data creation commands
Cypress.Commands.add('createTestUser', (userData: any) => {
  cy.getBySel('create-user-button').click();
  cy.getBySel('user-edit-modal').should('be.visible');

  cy.getBySel('username-input').type(userData.username);
  cy.getBySel('email-input').type(userData.email);
  cy.getBySel('fullName-input').type(userData.fullName);
  cy.getBySel('role-select').select(userData.role);

  if (userData.isActive !== undefined) {
    if (userData.isActive) {
      cy.getBySel('active-checkbox').check();
    } else {
      cy.getBySel('active-checkbox').uncheck();
    }
  }

  cy.getBySel('save-user-button').click();
  cy.getBySel('user-edit-modal').should('not.exist');
});

Cypress.Commands.add('createTestCourse', (courseData: any) => {
  cy.getBySel('create-course-button').click();
  cy.getBySel('course-edit-modal').should('be.visible');

  cy.getBySel('course-title-input').type(courseData.title);
  cy.getBySel('course-description-input').type(courseData.description);
  cy.getBySel('course-code-input').type(courseData.courseCode);

  if (courseData.lessons && courseData.lessons.length > 0) {
    courseData.lessons.forEach((lesson: any, index: number) => {
      cy.getBySel('add-lesson-button').click();
      cy.getBySel(`lesson-title-input-${index}`).type(lesson.title);
      cy.getBySel(`lesson-content-input-${index}`).type(lesson.content);

      if (lesson.videoUrl) {
        cy.getBySel(`lesson-video-input-${index}`).type(lesson.videoUrl);
      }
    });
  }

  cy.getBySel('save-course-button').click();
  cy.getBySel('course-edit-modal').should('not.exist');
});

Cypress.Commands.add('createTestQuiz', (quizData: any) => {
  cy.getBySel('create-quiz-button').click();
  cy.getBySel('quiz-builder').should('be.visible');

  cy.getBySel('quiz-title-input').type(quizData.title);
  cy.getBySel('quiz-description-input').type(quizData.description);
  cy.getBySel('quiz-type-select').select(quizData.quizType);

  if (quizData.questions && quizData.questions.length > 0) {
    quizData.questions.forEach((question: any) => {
      cy.getBySel('add-question-button').click();
      cy.getBySel('question-content-input').type(question.content);
      cy.getBySel('question-type-select').select(question.type);
      cy.getBySel('correct-answer-input').type(question.correctAnswer);

      if (question.options && question.options.length > 0) {
        question.options.forEach((option: string, index: number) => {
          cy.getBySel(`option-${index}-input`).type(option);
        });
      }

      cy.getBySel('save-question-button').click();
    });
  }

  cy.getBySel('save-quiz-button').click();
  cy.getBySel('quiz-builder').should('not.exist');
});

// Utility commands
Cypress.Commands.add('waitForTableToLoad', (tableSelector: string) => {
  cy.getBySel(tableSelector).should('be.visible');
  cy.getBySel('table-loading').should('not.exist');
  cy.getBySel('skeleton-loader').should('not.exist');
});

Cypress.Commands.add('searchInTable', (searchTerm: string) => {
  cy.getBySel('search-input').clear().type(searchTerm);
  cy.getBySel('search-button').click();
  cy.waitForTableToLoad('data-table');
});

Cypress.Commands.add('selectTableRows', (rowIndices: number[]) => {
  rowIndices.forEach(index => {
    cy.getBySel(`table-row-${index}`).find('input[type="checkbox"]').check();
  });
});

Cypress.Commands.add('performBulkAction', (action: string) => {
  cy.getBySel(`bulk-${action}-button`).click();
  cy.getBySel('confirm-bulk-action-button').click();
  cy.getBySel('bulk-action-success').should('be.visible');
});

// File upload commands
Cypress.Commands.add('uploadFile', (selector: string, fileName: string, fileType: string) => {
  cy.fixture(fileName, 'base64').then(fileContent => {
    cy.getBySel(selector).selectFile({
      contents: Cypress.Buffer.from(fileContent, 'base64'),
      fileName,
      mimeType: fileType,
    });
  });
});

// API commands
Cypress.Commands.add('apiLogin', (username: string, password: string) => {
  return cy
    .request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/authenticate`,
      body: {
        username,
        password,
        rememberMe: false,
      },
    })
    .then(response => {
      expect(response.status).to.eq(200);
      return response.body.id_token;
    });
});

Cypress.Commands.add('apiCreateUser', (userData: any, token: string) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/admin/users`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: userData,
  });
});

Cypress.Commands.add('apiDeleteUser', (userId: string, token: string) => {
  return cy.request({
    method: 'DELETE',
    url: `${Cypress.env('apiUrl')}/admin/users/${userId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
});

// Performance testing commands
Cypress.Commands.add('measurePageLoad', (pageName: string) => {
  cy.window().then(win => {
    const startTime = win.performance.now();

    cy.then(() => {
      const endTime = win.performance.now();
      const loadTime = endTime - startTime;

      cy.task('log', `${pageName} load time: ${loadTime.toFixed(2)}ms`);

      // Assert reasonable load time (adjust threshold as needed)
      expect(loadTime).to.be.lessThan(3000);
    });
  });
});

// Accessibility testing commands
Cypress.Commands.add('checkAccessibility', (context?: string) => {
  cy.checkA11y(context, {
    rules: {
      'color-contrast': { enabled: true },
      'keyboard-navigation': { enabled: true },
      'focus-management': { enabled: true },
    },
  });
});

// Declare custom commands for TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      // Authentication
      loginAsAdmin(): Chainable<void>;
      loginAsTeacher(): Chainable<void>;
      loginAsStudent(): Chainable<void>;
      logout(): Chainable<void>;

      // Navigation
      navigateToUserManagement(): Chainable<void>;
      navigateToCourseManagement(): Chainable<void>;
      navigateToQuizManagement(): Chainable<void>;

      // Data creation
      createTestUser(userData: any): Chainable<void>;
      createTestCourse(courseData: any): Chainable<void>;
      createTestQuiz(quizData: any): Chainable<void>;

      // Utilities
      waitForTableToLoad(tableSelector: string): Chainable<void>;
      searchInTable(searchTerm: string): Chainable<void>;
      selectTableRows(rowIndices: number[]): Chainable<void>;
      performBulkAction(action: string): Chainable<void>;
      uploadFile(selector: string, fileName: string, fileType: string): Chainable<void>;

      // API
      apiLogin(username: string, password: string): Chainable<string>;
      apiCreateUser(userData: any, token: string): Chainable<any>;
      apiDeleteUser(userId: string, token: string): Chainable<any>;

      // Performance
      measurePageLoad(pageName: string): Chainable<void>;

      // Accessibility
      checkAccessibility(context?: string): Chainable<void>;
    }
  }
}
