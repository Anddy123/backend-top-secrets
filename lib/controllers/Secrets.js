const { Router } = require('express');
const Secret = require('../models/Secret');
const authenticate = require('../middleware/authenticate');