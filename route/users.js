const express = require('express');
const route = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { body, validationResult } = require('express-validator');

const User = require('../models/User');

// @route Post /api/user
// @desc Register a user
// @access Public
route.post(
  '/',
  [
    body('name', 'Please add name').not().isEmpty(),
    body('email', 'Please Include a valid email').isEmail(),
    body('password', 'Please enter password with 6 or more character').isLength(
      { min: 6 }
    ),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    console.log(`name : ${name}, email : ${email}, password : ${password}`);
    try {
      let user = await User.findOne({ email });
      console.log(user);
      if (user) {
        return res.status(400).json({ msg: 'User already exists.' });
      }

      user = new User({
        name,
        email,
        password,
      });
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = route;
