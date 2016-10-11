'use strict';

const express = require('express');
const boom = require('boom');
const knex = require('../knex');
const jwt = require('jsonwebtoken');
const { camelizeKeys, decamelizeKeys } = require('humps');
const ev = require('express-validation');
const validations = require('../validations/favorites');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
const authorize = (req, res, next) => {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(boom.create(401, 'Unauthorized'));
    }

    req.token = decoded;

    next();
  });
};

router.get('/favorites', authorize, (req, res, next) => {
  const { userId } = req.token;

  knex('favorites')
    .innerJoin('books', 'books.id', 'favorites.book_id')
    .where('favorites.user_id', userId)
    .orderBy('books.title', 'ASC')
    .then((rows) => {
      const favorites = camelizeKeys(rows);

      res.send(favorites);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/favorites/check', authorize, (req, res, next) => {
  const { userId } = req.token;
  const bookId = req.query.bookId;

  if (isNaN(bookId)) {
    return next(boom.create(400, 'Book ID must be an integer'));
  }

  knex('favorites')
    .where('user_id', userId)
    .where('book_id', bookId)
    .first()
    .then((row) => {
      if (!row) {
        res.send(false);
      } else {
        res.send(true);
      }
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/favorites', authorize, ev(validations.post), (req, res, next) => {
  const { userId } = req.token;
  const { bookId } = req.body;

  knex('books')
    .where('id', bookId)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(404, 'Book not found');
      }

      return knex('favorites').insert(decamelizeKeys({ userId, bookId }), '*');
    })
    .then((insert) => {
      const book = camelizeKeys(insert[0]);

      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/favorites', authorize, (req, res, next) => {
  const { userId } = req.token;
  const { bookId } = req.body;

  if (isNaN(bookId)) {
    return next(boom.create(400, 'Book ID must be an integer'));
  }

  let book;

  knex('favorites')
    .where('favorites.user_id', userId)
    .where('favorites.book_id', bookId)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(404, 'Favorite not found');
      }

      book = camelizeKeys(row);

      return knex('favorites')
        .where('id', book.id)
        .del();
    })
    .then(() => {
      delete book.id;

      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
