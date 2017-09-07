'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    handle: DataTypes.STRING,
    password: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {});

  User.associate = function(models) {
    User.hasMany(models.Message, {
      as: 'Messages', foreignKey: 'user_id'
    })

    User.hasMany(models.Like, {
      as: 'Likes', foreignKey: 'user_id'
    })
  }
  return User;
};
