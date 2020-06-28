module.exports = class ClientError extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }
};
