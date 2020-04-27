import dotenv from 'dotenv';
import server from './server';

dotenv.config();
const host = process.env.HOST || 'http://127.0.0.1';
const port = process.env.PORT || 3000;

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`app running -> ${host}:${port}`);
});
