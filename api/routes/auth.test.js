/* eslint-disable no-undef */

const request = require('supertest');

const app = require('../../app');
const services = require('../../services');

function extractCookie(response) {
  return response.headers['set-cookie']
    .shift()
    .split(',')
    .map((item) => item.split(';')[0])
    .join(';');
}

beforeEach(() => {
  return services.knex.migrate.latest();
});

afterEach(() => {
  return services.knex.migrate.rollback();
});

afterAll(() => {
  return services.knex.destroy();
});

describe('POST /auth/register', () => {
  test('Creates a new user in the database', async () => {
    const user = {
      id: 1,
      name: 'Farhan Hasin Chowdhury',
      email: 'mail@farhan.info',
      password: 'secret',
    };
    const response = await request(app).post('/auth/register').send(user);

    expect(response.status).toBe(201);
    expect(response.body.data.user).toEqual({ id: user.id, name: user.name, email: user.email });
  });
});

describe('POST /auth/login', () => {
  test('Logs in a user', async () => {
    const user = {
      id: 1,
      name: 'Farhan Hasin Chowdhury',
      email: 'mail@farhan.info',
      password: 'secret',
    };
    await request(app).post('/auth/register').send(user);

    const response = await request(app)
      .post('/auth/login')
      .send({ email: user.email, password: user.password });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
      }),
    );
    expect(response.headers['set-cookie'].shift()).toContain('refreshToken');
  });
});

describe('POST /auth/token/refresh', () => {
  const agent = request.agent(app);
  test('Refreshes a token', async () => {
    const user = {
      id: 1,
      name: 'Farhan Hasin Chowdhury',
      email: 'mail@farhan.info',
      password: 'secret',
    };
    await request(app).post('/auth/register').send(user);
    const cookie = extractCookie(
      await agent.post('/auth/login').send({ email: user.email, password: user.password }),
    );

    const response = await agent
      .post('/auth/login')
      .set('Cookie', cookie)
      .send({ email: user.email, password: user.password });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
      }),
    );
  });
});

describe('POST /auth/logout', () => {
  const agent = request.agent(app);
  test('Logs out a user', async () => {
    const user = {
      id: 1,
      name: 'Farhan Hasin Chowdhury',
      email: 'mail@farhan.info',
      password: 'secret',
    };
    await request(app).post('/auth/register').send(user);

    const loginResponse = await agent
      .post('/auth/login')
      .send({ email: user.email, password: user.password });

    const token = loginResponse.body.accessToken;
    const cookie = extractCookie(loginResponse);

    const response = await agent
      .post('/auth/logout')
      .set('Cookie', cookie)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
