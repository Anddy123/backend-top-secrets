const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('users can signup with email and password with POST', async() => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({ 
        email: 'bob@bob.com', 
        password: 'bobbob' 
      });

    expect(res.body).toEqual({
      id: expect.any(String), 
      email: 'bob@bob.com'
    });
  });

  it('signs in an existing user', async() => {
    //first we sign up a user
    await UserService.hash({
      email: 'bob@bob.com', 
      password: 'bobbob'
    });

    //then we test signing in the user
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({
        email: 'bob@bob.com',
        password: 'bobbob'
      });

    expect(res.status).toEqual(200);
  });


  it('logs out a user', async() => {

    await UserService.hash({
      email: 'bob2@bob.com', 
      password: 'bobbob'
    });


    await request(app)
      .post('/api/v1/users/sessions')
      .send({
        email: 'bob2@bob.com',
        password: 'bobbob'
      });

    const res = await request(app)
      .delete('/api/v1/users/sessions');
    

    expect(res.body).toEqual({
      success: true, 
      message: 'Signed out successfully!'
    });
  });

  afterAll(() => {
    pool.end();
  });
});
