const knex = require('knex');
const dotenv = require('dotenv');

const knexfile = require('../knexfile');

dotenv.config();

const db = knex(knexfile[process.env.NODE_ENV]);

module.exports = db;
