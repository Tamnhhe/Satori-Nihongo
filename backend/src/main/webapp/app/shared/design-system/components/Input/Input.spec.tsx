import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Input } from './Input';

expect.extend(toHaveNoViolations);

describe('Input Component', () => {
  it('should render with default props', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('form-control');
  });

  it('should render with label', () => {
    render(<Input label="Username" placeholder="Enter username" />);

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('should handle different input types', () => {
    const { rerender } = render(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" />);
    expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password');

    rerender(<Input type="number" />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number');
  });

  it('should handle value changes', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');

    await user.type(input, 'test value');
    expect(handleChange).toHaveBeenCalledTimes(10); // 'test value' has 10 characters
    expect(input).toHaveValue('test value');
  });

  it('should show validation states', () => {
    const { rerender } = render(<Input error="This field is required" placeholder="Error state" />);

    expect(screen.getByPlaceholderText('Error state')).toHaveClass('is-invalid');
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByTestId('error-message')).toHaveClass('invalid-feedback');

    rerender(<Input success="Valid input" placeholder="Success state" />);

    expect(screen.getByPlaceholderText('Success state')).toHaveClass('is-valid');
    expect(screen.getByText('Valid input')).toBeInTheDocument();
  });

  it('should handle disabled state', () => {
    render(<Input disabled placeholder="Disabled input" />);
    const input = screen.getByPlaceholderText('Disabled input');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('form-control-disabled');
  });

  it('should render with prefix and suffix', () => {
    render(<Input prefix="$" suffix=".00" placeholder="Amount" />);

    expect(screen.getByTestId('input-prefix')).toHaveTextContent('$');
    expect(screen.getByTestId('input-suffix')).toHaveTextContent('.00');
  });

  it('should render with icon', () => {
    render(<Input icon="search" placeholder="Search..." />);
    expect(screen.getByTestId('input-icon')).toBeInTheDocument();
  });

  it('should handle different sizes', () => {
    const { rerender } = render(<Input size="small" />);
    expect(screen.getByRole('textbox')).toHaveClass('form-control-sm');

    rerender(<Input size="large" />);
    expect(screen.getByRole('textbox')).toHaveClass('form-control-lg');
  });

  it('should show character count when maxLength is provided', async () => {
    const user = userEvent.setup();
    render(<Input maxLength={10} showCount />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'test');

    expect(screen.getByTestId('character-count')).toHaveTextContent('4/10');
  });

  it('should handle focus and blur events', async () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    const user = userEvent.setup();

    render(<Input onFocus={handleFocus} onBlur={handleBlur} placeholder="Focus test" />);

    const input = screen.getByPlaceholderText('Focus test');

    await user.click(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);

    await user.tab();
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Keyboard test" />);

    const input = screen.getByPlaceholderText('Keyboard test');

    await user.tab();
    expect(input).toHaveFocus();

    await user.keyboard('Hello World');
    expect(input).toHaveValue('Hello World');
  });

  it('should be accessible', async () => {
    const { container } = render(<Input label="Accessible Input" placeholder="Enter value" aria-describedby="help-text" required />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes', () => {
    render(<Input label="Required Field" required error="This field is required" aria-describedby="error-message" />);

    const input = screen.getByLabelText('Required Field');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
  });

  it('should clear input when clear button is clicked', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(<Input clearable onChange={handleChange} defaultValue="test" />);

    const clearButton = screen.getByTestId('clear-button');
    await user.click(clearButton);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: '' }),
      }),
    );
  });

  it('should match snapshot', () => {
    const { container } = render(
      <div>
        <Input label="Basic Input" placeholder="Basic" />
        <Input label="Advanced Input" type="email" prefix="@" suffix=".com" error="Invalid email" required />
        <Input disabled placeholder="Disabled" />
        <Input loading placeholder="Loading" />
      </div>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
