import { render, screen, fireEvent } from '@testing-library/react';
import { ModelSelector } from '@/components/model-selector';
import { describe, it, expect, vi } from 'vitest';

describe('ModelSelector', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with initial value', () => {
    render(<ModelSelector value="gpt-3.5-turbo" onChange={mockOnChange} />);
    expect(screen.getByText('GPT-3.5 Turbo')).toBeInTheDocument();
  });

  it('calls onChange when selecting a model', () => {
    render(<ModelSelector value="gpt-3.5-turbo" onChange={mockOnChange} />);
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    
    const option = screen.getByText('GPT-4');
    fireEvent.click(option);
    
    expect(mockOnChange).toHaveBeenCalledWith('gpt-4');
  });
});