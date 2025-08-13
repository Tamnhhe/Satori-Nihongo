# Accessibility Guide - Satori Design System

This document outlines the comprehensive accessibility features implemented in the Satori Design System to ensure WCAG 2.1 AA compliance and provide an inclusive user experience for all users.

## Table of Contents

1. [Overview](#overview)
2. [Accessibility Features](#accessibility-features)
3. [Components](#components)
4. [Keyboard Navigation](#keyboard-navigation)
5. [Screen Reader Support](#screen-reader-support)
6. [High Contrast Mode](#high-contrast-mode)
7. [Focus Management](#focus-management)
8. [ARIA Implementation](#aria-implementation)
9. [Testing](#testing)
10. [Best Practices](#best-practices)

## Overview

The Satori Design System implements comprehensive accessibility features to ensure that all users, including those with disabilities, can effectively use the admin and teacher interfaces. Our accessibility implementation follows WCAG 2.1 AA guidelines and includes:

- **Keyboard Navigation**: Full keyboard accessibility for all interactive elements
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **High Contrast Mode**: Enhanced visual contrast for better visibility
- **Focus Management**: Clear focus indicators and focus trapping
- **Touch Accessibility**: Minimum touch target sizes for mobile devices
- **Motion Preferences**: Respect for reduced motion preferences

## Accessibility Features

### 1. Enhanced Focus Management

```typescript
import { useFocusManagement, useFocusTrap } from '@/shared/design-system';

// Automatic keyboard navigation detection
const { isKeyboardNavigation } = useFocusManagement();

// Focus trapping for modals and dropdowns
const focusTrapRef = useFocusTrap(isActive);
```

**Features:**

- Automatic detection of keyboard vs mouse navigation
- Focus trapping for modal dialogs and dropdowns
- Skip links for quick navigation
- Focus restoration after modal close

### 2. Screen Reader Support

```typescript
import { useScreenReader, LiveRegion } from '@/shared/design-system';

// Programmatic announcements
const { announce } = useScreenReader();
announce('Form saved successfully', 'polite');

// Live regions for dynamic content
<LiveRegion message="Loading complete" priority="polite" />
```

**Features:**

- Live regions for dynamic content announcements
- Proper ARIA labels and descriptions
- Semantic HTML structure
- Screen reader only content with `.sr-only` class

### 3. High Contrast Mode

```typescript
import { useHighContrast } from '@/shared/design-system';

const { isHighContrast, toggleHighContrast } = useHighContrast();
```

**Features:**

- Automatic detection of system high contrast preference
- Manual toggle for high contrast mode
- Enhanced color contrast ratios (4.5:1 minimum)
- High contrast specific styling

### 4. Keyboard Navigation

All interactive elements support comprehensive keyboard navigation:

- **Tab**: Navigate between focusable elements
- **Shift + Tab**: Navigate backwards
- **Enter/Space**: Activate buttons and links
- **Arrow Keys**: Navigate within menus and lists
- **Escape**: Close modals and dropdowns
- **Home/End**: Navigate to first/last items in lists

### 5. Touch Accessibility

- Minimum touch target size of 44x44 pixels
- Enhanced touch targets on mobile devices
- Proper spacing between interactive elements

## Components

### Button Component

```typescript
<Button
  aria-label="Save document"
  aria-describedby="save-help"
  aria-pressed={isSaved}
  onClick={handleSave}
>
  Save
</Button>
```

**Accessibility Features:**

- Proper ARIA attributes
- Keyboard navigation support
- Loading state announcements
- Disabled state handling

### Input Component

```typescript
<Input
  label="Email Address"
  required
  error={emailError}
  helperText="Enter your work email"
  aria-describedby="email-help"
/>
```

**Accessibility Features:**

- Associated labels
- Error message announcements
- Required field indicators
- Proper ARIA attributes

### Modal Component

```typescript
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <ModalHeader id="modal-title">
    <h2>Confirm Action</h2>
  </ModalHeader>
  <ModalBody id="modal-description">
    <p>Are you sure you want to delete this item?</p>
  </ModalBody>
</Modal>
```

**Accessibility Features:**

- Focus trapping
- Focus restoration
- Keyboard navigation
- Proper ARIA attributes
- Background scroll prevention

### Sidebar Navigation

```typescript
<Sidebar
  items={navigationItems}
  collapsed={isCollapsed}
  onToggleCollapse={handleToggle}
/>
```

**Accessibility Features:**

- Tree navigation with arrow keys
- Proper ARIA roles and states
- Keyboard shortcuts
- Screen reader announcements

## Keyboard Navigation

### Global Shortcuts

- **Alt + M**: Skip to main content
- **Alt + N**: Skip to navigation
- **Tab**: Next focusable element
- **Shift + Tab**: Previous focusable element
- **Escape**: Close current modal/dropdown

### Component-Specific Navigation

#### Sidebar Navigation

- **Arrow Up/Down**: Navigate between items
- **Arrow Right**: Expand collapsed item
- **Arrow Left**: Collapse expanded item
- **Enter**: Activate item
- **Home**: First item
- **End**: Last item

#### Data Tables

- **Arrow Keys**: Navigate between cells
- **Enter**: Edit cell (if editable)
- **Escape**: Cancel edit
- **Tab**: Next column
- **Shift + Tab**: Previous column

#### Form Elements

- **Tab**: Next field
- **Shift + Tab**: Previous field
- **Enter**: Submit form (on submit button)
- **Escape**: Clear field (if applicable)

## Screen Reader Support

### ARIA Labels and Descriptions

```typescript
// Descriptive labels
<button aria-label="Close dialog">×</button>

// Associated descriptions
<input
  aria-describedby="password-help"
  type="password"
/>
<div id="password-help">
  Password must be at least 8 characters
</div>
```

### Live Regions

```typescript
// Polite announcements (non-interrupting)
<div aria-live="polite" aria-atomic="true">
  Form saved successfully
</div>

// Assertive announcements (interrupting)
<div aria-live="assertive" aria-atomic="true">
  Error: Please fix the required fields
</div>
```

### Semantic HTML

```html
<!-- Proper heading hierarchy -->
<h1>Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>

<!-- Semantic landmarks -->
<header role="banner">
  <nav role="navigation">
    <main role="main">
      <aside role="complementary">
        <footer role="contentinfo"></footer>
      </aside>
    </main>
  </nav>
</header>
```

## High Contrast Mode

### Automatic Detection

```scss
@media (prefers-contrast: high) {
  .component {
    border: 2px solid black;
    background: white;
    color: black;
  }
}
```

### Manual Toggle

```typescript
const { isHighContrast, toggleHighContrast } = useHighContrast();

// Toggle high contrast mode
<button onClick={toggleHighContrast}>
  {isHighContrast ? 'Disable' : 'Enable'} High Contrast
</button>
```

### High Contrast Styles

- **Text Contrast**: Minimum 7:1 ratio for AAA compliance
- **Border Enhancement**: 2px borders for better definition
- **Focus Indicators**: 3px focus outlines
- **Color Independence**: No information conveyed by color alone

## Focus Management

### Focus Indicators

```scss
// Enhanced focus styles
.focus-visible {
  outline: 2px solid #0ea5e9;
  outline-offset: 2px;
  border-radius: 2px;
}

// High contrast focus
@media (prefers-contrast: high) {
  .focus-visible {
    outline: 3px solid black;
    background: white;
  }
}
```

### Focus Trapping

```typescript
// Modal focus trap
const FocusTrappedModal = ({ isOpen, onClose, children }) => {
  const focusTrapRef = useFocusTrap(isOpen);

  return (
    <div ref={focusTrapRef} role="dialog" aria-modal="true">
      {children}
    </div>
  );
};
```

### Skip Links

```html
<div class="skip-links">
  <a href="#main-content" class="skip-link"> Skip to main content </a>
  <a href="#main-navigation" class="skip-link"> Skip to navigation </a>
</div>
```

## ARIA Implementation

### States and Properties

```typescript
// Dynamic ARIA states
<button
  aria-expanded={isExpanded}
  aria-controls="submenu"
  aria-haspopup="true"
>
  Menu
</button>

// Form validation
<input
  aria-invalid={hasError}
  aria-describedby="error-message"
  aria-required="true"
/>

// Current page indicator
<a
  href="/dashboard"
  aria-current="page"
>
  Dashboard
</a>
```

### Roles

```typescript
// Custom roles for complex widgets
<div role="tablist">
  <button role="tab" aria-selected="true">Tab 1</button>
  <button role="tab" aria-selected="false">Tab 2</button>
</div>

<div role="tabpanel">
  Tab content
</div>
```

## Testing

### Automated Testing

```typescript
// Accessibility testing with axe-core
import { validateAccessibility } from '@/shared/design-system';

const issues = validateAccessibility(document.body);
console.log('Accessibility issues:', issues);
```

### Manual Testing Checklist

#### Keyboard Navigation

- [ ] All interactive elements are focusable
- [ ] Focus order is logical
- [ ] Focus indicators are visible
- [ ] No keyboard traps (except intentional)

#### Screen Reader Testing

- [ ] All content is announced correctly
- [ ] Form labels are associated
- [ ] Error messages are announced
- [ ] Dynamic content updates are announced

#### Visual Testing

- [ ] Text contrast meets WCAG AA standards
- [ ] Focus indicators are visible
- [ ] Content is readable at 200% zoom
- [ ] High contrast mode works correctly

#### Touch Testing

- [ ] Touch targets are at least 44x44 pixels
- [ ] Adequate spacing between targets
- [ ] Touch interactions work correctly

### Testing Tools

1. **axe-core**: Automated accessibility testing
2. **WAVE**: Web accessibility evaluation
3. **Lighthouse**: Accessibility audit
4. **Screen Readers**: NVDA, JAWS, VoiceOver
5. **Keyboard Only**: Test without mouse

## Best Practices

### Development Guidelines

1. **Semantic HTML First**: Use proper HTML elements before adding ARIA
2. **Progressive Enhancement**: Ensure basic functionality without JavaScript
3. **Keyboard First**: Design for keyboard navigation from the start
4. **Test Early**: Include accessibility testing in development workflow
5. **User Testing**: Test with actual users with disabilities

### Content Guidelines

1. **Clear Language**: Use simple, clear language
2. **Descriptive Links**: Avoid "click here" or "read more"
3. **Alt Text**: Provide meaningful alt text for images
4. **Headings**: Use proper heading hierarchy
5. **Error Messages**: Provide clear, actionable error messages

### Design Guidelines

1. **Color Contrast**: Ensure sufficient contrast ratios
2. **Focus Indicators**: Design visible focus states
3. **Touch Targets**: Minimum 44x44 pixel targets
4. **Spacing**: Adequate spacing between interactive elements
5. **Motion**: Respect reduced motion preferences

### Code Examples

#### Accessible Form

```typescript
<form onSubmit={handleSubmit}>
  <fieldset>
    <legend>User Information</legend>

    <Input
      id="email"
      label="Email Address"
      type="email"
      required
      error={errors.email}
      helperText="We'll never share your email"
      aria-describedby="email-help"
    />

    <Input
      id="password"
      label="Password"
      type="password"
      required
      error={errors.password}
      helperText="Must be at least 8 characters"
      aria-describedby="password-help"
    />

    <Button type="submit" loading={isSubmitting}>
      {isSubmitting ? 'Creating Account...' : 'Create Account'}
    </Button>
  </fieldset>
</form>
```

#### Accessible Data Table

```typescript
<table className="table-accessible">
  <caption>User Management - 150 users total</caption>
  <thead>
    <tr>
      <th scope="col" aria-sort="ascending">
        Name
      </th>
      <th scope="col" aria-sort="none">
        Email
      </th>
      <th scope="col" aria-sort="none">
        Role
      </th>
      <th scope="col">
        <span className="sr-only">Actions</span>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>john@example.com</td>
      <td>Admin</td>
      <td>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Edit John Doe"
        >
          Edit
        </Button>
      </td>
    </tr>
  </tbody>
</table>
```

## Conclusion

The Satori Design System provides comprehensive accessibility features that ensure all users can effectively interact with the admin and teacher interfaces. By following WCAG 2.1 AA guidelines and implementing modern accessibility best practices, we create an inclusive experience that works for everyone.

For questions or suggestions regarding accessibility, please refer to the development team or accessibility specialist.
