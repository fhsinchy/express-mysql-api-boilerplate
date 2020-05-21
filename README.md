# Express Boilerplate

> A dead simple boilerplate that advocates good project structure and code manageability. This boilerplate uses [airbnb](https://github.com/airbnb/javascript) eslint plugin.

## Project Structure

```bash
.
├── LICENSE
├── README.md
├── app.js
├── db
│   └── index.js
├── dev.sqlite3
├── knexfile.js
├── middleware
│   └── auth.js
├── migrations
│   ├── 20200521225756_create_users_table.js
│   └── 20200521225805_create_tokens_table.js
├── nodemon.json
├── package-lock.json
├── package.json
├── routes
│   ├── auth.js
│   └── index.js
├── server
│   └── index.js
└── tests
    └── routes.test.js
```

## Instructions

Entry point for the project is `app.js`. Main `app` instance is imported `/server/index.js` file.

All routes should live inside `/routes` directory. Routes should be coupled in files depending on their functionalities. As an example, authentication routes should be inside `/routes/auth.js`. Exported `router` objects should be then imported into `/routes/index.js`.

Middleware can be put inside `/middleware` directory in the root. Application-level middleware should be registered inside `/server/index.js`.

I have used [jestjs](https://jestjs.io/) as test runner and [supertest](https://github.com/visionmedia/supertest) for testing API endpoints. All tests should be put inside `/tests` folder, filenames should end with `*.test.js` or `*.spec.js` extension.

## Scripts

```bash
npm run dev # starts development server
npm run start # starts production server

npm run test # runs the tests

npm run lint # lints code
```

For now the boilerplate contains only the essentials but in future, I may add more functionalities like authentication, database etc.
