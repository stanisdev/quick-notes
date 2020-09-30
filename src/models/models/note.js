'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    static associate(models) {
      Note.belongsTo(models.User);
    }
    /**
     * Create the new note
     */
    static createNew(content, userId) {
      return this.create({ content, userId });
    }
    /**
     * Get list of notes
     */
    static getMany({ userId, limit, offset }) {
      return this.findAll({
        where: { userId },
        attributes: ['id', 'content', 'createdAt', 'updatedAt'],
        limit,
        offset,
        raw: true
      });
    }
  }

  Note.init({
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 1000]
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Note',
  });

  return Note;
};