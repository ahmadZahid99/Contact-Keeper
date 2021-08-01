const express = require('express');

const route = express.Router();

// @route POST /api/contact
// @desc Get all contact of user
// @access Private
route.get('/', (req, res) => {
  res.send('Get all user contact');
});

// @route POST /api/contact
// @desc Add new conatct
// @access Private
route.post('/', (req, res) => {
  res.send('Add contact');
});

// @route PUT /api/contact/:id
// @desc Update contact
// @access Private
route.put('/:id', (req, res) => {
  res.send('Update contact');
});

// @route DELETE /api/contact/:id
// @desc Delete contact
// @access Private
route.delete('/:id', (req, res) => {
  res.send('Delete contact');
});

module.exports = route;
