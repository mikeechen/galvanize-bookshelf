'use strict';
exports.up = function(knex) {
  return knex.schema.createTable('books', (ta) => {
    ta.increments();
    ta.string('title').notNullable().defaultTo('');
    ta.string('author').notNullable().defaultTo('');
    ta.string('genre').notNullable().defaultTo('');
    ta.text('description').notNullable().defaultTo('');
    ta.text('cover_url').notNullable().defaultTo('');
    ta.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('books');
};
