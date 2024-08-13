"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("home", {
      id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      banner: {
        type: Sequelize.STRING,
      },
      gioi_thieu: {
        type: Sequelize.TEXT,
      }, 
      is_banner:{
        type: Sequelize.INTEGER,
      }, 
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("home");
  },
};
