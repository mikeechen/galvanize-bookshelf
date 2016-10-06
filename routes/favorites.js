'use strict';

const express = require('express');
const boom = require('boom');
const knex = require('../knex');
const jwt = require('jsonwebtoken');
const { camelizeKeys, decamelizeKeys } = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE

module.exports = router;
