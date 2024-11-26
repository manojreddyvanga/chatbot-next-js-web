import { render, screen, fireEvent, act } from '@testing-library/react';
import { ChatInterface } from '@/components/chat-interface';
import { ThemeProvider } from 'next-themes';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock file processor functions
vi.mock('@/lib/file-processor', () => ({
  processFile: vi.fn().mockResolvedValue('{"test": "content"}'),
  generateResponse: vi.fn().mockReturnValue('Test response'),
}));

describe('ChatInterface', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <ThemeProvider>
        <ChatInterface />
      </ThemeProvider>
    );
  };

  it('renders initial greeting message', async () => {
    renderComponent();
    await act(async () => {
      const message = await screen.findByText(/ready to|help you|Welcome|Greetings/i);
      expect(message).toBeInTheDocument();
    });
  });

  it('handles user input and message sending', async () => {
    renderComponent();
    
    await act(async () => {
      const input = screen.getByPlaceholderText(/Ask me about/i);
      const sendButton = screen.getByLabelText('Send message');

      fireEvent.change(input, { target: { value: 'test message' } });
      fireEvent.click(sendButton);
    });

    expect(screen.getByText('test message')).toBeInTheDocument();
  });

  it('handles file upload', async () => {
    renderComponent();
    const mockFile = new File(['{"test": "content"}'], 'test.json', { type: 'application/json' });
    
    await act(async () => {
      const fileInput = screen.getByRole('button', { name: /Upload Files/i })
        .parentElement?.querySelector('input');

      if (fileInput) {
        fireEvent.change(fileInput, { target: { files: [mockFile] } });
      }
    });

    expect(await screen.findByText(/I've processed/)).toBeInTheDocument();
  });

  it('shows UI components', () => {
    renderComponent();
    expect(screen.getByText('Theme')).toBeInTheDocument();
    expect(screen.getByText('GPT-3.5 Turbo')).toBeInTheDocument();
    expect(screen.getByText(/Temperature:/)).toBeInTheDocument();
  });
});