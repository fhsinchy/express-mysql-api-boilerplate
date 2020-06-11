const { Model } = require('objection');

class Token extends Model {
  static get tableName() {
    return 'tokens';
  }

  static get relationMappings() {
    const User = require('./User');
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          to: 'tokens.user_id',
        },
      },
    };
  }
}

module.exports = Token;
