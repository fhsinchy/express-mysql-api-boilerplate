/* eslint-disable no-undef */

const request = require('supertest');
const app = require('../app');

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

describe('Profile Endpoint', () => {
  test('Is protected', () => {
    request(app)
      .get('/profile')
      .expect('Content-Type', /json/)
      .expect(401)
      .end((err) => {
        if (err) throw err;
      });
  });
});
