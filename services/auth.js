const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ClientError = require('../classes/ClientError');

module.exports = class AuthService {
  constructor(User, Token) {
    this.User = User;
    this.Token = Token;
  }

  async signup(params) {
    if (await this.User.query().where({ email: params.email }).first()) {
      throw new ClientError(400, 'Email Already Taken!');
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
      throw new ClientError(400, 'Wrong Email!');
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
      throw new ClientError(400, 'Wrong Password!');
    }
  }

  async refresh(cookies) {
    const { refreshToken } = cookies;

    if (!refreshToken) {
      throw new ClientError(401, 'Unauthorized!');
    }

    const token = await this.Token.query().where({ token: refreshToken }).first();

    if (!token) {
      throw new ClientError(403, 'Forbidden!');
    }

    return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        throw new ClientError(403, err.message);
      }
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });

      return accessToken;
    });
  }

  async logout(cookies) {
    const { refreshToken } = cookies;

    if (!refreshToken) {
      throw new ClientError(401, 'Unauthorized!');
    }

    const token = await this.Token.query().where({ token: refreshToken }).first();

    if (!token) {
      throw new ClientError(403, 'Forbidden!');
    }

    await this.Token.query().where({ token: refreshToken }).del();
  }
};
