'use strict';

const express = require('express');
const boom = require('boom');
const { camelizeKeys, decamelizeKeys } = require('humps');
const knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const ev = require('express-validation');
const validations = require('../validations/users');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
router.post('/users', ev(validations.post), (req, res, next) => {
  const { firstName, lastName, email, password } = camelizeKeys(req.body);

  knex('users')
    .select(knex.raw('1=1'))
    .where('email', email)
    .then((match) => {
      if (match.length !== 0) {
        throw boom.create(400, 'Email already exists');
      }

      return bcrypt.hash(password, 12)
        .then((hashedPassword) => {
          const insertUser = { firstName, lastName, email, hashedPassword };

          return knex('users').insert(decamelizeKeys(insertUser), '*');
        })
        .then((row) => {
          const user = camelizeKeys(row[0]);

          delete user.hashedPassword;

          res.send(user);
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
