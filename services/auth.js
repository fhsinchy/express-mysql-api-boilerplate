const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = class AuthService {
  constructor(User, Token) {
    this.User = User;
    this.Token = Token;
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
      let refreshToken = await user.$relatedQuery('token');

      if (!refreshToken) {
        refreshToken = jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET);

        await user.$relatedQuery('token').insert({
          token: refreshToken,
          user_id: user.id,
        });
      } else {
        refreshToken = refreshToken.token;
      }

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

  async refresh(cookies) {
    const { refreshToken } = cookies;

    if (!refreshToken) {
      const err = new Error('Unauthorized!');
      err.status = 401;
      throw err;
    }

    const token = await this.Token.query().where({ token: refreshToken }).first();

    if (!token) {
      const err = new Error('Forbidden!');
      err.status = 403;
      throw err;
    }

    const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.NODE_ENV === 'development' ? '1d' : '5m',
    });

    return accessToken;
  }

  async logout(cookies) {
    const { refreshToken } = cookies;

    if (!refreshToken) {
      const err = new Error('Unauthorized!');
      err.status = 401;
      throw err;
    }

    const token = await this.Token.query().where({ token: refreshToken }).first();

    if (!token) {
      const err = new Error('Forbidden!');
      err.status = 403;
      throw err;
    }

    await this.Token.query().where({ token: refreshToken }).del();
  }
};
