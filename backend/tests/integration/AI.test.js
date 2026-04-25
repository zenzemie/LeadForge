import { describe, it, expect, beforeEach } from 'vitest';
const request = require('supertest');
const app = require('../../index');
const container = require('../../src/config/container');

describe('AI API', () => {
  let token;

  beforeEach(() => {
    const securityService = container.resolve('securityService');
    token = securityService.generateToken({ sub: 'test-user' });
  });

  it('POST /ai/generate should return generated message', async () => {
    const response = await request(app)
      .post('/ai/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'John', industry: 'SaaS' });

    expect(response.status).toBe(200);
    expect(response.body.message).toContain('John');
    expect(response.body.message).toContain('SaaS');
  });

  it('POST /ai/generate should return 401 without token', async () => {
    const response = await request(app)
      .post('/ai/generate')
      .send({ name: 'John', industry: 'SaaS' });

    expect(response.status).toBe(401);
  });

  it('POST /ai/generate should return 400 with invalid data', async () => {
    const response = await request(app)
      .post('/ai/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});
