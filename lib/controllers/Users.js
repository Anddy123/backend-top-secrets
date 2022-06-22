const { Router } = require('express');
const UserService = require('../services/UserService');
// const authenticate = require('../middleware/authenticate');
const User = require('../models/User');

module.exports = Router()
  .post('/', async(req, res, next) => {
    try {
      const user = await UserService.hash(req.body);
      res.send(user);
    }
    catch (err) {
      next(err);
    }
  })

  .post('/sessions', async(req, res, next) => {
    try {
      const user = await UserService.signIn(req.body);

      const token = User.authToken();

      res.cookie('session', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
      });

      res.send({ message: 'Signed in succesfully', user });
    }
    catch (err) {
      next(err);
    }
  })
  
  .get('/sessions', async(req, res, next) => {
    try {
      res.send(req.user);
    }
    catch (err) {
      next(err);
    }
  })

  .delete('/sessions', (req, res) => {
    res.clearCookie(process.env.COOKIE_NAME).send({ success: true, message: 'Signed out successfully!' });
  });
