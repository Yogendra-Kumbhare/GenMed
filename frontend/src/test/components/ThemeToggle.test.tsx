/**
 * @file ThemeToggle.test.tsx
 * Component tests for the ThemeToggle component (compact and full variants).
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../../components/ThemeToggle';
import { ThemeProvider } from '../../contexts/ThemeContext';

// Wrap with ThemeProvider so useTheme() context is available.
function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('ThemeToggle — compact variant', () => {
  it('renders a button with an accessible aria-label', () => {
    renderWithTheme(<ThemeToggle variant="compact" />);
    const btn = screen.getByRole('button');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('aria-label');
  });

  it('shows the next theme in aria-label after clicking', () => {
    renderWithTheme(<ThemeToggle variant="compact" />);
    const btn = screen.getByRole('button');
    const initialLabel = btn.getAttribute('aria-label') ?? '';
    fireEvent.click(btn);
    const updatedLabel = btn.getAttribute('aria-label') ?? '';
    // The label should reflect the new "next" theme after cycling.
    expect(updatedLabel).not.toBe(initialLabel);
  });

  it('cycles through all three themes without throwing', () => {
    renderWithTheme(<ThemeToggle variant="compact" />);
    const btn = screen.getByRole('button');
    // Click 3 times to complete a full cycle — should not throw.
    expect(() => {
      fireEvent.click(btn);
      fireEvent.click(btn);
      fireEvent.click(btn);
    }).not.toThrow();
  });
});

describe('ThemeToggle — full variant', () => {
  it('renders three radio buttons for Light, System, and Dark', () => {
    renderWithTheme(<ThemeToggle variant="full" />);
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
  });

  it('has radiogroup role', () => {
    renderWithTheme(<ThemeToggle variant="full" />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('marks the active theme button as aria-checked=true', () => {
    renderWithTheme(<ThemeToggle variant="full" />);
    const buttons = screen.getAllByRole('radio');
    const checked = buttons.filter((b) => b.getAttribute('aria-checked') === 'true');
    expect(checked).toHaveLength(1);
  });

  it('clicking Dark makes Dark aria-checked=true', () => {
    renderWithTheme(<ThemeToggle variant="full" />);
    const darkBtn = screen.getByRole('radio', { name: /dark/i });
    fireEvent.click(darkBtn);
    expect(darkBtn).toHaveAttribute('aria-checked', 'true');
  });
});
