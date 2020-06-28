const { isCelebrate } = require('celebrate');

class ClientError extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }
}

const isClient = (err) => err instanceof ClientError;

module.exports = { ClientError, isCelebrate, isClient };
