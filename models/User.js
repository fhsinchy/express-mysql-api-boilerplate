const { Model } = require('objection');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get relationMappings() {
    const Token = require('./Token');
    return {
      token: {
        relation: Model.HasOneRelation,
        modelClass: Token,
        join: {
          from: 'users.id',
          to: 'tokens.user_id',
        },
      },
    };
  }
}

module.exports = User;
