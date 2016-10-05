'use strict';

const express = require('express');
const boom = require('boom');
const { camelizeKeys, decamelizeKeys } = require('humps');
const knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
router.post('/users', (req, res, next) => {
  const { firstName, lastName, email, password } = camelizeKeys(req.body);

  if (!password || password.length < 8) {
    return next(boom.create(400, 'Password must be at least 8 characters long'));
  }

  if (!email || !email.trim()) {
    return next(boom.create(400, 'Email must not be blank'));
  }

  if (!firstName || !firstName.trim()) {
    return next(boom.create(400, 'First Name must not be blank'));
  }

  if (!lastName || !lastName.trim()) {
    return next(boom.create(400, 'Last Name must not be blank'));
  }

  knex('users')
    .where('email', email)
    .then((match) => {

      if (match.length !== 0) {
        return next(boom.create(400, 'Email already exists'));
      }

      bcrypt.hash(password, 12)
        .then((hashedPassword) => {
          const insertUser = { firstName, lastName, email, hashedPassword };

          return knex('users').insert(decamelizeKeys(insertUser), '*')
        })
        .then((row) => {
          const user = camelizeKeys(row[0]);

          delete user.hashedPassword;

          res.send(user);
        })
        .catch((err) => {
          next(err);
        });
  });
});

module.exports = router;
