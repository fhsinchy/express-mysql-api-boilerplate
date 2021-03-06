const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = class AuthService {
  constructor(User) {
    this.User = User;
  }

  async signup(params) {
    if (await this.User.query().where({ email: params.email }).first()) {
      const err = new Error('Email Already Taken!');
      err.status = 400;
      throw err;
    } else {
      const user = await this.User.query().insert({
        name: params.name,
        email: params.email,
        password: await bcrypt.hash(params.password, 12),
      });

      delete user.password;

      return user;
    }
  }

  async login(params) {
    const user = await this.User.query().where({ email: params.email }).first();

    if (!user) {
      const err = new Error('Wrong Email!');
      err.status = 400;
      throw err;
    } else if (await bcrypt.compare(params.password, user.password)) {
      const tokenPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.NODE_ENV === 'development' ? '1d' : '5m',
      });

      const refreshToken = jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET);

      return {
        accessToken,
        refreshToken,
      };
    } else {
      const err = new Error('Wrong Password!');
      err.status = 400;
      throw err;
    }
  }

  static refresh(refreshToken) {
    const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const tokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.NODE_ENV === 'development' ? '1d' : '5m',
    });

    return accessToken;
  }
};
