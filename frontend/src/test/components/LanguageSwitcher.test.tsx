/**
 * @file LanguageSwitcher.test.tsx
 * Component tests for the LanguageSwitcher component.
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/index';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';

function renderWithI18n(ui: React.ReactElement) {
  return render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);
}

describe('LanguageSwitcher', () => {
  it('renders a language select element', () => {
    renderWithI18n(<LanguageSwitcher />);
    const select = screen.getByRole('combobox', { name: /select language/i });
    expect(select).toBeInTheDocument();
  });

  it('shows three language options: English, Español, हिन्दी', () => {
    renderWithI18n(<LanguageSwitcher />);
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Español')).toBeInTheDocument();
    expect(screen.getByText('हिन्दी')).toBeInTheDocument();
  });

  it('defaults to English (en)', () => {
    renderWithI18n(<LanguageSwitcher />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('en');
  });

  it('calls i18n.changeLanguage when selection changes to Spanish', async () => {
    const changeSpy = vi.spyOn(i18n, 'changeLanguage');
    renderWithI18n(<LanguageSwitcher />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'es' } });
    expect(changeSpy).toHaveBeenCalledWith('es');
    changeSpy.mockRestore();
  });

  it('persists language choice to localStorage', () => {
    renderWithI18n(<LanguageSwitcher />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'hi' } });
    expect(localStorage.getItem('genericmed_lang')).toBe('hi');
  });
});
