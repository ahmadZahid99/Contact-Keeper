const express = require('express');

const route = express.Router();

// @route Post /api/auth
// @desc Get logged in user
// @access Private
route.get('/', (req, res) => {
  res.send('Get logged in user');
});

// @route Post /api/auth
// @desc Auth user and get token
// @access Public
route.post('/', (req, res) => {
  res.send('Log in user');
});

module.exports = route;
