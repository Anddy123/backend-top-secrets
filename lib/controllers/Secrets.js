const { Router } = require('express');
const Secret = require('../models/Secret');
const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try {
      const secrets = await Secret.getAll();
      res.json(secrets);
    }
    catch (err) {
      next(err);
    }
  })
  .post('/', authenticate, async (req, res, next) => {
    try {
      const secret = await Secret.createSecret(req.body);
      res.send(secret);
    }
    catch (err) {
      next(err);
    }
  });
