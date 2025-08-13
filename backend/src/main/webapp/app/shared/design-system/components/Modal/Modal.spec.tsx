import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Modal } from './Modal';

expect.extend(toHaveNoViolations);

describe('Modal Component', () => {
  it('should render when open', () => {
    render(
      <Modal isOpen title="Test Modal">
        <p>Modal content</p>
      </Modal>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <Modal isOpen={false} title="Test Modal">
        <p>Modal content</p>
      </Modal>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const handleClose = jest.fn();
    const user = userEvent.setup();

    render(
      <Modal isOpen onClose={handleClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>,
    );

    const closeButton = screen.getByTestId('modal-close-button');
    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when overlay is clicked', async () => {
    const handleClose = jest.fn();
    const user = userEvent.setup();

    render(
      <Modal isOpen onClose={handleClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>,
    );

    const overlay = screen.getByTestId('modal-overlay');
    await user.click(overlay);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should not close when clicking inside modal content', async () => {
    const handleClose = jest.fn();
    const user = userEvent.setup();

    render(
      <Modal isOpen onClose={handleClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>,
    );

    const modalContent = screen.getByText('Modal content');
    await user.click(modalContent);

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('should handle different sizes', () => {
    const { rerender } = render(
      <Modal isOpen size="small" title="Small Modal">
        Content
      </Modal>,
    );
    expect(screen.getByTestId('modal-dialog')).toHaveClass('modal-sm');

    rerender(
      <Modal isOpen size="large" title="Large Modal">
        Content
      </Modal>,
    );
    expect(screen.getByTestId('modal-dialog')).toHaveClass('modal-lg');

    rerender(
      <Modal isOpen size="fullscreen" title="Fullscreen Modal">
        Content
      </Modal>,
    );
    expect(screen.getByTestId('modal-dialog')).toHaveClass('modal-fullscreen');
  });

  it('should render footer when provided', () => {
    const footer = (
      <div>
        <button>Cancel</button>
        <button>Save</button>
      </div>
    );

    render(
      <Modal isOpen title="Modal with Footer" footer={footer}>
        <p>Content</p>
      </Modal>,
    );

    expect(screen.getByTestId('modal-footer')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    render(
      <Modal isOpen loading title="Loading Modal">
        <p>Content</p>
      </Modal>,
    );

    expect(screen.getByTestId('modal-loading')).toBeInTheDocument();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('should close on Escape key press', async () => {
    const handleClose = jest.fn();
    const user = userEvent.setup();

    render(
      <Modal isOpen onClose={handleClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>,
    );

    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should trap focus within modal', async () => {
    const user = userEvent.setup();

    render(
      <Modal isOpen title="Focus Trap Modal">
        <input placeholder="First input" />
        <input placeholder="Second input" />
        <button>Button</button>
      </Modal>,
    );

    const firstInput = screen.getByPlaceholderText('First input');
    const secondInput = screen.getByPlaceholderText('Second input');
    const button = screen.getByRole('button', { name: /button/i });
    const closeButton = screen.getByTestId('modal-close-button');

    // Focus should start on the first focusable element
    expect(firstInput).toHaveFocus();

    // Tab through elements
    await user.tab();
    expect(secondInput).toHaveFocus();

    await user.tab();
    expect(button).toHaveFocus();

    await user.tab();
    expect(closeButton).toHaveFocus();

    // Should wrap back to first element
    await user.tab();
    expect(firstInput).toHaveFocus();
  });

  it('should prevent body scroll when open', () => {
    render(
      <Modal isOpen title="Test Modal">
        <p>Content</p>
      </Modal>,
    );

    expect(document.body).toHaveClass('modal-open');
  });

  it('should restore body scroll when closed', () => {
    const { rerender } = render(
      <Modal isOpen title="Test Modal">
        <p>Content</p>
      </Modal>,
    );

    expect(document.body).toHaveClass('modal-open');

    rerender(
      <Modal isOpen={false} title="Test Modal">
        <p>Content</p>
      </Modal>,
    );

    expect(document.body).not.toHaveClass('modal-open');
  });

  it('should be accessible', async () => {
    const { container } = render(
      <Modal isOpen title="Accessible Modal" aria-describedby="modal-description">
        <p id="modal-description">This modal is accessible</p>
      </Modal>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes', () => {
    render(
      <Modal isOpen title="ARIA Modal" aria-labelledby="modal-title" aria-describedby="modal-desc">
        <p id="modal-desc">Modal description</p>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-describedby');
  });

  it('should match snapshot', () => {
    const { container } = render(
      <div>
        <Modal isOpen title="Basic Modal">
          <p>Basic content</p>
        </Modal>
        <Modal isOpen title="Advanced Modal" size="large" footer={<button>Action</button>}>
          <p>Advanced content</p>
        </Modal>
      </div>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
