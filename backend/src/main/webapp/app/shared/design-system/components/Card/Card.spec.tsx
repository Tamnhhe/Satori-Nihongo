import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Card } from './Card';

expect.extend(toHaveNoViolations);

describe('Card Component', () => {
  it('should render with default props', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>,
    );

    const card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('card');
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should render with title', () => {
    render(
      <Card title="Test Card">
        <p>Card content</p>
      </Card>,
    );

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByTestId('card-header')).toBeInTheDocument();
  });

  it('should render with actions', () => {
    const actions = [<button key="edit">Edit</button>, <button key="delete">Delete</button>];

    render(
      <Card title="Test Card" actions={actions}>
        <p>Card content</p>
      </Card>,
    );

    expect(screen.getByTestId('card-actions')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('should apply different variants', () => {
    const { rerender } = render(<Card variant="elevated">Content</Card>);
    expect(screen.getByTestId('card')).toHaveClass('card-elevated');

    rerender(<Card variant="outlined">Content</Card>);
    expect(screen.getByTestId('card')).toHaveClass('card-outlined');

    rerender(<Card variant="filled">Content</Card>);
    expect(screen.getByTestId('card')).toHaveClass('card-filled');
  });

  it('should handle loading state', () => {
    render(
      <Card loading>
        <p>Content</p>
      </Card>,
    );

    expect(screen.getByTestId('card-skeleton')).toBeInTheDocument();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('should handle hover effects', () => {
    render(
      <Card hoverable>
        <p>Hoverable content</p>
      </Card>,
    );

    expect(screen.getByTestId('card')).toHaveClass('card-hoverable');
  });

  it('should render with custom className', () => {
    render(
      <Card className="custom-card">
        <p>Content</p>
      </Card>,
    );

    expect(screen.getByTestId('card')).toHaveClass('card', 'custom-card');
  });

  it('should render footer when provided', () => {
    render(
      <Card footer={<div>Footer content</div>}>
        <p>Main content</p>
      </Card>,
    );

    expect(screen.getByTestId('card-footer')).toBeInTheDocument();
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('should be accessible', async () => {
    const { container } = render(
      <Card title="Accessible Card" role="article" aria-labelledby="card-title">
        <p>This is accessible content</p>
      </Card>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should support keyboard navigation when interactive', () => {
    const handleClick = jest.fn();
    render(
      <Card onClick={handleClick} tabIndex={0}>
        <p>Interactive card</p>
      </Card>,
    );

    const card = screen.getByTestId('card');
    expect(card).toHaveAttribute('tabIndex', '0');
    expect(card).toHaveClass('card-interactive');
  });

  it('should match snapshot', () => {
    const { container } = render(
      <div>
        <Card title="Basic Card">
          <p>Basic content</p>
        </Card>
        <Card title="Advanced Card" variant="elevated" actions={[<button key="action">Action</button>]} footer={<span>Footer</span>}>
          <p>Advanced content</p>
        </Card>
        <Card loading />
      </div>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
