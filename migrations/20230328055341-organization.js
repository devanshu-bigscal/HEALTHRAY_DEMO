'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable("organization", {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_by_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      case_prefix: {
        type: DataTypes.STRING,
      },
      case_start_no: {
        type: DataTypes.INTEGER
      },
      is_case_no_updated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },







    })
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable("organization")
  }
};
