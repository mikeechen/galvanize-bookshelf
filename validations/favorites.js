'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    bookId: Joi.number()
      .integer()
      .min(0)
      .label('BookId')
      .required()
  }
}
