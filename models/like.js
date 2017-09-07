'use strict';
module.exports = function(sequelize, DataTypes) {
  var Like = sequelize.define('Like', {
    user_id: DataTypes.STRING,
    message_id: DataTypes.STRING
  }, {});

  Like.associate = function(models) {
    Like.belongsTo(models.User, {
      as: "Users",
      foreignKey: 'user_id'
    })
    Like.belongsTo(models.Message, {
      as: "Messages",
      foreignKey: 'message_id'
    })
  }
  return Like;
};
