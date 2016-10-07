'use strict';

const express = require('express');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');
const boom = require('boom');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/books', (_req, res, next) => {
  knex('books')
    .orderBy('title')
    .then((rows) => {
      const books = camelizeKeys(rows);

      res.send(books);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/books/:id', (req, res, next) => {
  if (isNaN(req.params.id)) {
    return next();
  }
  knex('books')
    .where('id', req.params.id)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(404, 'Not Found');
      }
      const book = camelizeKeys(row);

      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/books', (req, res, next) => {
  const { title, author, genre, description, coverUrl } = req.body;

  if (!title || !title.trim()) {
    return next(boom.create(400, 'Title must not be blank'));
  }

  if (!author || !author.trim()) {
    return next(boom.create(400, 'Author must not be blank'));
  }

  if (!genre || !genre.trim()) {
    return next(boom.create(400, 'Genre must not be blank'));
  }

  if (!description || !description.trim()) {
    return next(boom.create(400, 'Description must not be blank'));
  }

  if (!coverUrl || !coverUrl.trim()) {
    return next(boom.create(400, 'Cover URL must not be blank'));
  }

  const bookinsert = { title, author, genre, description, coverUrl };

  knex('books')
    .insert(decamelizeKeys(bookinsert), '*')
    .then((row) => {
      const book = camelizeKeys(row[0]);

      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/books/:id', (req, res, next) => {
  if (isNaN(req.params.id)) {
    return next();
  }

  knex('books')
    .where('id', req.params.id)
    .first()
    .then((book) => {
      if (!book) {
        throw boom.create(404, 'Not Found');
      }
      const { title, author, genre, description, coverUrl } = req.body;
      const updatebook = {};

      if (title && title.trim()) {
        updatebook.title = title;
      }

      if (author && author.trim()) {
        updatebook.author = author;
      }

      if (genre && genre.trim()) {
        updatebook.genre = genre;
      }

      if (description && description.trim()) {
        updatebook.description = description;
      }

      if (coverUrl && coverUrl.trim()) {
        updatebook.coverUrl = coverUrl;
      }

      return knex('books')
        .update(decamelizeKeys(updatebook), '*')
        .where('id', req.params.id);
    })
    .then((row) => {
      const book = camelizeKeys(row[0]);

      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/books/:id', (req, res, next) => {
  if (isNaN(req.params.id)) {
    return next();
  }

  let book;

  knex('books')
    .where('id', req.params.id)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(404, 'Not Found');
      }

      book = camelizeKeys(row);

      knex('books')
        .where('id', req.params.id)
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
