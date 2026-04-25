import { describe, it, expect } from 'vitest';
const AIService = require('../../src/domain/services/AIService');

describe('AIService', () => {
  const aiService = new AIService();

  it('should generate a message with name and industry', () => {
    const message = aiService.generateMessage('John', 'SaaS');
    expect(message).toContain('John');
    expect(message).toContain('SaaS');
  });

  it('should use custom template if provided', () => {
    const template = 'Hello {{name}} from {{industry}}';
    const message = aiService.generateMessage('John', 'SaaS', template);
    expect(message).toBe('Hello John from SaaS');
  });
});
