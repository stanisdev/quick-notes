'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [
      {
        id: 1,
        username: 'f32',
        password: '$2b$10$nBbMHq0fEFp/4K.xU7Qz1O77Ox0tylJ5WwsJMXiMhDEHBMTnImpAK', // 1234bm
        salt: '1BGl5',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        username: 'gj7',
        password: '$2b$10$9o9B0veRdEXrnR5M0YOeEeL7pMoZp9wmqKdujuTI/j1SSvwzdUG5m', // 1234bm
        salt: 'NaARD',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    await queryInterface.bulkInsert('Users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
