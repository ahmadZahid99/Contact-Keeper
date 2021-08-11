const express = require('express');

const route = express.Router();

const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const User = require('../models/User');
const Contact = require('../models/Contact');

// @route POST /api/contacts
// @desc Get all contact of user
// @access Private
route.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.send(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route POST /api/contacts
// @desc Add new conatcts
// @access Private
route.post(
  '/',
  [auth, [body('name', 'name is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, type } = req.body;

    try {
      const newContact = await Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id,
      });

      const contact = await newContact.save();
      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route PUT /api/contact/:id
// @desc Update contact
// @access Private
route.put('/:id', auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  //Build contact object
  const contactFields = {};

  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ msg: 'Contact not found' });

    // Make sure user owns the contact
    if (contact.user.toString() !== req.user.id)
      return res.status(401).json({ msg: 'Not Authorize' });

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        $set: contactFields,
      },
      { new: true }
    );

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// @route DELETE /api/contact/:id
// @desc Delete contact
// @access Private
route.delete('/:id', auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ msg: 'Contact not found' });

    // Make sure user owns the contact
    if (contact.user.toString() !== req.user.id)
      return res.status(401).json({ msg: 'Not Authorize' });

    await Contact.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Contact Remove' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

module.exports = route;
