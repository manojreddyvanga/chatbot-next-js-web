import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('utils', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      const result = cn('base-class', 'additional-class', { 'conditional-class': true });
      expect(result).toContain('base-class');
      expect(result).toContain('additional-class');
      expect(result).toContain('conditional-class');
    });

    it('handles conditional classes', () => {
      const result = cn('base-class', { 'true-class': true, 'false-class': false });
      expect(result).toContain('base-class');
      expect(result).toContain('true-class');
      expect(result).not.toContain('false-class');
    });

    it('handles undefined and null values', () => {
      const result = cn('base-class', undefined, null, { 'test-class': true });
      expect(result).toContain('base-class');
      expect(result).toContain('test-class');
    });
  });
});