import { render, screen, fireEvent } from '@testing-library/react';
import { TemperatureSetter } from '@/components/temperature-setter';
import { describe, it, expect, vi } from 'vitest';

describe('TemperatureSetter', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with initial value', () => {
    render(<TemperatureSetter value={0.7} onChange={mockOnChange} />);
    expect(screen.getByText('Temperature: 0.7')).toBeInTheDocument();
  });

  it('renders slider input', () => {
    render(<TemperatureSetter value={0.7} onChange={mockOnChange} />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });
});