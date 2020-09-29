'use strict';

const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid/async');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Note);
    }
    /**
     * Create the new user based on given credentials
     */
    static async createNew({ username, password }) {
      const salt = await nanoid(5);
      const hash = await bcrypt.hash(password + salt, 10);

      const user = new this({
        username,
        password: hash,
        salt
      });
      return user.save();
    }
    /**
     * Find user by username
     */
    static findByUsername(username) {
      return this.findOne({
        where: { username },
        attributes: ['id', 'username', 'password', 'salt']
      });
    }
    /**
     * Check the password for correctness
     */
    checkPassword(password) {
      return bcrypt.compare(password + this.salt, this.password);
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING(20),
      validate: {
        len: [3, 20]
      },
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
