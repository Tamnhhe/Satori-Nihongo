// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Import Cypress plugins
import 'cypress-axe';

// Global before hook
beforeEach(() => {
  // Inject axe-core for accessibility testing
  cy.injectAxe();

  // Set up viewport
  cy.viewport(1280, 720);

  // Clear cookies and local storage
  cy.clearCookies();
  cy.clearLocalStorage();

  // Intercept common API calls
  cy.intercept('GET', '/api/account', { fixture: 'account.json' }).as('getAccount');
  cy.intercept('GET', '/api/management/health', { fixture: 'health.json' }).as('getHealth');
});

// Global after hook
afterEach(() => {
  // Check for accessibility violations
  cy.checkA11y(null, null, violations => {
    if (violations.length > 0) {
      cy.task('log', `Accessibility violations found: ${violations.length}`);
      violations.forEach(violation => {
        cy.task('log', `${violation.id}: ${violation.description}`);
      });
    }
  });
});

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignore certain errors that don't affect functionality
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  if (err.message.includes('Non-Error promise rejection captured')) {
    return false;
  }
  return true;
});

// Custom Cypress configuration
Cypress.Commands.add('getBySel', (selector: string, ...args) => {
  return cy.get(`[data-testid="${selector}"]`, ...args);
});

Cypress.Commands.add('getBySelLike', (selector: string, ...args) => {
  return cy.get(`[data-testid*="${selector}"]`, ...args);
});

// Declare custom commands for TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      getBySel(selector: string, ...args: any[]): Chainable<JQuery<HTMLElement>>;
      getBySelLike(selector: string, ...args: any[]): Chainable<JQuery<HTMLElement>>;
    }
  }
}
