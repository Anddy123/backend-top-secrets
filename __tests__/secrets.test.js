
const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('top-secrets-backend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });


  it('returns a list of secrets for logged in user', async() => {
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

    // Test authentication for the endpoint
    // No user signed in:
    let res = await agent
      .get('/api/v1/secrets');

    // Should get "unauthenticated" status
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
  });

  it('lets logged in user create a secret', async() => {
    const agent = request.agent(app);

    const expected =
      { 
        id: expect.any(String),
        title: 'My big secret', 
        description: 'I love money',
        createdAt: expect.any(String)
      };

    // TEST ENDPOINT FOR NO USER SIGNED IN
    let res = await agent 
      .post('/api/v1/secrets')
      .send({ 
        title: 'My big secret', 
        description: 'I love money',
      });

    // Should get "unauthenticated" status
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
      .post('/api/v1/secrets')
      .send({ 
        title: 'My big secret', 
        description: 'I love money',
      });

    expect(res.body).toEqual(expected);

  });

});
