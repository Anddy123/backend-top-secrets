const { Router } = require('express');
const UserService = require('../services/UserService');
const authenticate = require('../middleware/authenticate');

module.exports = Router();