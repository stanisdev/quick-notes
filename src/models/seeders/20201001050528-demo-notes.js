'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const notes = [
      {
        id: 1,
        content: '1-th private note',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        content: '2-nd private note',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        content: '3-d private note',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        content: 'Public note (user 2)',
        publicKey: 'UUowyvbuK',
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        content: 'Private note (user 2)',
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    await queryInterface.bulkInsert('Notes', notes, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Notes', null, {});
  }
};
