const dotenv = require('dotenv');

const app = require('./server');

dotenv.config();

const host = process.env.HOST || 'http://127.0.0.1';
const port = process.env.PORT || 3000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`app running -> ${host}:${port}`);
});
