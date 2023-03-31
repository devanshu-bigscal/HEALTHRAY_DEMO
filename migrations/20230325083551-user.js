'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable("user", {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false
      },
      member_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
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

    await queryInterface.dropTable("user")
  }
};
