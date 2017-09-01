'use strict';
module.exports = function(sequelize, DataTypes) {
  var Like = sequelize.define('Like', {
    user_id: DataTypes.STRING,
    messages_id: DataTypes.STRING
  }, {});

  Like.accociate = function(models) {
    Like.belongsTo(models.User,)
  })
  return Like;
};
