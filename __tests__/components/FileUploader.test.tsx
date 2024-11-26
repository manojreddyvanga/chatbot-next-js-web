import { render, screen, fireEvent } from '@testing-library/react';
import { FileUploader } from '@/components/file-uploader';
import { describe, it, expect, vi } from 'vitest';

describe('FileUploader', () => {
  const mockOnUpload = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders upload button', () => {
    render(<FileUploader onUpload={mockOnUpload} />);
    expect(screen.getByText('Upload Files')).toBeInTheDocument();
  });

  it('accepts valid file types', () => {
    render(<FileUploader onUpload={mockOnUpload} />);
    const input = screen.getByRole('button').parentElement?.querySelector('input');
    expect(input).toHaveAttribute('accept', '.json,.txt,.doc,.docx');
  });

  it('handles valid file upload', () => {
    render(<FileUploader onUpload={mockOnUpload} />);
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByRole('button').parentElement?.querySelector('input');

    if (input) {
      fireEvent.change(input, { target: { files: [file] } });
      expect(mockOnUpload).toHaveBeenCalledWith([file]);
    }
  });
});