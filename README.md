# Node Rocket [![Build Status](https://travis-ci.com/fhsinchy/node-rocket.svg?branch=master)](https://travis-ci.com/fhsinchy/node-rocket)

This is a solid project template for building APIs with [Node](https://github.com/nodejs/node). Some notable libraries used in this project are:

- [Express](https://github.com/expressjs/express) - main middleware framework.
- [Objection](https://github.com/Vincit/objection.js/) - ORM.
- [Knex](https://github.com/knex/knex) - query builder.
- [Joi](https://github.com/hapijs/joi) - JSON schema validator.
- [Celebrate](https://github.com/arb/celebrate) - validation middleware.
- [Morgan](https://github.com/expressjs/morgan) - logging middleware.

## Instructions

Entry point for the project is `bin/www`. The main `app` instance is being created inside `app.js` file.

Route controllers are inside `api` directory. The `api/middleware` directory contains all the middleware and `api/routes` directory contains all the route definitions. No business logic should be put inside this directory. There is a separate place for that.

The `models` folder contains all the database models. Documentation for creating models can be found on the [Models](https://vincit.github.io/objection.js/guide/models.html) guide of [Objection](https://vincit.github.io/) website. Migrations can be generated inside the `migrations` directory by executing `npm run knex migrate:make <migration_name>` in the terminal. Documentation for writing the migration files can be found on [Schema Builder](http://knexjs.org/#Schema) section on [Knex](http://knexjs.org/) website.

Business logics are inside `services` directory. Each service inside that directory is a single class responsible for dealing with certain functionalities, such as the `AuthService` class is responsible for taking care of all authentication related business logic.

## Scripts

```bash
npm run dev # starts development server
npm run start # starts production server

npm run test # runs the tests

npm run lint # lints code

npm run knex migrate:make <migration_name> # creates new database migration
npm run db:migrate # runs all pending database migrations
npm run db:refresh # rolls back and re-runs all database migrations
```

This project has by no means the best project architecture, nor does it follows all the best practices. It's something that has worked well for _me_ in the past and still does. Also, I often make changes to the code depending on what I've learned lately or to suffice my own necessity, so suggestions are always welcomed.
