'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    title: Joi.string()
      .label('Title')
      .required()
      .trim(),

    author: Joi.string()
      .label('Author')
      .required()
      .trim(),

    genre: Joi.string()
      .label('Genre')
      .required()
      .trim(),

    description: Joi.string()
      .label('Description')
      .required()
      .trim(),

    coverUrl: Joi.string()
      .label('CoverUrl')
      .required()
      .trim(),
  }
};

module.exports.patch = {
  params: {
    id: Joi.number()
      .integer()
      .required()
      .min(0)
      .label('Id')
  },
  body: {
    title: Joi.string()
      .label('Title')
      .trim(),

    author: Joi.string()
      .label('Author')
      .trim(),

    genre: Joi.string()
      .label('Genre')
      .trim(),

    description: Joi.string()
      .label('Description')
      .trim(),

    coverUrl: Joi.string()
      .label('CoverUrl')
      .trim(),
  }
};
