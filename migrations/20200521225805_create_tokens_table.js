/* eslint-disable func-names */

exports.up = function (knex) {
  return knex.schema.createTable('tokens', (table) => {
    table.increments();
    table.text('token').notNullable();
    table.integer('user_id').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tokens');
};
