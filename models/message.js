'use strict';
module.exports = function(sequelize, DataTypes) {
  var Message = sequelize.define('Message', {
    user_id: DataTypes.STRING,
    messages: DataTypes.STRING
  }, {});

  Message.associate = function(models) {
    Message.belongsTo(models.User, {
      as: 'Users',
      foreignKey: 'user_id'
    });
    Message.hasMany(models.Like, {
      as: 'Likes',
      foreignKey: 'messages_id'
    });

  }
  return Message;
};
