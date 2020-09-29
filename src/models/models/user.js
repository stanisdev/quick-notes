'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Note);
    }
  };

  User.init({
    username: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    password: {
      type: DataTypes.CHAR(60),
      allowNull: false
    },
    salt: {
      type: DataTypes.CHAR(5),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
