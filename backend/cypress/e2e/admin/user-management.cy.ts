describe('Admin User Management E2E Tests', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/admin/users');
  });

  describe('User Management Workflow', () => {
    it('should complete full user management workflow', () => {
      // Measure page load performance
      cy.measurePageLoad('User Management');

      // Verify page loads correctly
      cy.getBySel('user-management-table').should('be.visible');
      cy.waitForTableToLoad('user-management-table');

      // Test search functionality
      cy.searchInTable('admin');
      cy.getBySel('user-management-table').should('contain', 'admin');

      // Clear search
      cy.getBySel('search-input').clear();
      cy.getBySel('search-button').click();

      // Test user creation
      const newUser = {
        username: `testuser_${Date.now()}`,
        email: `testuser_${Date.now()}@example.com`,
        fullName: 'Test User E2E',
        role: 'HOC_VIEN',
        isActive: true,
      };

      cy.createTestUser(newUser);

      // Verify user was created
      cy.searchInTable(newUser.username);
      cy.getBySel('user-management-table').should('contain', newUser.fullName);
      cy.getBySel('user-management-table').should('contain', newUser.email);

      // Test user editing
      cy.getBySelLike('edit-user-button').first().click();
      cy.getBySel('user-edit-modal').should('be.visible');

      const updatedName = 'Updated Test User';
      cy.getBySel('fullName-input').clear().type(updatedName);
      cy.getBySel('save-user-button').click();

      // Verify user was updated
      cy.getBySel('user-edit-modal').should('not.exist');
      cy.getBySel('user-management-table').should('contain', updatedName);

      // Test role filtering
      cy.getBySel('role-filter').select('HOC_VIEN');
      cy.waitForTableToLoad('user-management-table');
      cy.getBySel('user-management-table').should('contain', updatedName);

      // Test status filtering
      cy.getBySel('status-filter').select('active');
      cy.waitForTableToLoad('user-management-table');

      // Test bulk operations
      cy.selectTableRows([0, 1]);
      cy.getBySel('bulk-actions-toolbar').should('be.visible');
      cy.getBySel('selected-count').should('contain', '2');

      // Test bulk deactivation
      cy.performBulkAction('deactivate');

      // Test user deletion
      cy.searchInTable(newUser.username);
      cy.getBySelLike('delete-user-button').first().click();
      cy.getBySel('confirm-delete-modal').should('be.visible');
      cy.getBySel('confirm-delete-button').click();

      // Verify user was deleted
      cy.getBySel('confirm-delete-modal').should('not.exist');
      cy.searchInTable(newUser.username);
      cy.getBySel('empty-state').should('be.visible');

      // Check accessibility
      cy.checkAccessibility();
    });

    it('should handle CSV import/export workflow', () => {
      // Test CSV export
      cy.getBySel('export-users-button').click();
      cy.getBySel('csv-export-modal').should('be.visible');

      cy.getBySel('export-format-select').select('csv');
      cy.getBySel('include-inactive-checkbox').check();
      cy.getBySel('confirm-export-button').click();

      // Verify download initiated
      cy.getBySel('export-success-message').should('be.visible');

      // Test CSV import
      cy.getBySel('import-users-button').click();
      cy.getBySel('csv-import-modal').should('be.visible');

      // Upload test CSV file
      cy.uploadFile('csv-file-input', 'test-users.csv', 'text/csv');
      cy.getBySel('file-preview').should('be.visible');

      // Validate import data
      cy.getBySel('validate-import-button').click();
      cy.getBySel('validation-results').should('be.visible');
      cy.getBySel('valid-records-count').should('contain', '3');

      // Confirm import
      cy.getBySel('confirm-import-button').click();
      cy.getBySel('import-progress').should('be.visible');

      // Verify import completed
      cy.getBySel('import-success-message').should('be.visible');
      cy.getBySel('csv-import-modal').should('not.exist');

      // Verify imported users appear in table
      cy.waitForTableToLoad('user-management-table');
      cy.getBySel('user-management-table').should('contain', 'Imported User 1');
    });

    it('should handle error scenarios gracefully', () => {
      // Test network error handling
      cy.intercept('GET', '/api/admin/users*', { forceNetworkError: true }).as('networkError');
      cy.reload();

      cy.getBySel('error-message').should('be.visible');
      cy.getBySel('retry-button').should('be.visible');

      // Test retry functionality
      cy.intercept('GET', '/api/admin/users*', { fixture: 'users.json' }).as('retrySuccess');
      cy.getBySel('retry-button').click();

      cy.wait('@retrySuccess');
      cy.getBySel('user-management-table').should('be.visible');

      // Test validation errors
      cy.getBySel('create-user-button').click();
      cy.getBySel('save-user-button').click(); // Save without filling required fields

      cy.getBySel('username-error').should('contain', 'Username is required');
      cy.getBySel('email-error').should('contain', 'Email is required');
      cy.getBySel('fullName-error').should('contain', 'Full name is required');

      // Test duplicate email error
      cy.intercept('POST', '/api/admin/users', {
        statusCode: 400,
        body: { message: 'Email already exists' },
      }).as('duplicateEmail');

      cy.getBySel('username-input').type('testuser');
      cy.getBySel('email-input').type('existing@example.com');
      cy.getBySel('fullName-input').type('Test User');
      cy.getBySel('role-select').select('HOC_VIEN');
      cy.getBySel('save-user-button').click();

      cy.wait('@duplicateEmail');
      cy.getBySel('email-error').should('contain', 'Email already exists');
    });
  });

  describe('Performance and Accessibility', () => {
    it('should handle large datasets efficiently', () => {
      // Mock large dataset
      cy.intercept('GET', '/api/admin/users*', { fixture: 'large-user-dataset.json' }).as('largeDataset');
      cy.reload();

      cy.wait('@largeDataset');
      cy.measurePageLoad('Large Dataset');

      // Test virtual scrolling
      cy.getBySel('user-management-table').should('be.visible');
      cy.getBySel('virtual-scroll-container').should('be.visible');

      // Test pagination
      cy.getBySel('pagination-info').should('contain', 'of 1000');
      cy.getBySel('next-page-button').click();
      cy.waitForTableToLoad('user-management-table');

      // Test search performance with large dataset
      const startTime = Date.now();
      cy.searchInTable('user500');
      cy.waitForTableToLoad('user-management-table');

      cy.then(() => {
        const searchTime = Date.now() - startTime;
        expect(searchTime).to.be.lessThan(2000); // Search should complete within 2 seconds
      });
    });

    it('should be fully accessible', () => {
      // Test keyboard navigation
      cy.getBySel('search-input').focus();
      cy.realPress('Tab');
      cy.getBySel('role-filter').should('have.focus');

      cy.realPress('Tab');
      cy.getBySel('status-filter').should('have.focus');

      cy.realPress('Tab');
      cy.getBySel('create-user-button').should('have.focus');

      // Test screen reader support
      cy.getBySel('user-management-table').should('have.attr', 'role', 'table');
      cy.getBySel('user-management-table')
        .find('th')
        .each($th => {
          cy.wrap($th).should('have.attr', 'scope', 'col');
        });

      // Test ARIA labels
      cy.getBySel('search-input').should('have.attr', 'aria-label');
      cy.getBySel('create-user-button').should('have.attr', 'aria-label');

      // Comprehensive accessibility check
      cy.checkAccessibility();
    });

    it('should work across different browsers and devices', () => {
      // Test responsive design
      cy.viewport('iphone-x');
      cy.getBySel('user-management-table').should('be.visible');
      cy.getBySel('mobile-menu-toggle').should('be.visible');

      cy.viewport('ipad-2');
      cy.getBySel('user-management-table').should('be.visible');

      cy.viewport(1920, 1080);
      cy.getBySel('user-management-table').should('be.visible');

      // Test touch interactions on mobile
      cy.viewport('iphone-x');
      cy.getBySel('create-user-button').click();
      cy.getBySel('user-edit-modal').should('be.visible');

      // Test swipe gestures for table navigation
      cy.getBySel('user-management-table').swipe('left');
      cy.getBySel('table-scroll-indicator').should('be.visible');
    });
  });

  describe('Real-time Updates', () => {
    it('should handle real-time user updates', () => {
      // Simulate WebSocket connection
      cy.window().then(win => {
        // Mock WebSocket events
        const mockUserUpdate = {
          type: 'USER_UPDATED',
          data: {
            id: 'user-123',
            fullName: 'Updated via WebSocket',
            isActive: false,
          },
        };

        // Trigger WebSocket event
        win.dispatchEvent(
          new CustomEvent('websocket-message', {
            detail: mockUserUpdate,
          }),
        );
      });

      // Verify UI updates in real-time
      cy.getBySel('user-management-table').should('contain', 'Updated via WebSocket');
      cy.getBySel('real-time-indicator').should('have.class', 'connected');

      // Test notification for real-time updates
      cy.getBySel('notification-toast').should('be.visible');
      cy.getBySel('notification-toast').should('contain', 'User updated');
    });
  });
});
