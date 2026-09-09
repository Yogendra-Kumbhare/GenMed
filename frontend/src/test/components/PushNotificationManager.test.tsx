/**
 * @file PushNotificationManager.test.tsx
 * Component tests for the PushNotificationManager component.
 */

import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { PushNotificationManager } from '../../components/PushNotificationManager';

describe('PushNotificationManager', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders nothing (null) when Notification API is unsupported', () => {
    const original = globalThis.Notification;
    try {
      Object.defineProperty(globalThis, 'Notification', {
        value: undefined,
        configurable: true,
        writable: true,
      });

      const { container } = render(<PushNotificationManager />);
      expect(container.firstChild).toBeNull();
    } finally {
      Object.defineProperty(globalThis, 'Notification', {
        value: original,
        configurable: true,
        writable: true,
      });
    }
  });

  it('renders nothing initially when permission is already granted', () => {
    Object.defineProperty(globalThis.Notification, 'permission', {
      value: 'granted',
      configurable: true,
    });

    const { container } = render(<PushNotificationManager />);
    // No banner shown because permission already decided
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing initially — banner appears after 3s delay', () => {
    vi.useFakeTimers();

    Object.defineProperty(globalThis.Notification, 'permission', {
      value: 'default',
      configurable: true,
    });

    const { container } = render(<PushNotificationManager />);
    // Before 3 seconds — banner not visible
    expect(container.firstChild).toBeNull();

    // Advance past the 3-second delay wrapped in act()
    act(() => {
      vi.advanceTimersByTime(3100);
    });

    expect(screen.queryByRole('alert')).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('does NOT show banner if previously dismissed', () => {
    vi.useFakeTimers();
    localStorage.setItem('genericmed_push_dismissed', 'true');

    Object.defineProperty(globalThis.Notification, 'permission', {
      value: 'default',
      configurable: true,
    });

    render(<PushNotificationManager />);
    vi.advanceTimersByTime(3100);

    // Banner should NOT appear because user dismissed it
    expect(screen.queryByRole('alert')).toBeNull();

    vi.useRealTimers();
  });
});
