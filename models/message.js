'use strict';
module.exports = function(sequelize, DataTypes) {
  var Message = sequelize.define('Message', {
    user_id: DataTypes.STRING,
    messages: DataTypes.STRING
  }, {});

  Message.associate = function(models) {
    Message.belongsTo(models.User, {
      foreignKey: 'user_id',
    })

  }
  return Message;
};
