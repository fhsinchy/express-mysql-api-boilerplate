/* eslint-disable no-undef */

const request = require('supertest');
const app = require('../server');

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
