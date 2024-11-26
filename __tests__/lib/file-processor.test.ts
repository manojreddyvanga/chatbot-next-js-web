import { describe, it, expect, vi } from 'vitest';
import { processFile, generateResponse } from '@/lib/file-processor';

describe('file-processor', () => {
  describe('processFile', () => {
    it('processes JSON files', async () => {
      const content = { test: 'content' };
      const file = new File([JSON.stringify(content)], 'test.json', { type: 'application/json' });
      const result = await processFile(file);
      expect(JSON.parse(result)).toEqual(content);
    });

    it('processes text files', async () => {
      const content = 'test content';
      const file = new File([content], 'test.txt', { type: 'text/plain' });
      const result = await processFile(file);
      expect(result).toBe(content);
    });

    it('processes doc files', async () => {
      const content = 'test content';
      const file = new File([content], 'test.doc', { type: 'application/msword' });
      const result = await processFile(file);
      expect(result).toBeTruthy();
    });

    it('processes docx files', async () => {
      const content = 'test content';
      const file = new File([content], 'test.docx', { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      const result = await processFile(file);
      expect(result).toBeTruthy();
    });

    it('handles unsupported file types', async () => {
      const file = new File([''], 'test.xyz', { type: 'application/xyz' });
      await expect(processFile(file)).rejects.toThrow('Unsupported file type');
    });
  });

  describe('generateResponse', () => {
    const jsonContent = JSON.stringify({
      name: "John Doe",
      age: 30,
      occupation: "Developer",
      details: {
        experience: "5 years",
        skills: ["JavaScript", "React", "Node.js"]
      }
    });

    it('handles JSON content with low temperature', () => {
      const response = generateResponse(jsonContent, "name", 0.2);
      expect(response).toMatch(/John Doe/);
    });

    it('handles JSON content with medium temperature', () => {
      const response = generateResponse(jsonContent, "occupation", 0.5);
      expect(response).toMatch(/Developer/);
    });

    it('handles JSON content with high temperature', () => {
      const response = generateResponse(jsonContent, "skills", 0.8);
      expect(response).toMatch(/JavaScript.*React.*Node\.js/);
    });

    it('handles nested JSON properties', () => {
      const response = generateResponse(jsonContent, "experience", 0.5);
      expect(response).toMatch(/5 years/);
    });

    it('handles no matches found', () => {
      const response = generateResponse(jsonContent, "invalid", 0.5);
      expect(response).toMatch(/couldn't find|don't see anything|don't have any/);
    });

    it('handles text content', () => {
      const textContent = "Hello world\nThis is a test";
      const response = generateResponse(textContent, "hello", 0.5);
      expect(response).toMatch(/Hello world/);
    });
  });
});