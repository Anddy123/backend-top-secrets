const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('backend-express-template routes', async () => {
  beforeEach(() => {
    return setup(pool);
  });

  const agent = request.agent(app);

  const expected = [
    { 
      id: expect.any(String),
      title: 'My birds name', 
      description: 'Steve',
      createdAt: expect.any(String)
    },
    { 
      id: expect.any(String),
      title: 'My dogs name', 
      description: 'Fido',
      createdAt: expect.any(String)
    }
  ];

  let res = await agent
    .get('/api/v1/secrets');

  // Should get "unauthenticated"
  expect(res.status).toEqual(401);

  // create a user
  await agent
    .post('/api/v1/users')
    .send({ 
      email: 'bob@bob.com', 
      password: 'bobbob' 
    });


  //sign in user
  await agent
    .post('/api/v1/users/sessions')
    .send({ 
      email: 'bob@bob.com', 
      password: 'bobbob' 
    });

  res = await agent 
    .get('/api/v1/secrets');

  expect(res.body).toEqual(expected);

  afterAll(() => {
    pool.end();
  });
});
