"use client";

import { useState, useEffect } from 'react';
import { FileUploader } from './file-uploader';
import { ModelSelector } from './model-selector';
import { TemperatureSetter } from './temperature-setter';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Send, Bot, User, FileText } from 'lucide-react';
import { processFile, generateResponse } from '@/lib/file-processor';
import { ThemeToggle } from './theme-toggle';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: number;
}

const greetings = [
  "Hello! I'm ready to help you analyze your documents.",
  "Hi there! Upload a document and I'll help you understand it.",
  "Welcome! I can help you extract information from your files.",
  "Greetings! Let me assist you with your document analysis.",
];

export function ChatInterface() {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [temperature, setTemperature] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setMessages([{
      id: '0',
      content: greetings[Math.floor(Math.random() * greetings.length)],
      role: 'assistant',
      timestamp: Date.now(),
    }]);
  }, []);

  const handleFileUpload = async (files: File[]) => {
    try {
      const file = files[0];
      const content = await processFile(file);
      setFileContent(content);
      setCurrentFileName(file.name);
      
      const systemMessage: Message = {
        id: Date.now().toString(),
        content: `I've processed "${file.name}" and I'm ready to answer your questions about it. What would you like to know?`,
        role: 'assistant',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, systemMessage]);
    } catch (error) {
      console.error('Error processing file:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: 'I encountered an error while processing the file. Could you please try uploading it again?',
        role: 'assistant',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let response: string;
      if (fileContent) {
        response = generateResponse(fileContent, input, temperature);
      } else {
        response = "Please upload a file first, and I'll be happy to help you analyze its contents.";
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I encountered an error while processing your request. Could you please try rephrasing your question?",
        role: 'assistant',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {currentFileName && (
            <div className="flex items-center text-sm text-muted-foreground">
              <FileText className="w-4 h-4 mr-1" />
              {currentFileName}
            </div>
          )}
        </div>
        <ThemeToggle />
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <ModelSelector value={model} onChange={setModel} />
        <TemperatureSetter value={temperature} onChange={setTemperature} />
        <FileUploader onUpload={handleFileUpload} />
      </div>

      <Card className="flex-1 min-h-[500px] p-4">
        <ScrollArea className="h-[500px] pr-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 mb-4 ${
                message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              <div
                className={`p-3 rounded-lg max-w-[80%] ${
                  message.role === 'assistant'
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-primary text-primary-foreground ml-auto'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {message.role === 'assistant' ? (
                    <Bot className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span className="text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </Card>

      <div className="flex space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about your document..."
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          disabled={isLoading}
          className="flex-1"
        />
        <Button 
          onClick={handleSend} 
          disabled={isLoading}
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}