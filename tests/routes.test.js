/* eslint-disable no-undef */
import request from 'supertest';
import app from '../server';

describe('Root Endpoint', () => {
  test('returns 200', () => {
    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err) => {
        if (err) throw err;
      });
  });
});
