'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable("case", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      familyMember_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      case_id: {
        type: DataTypes.STRING,
      },
      case_no: {
        type: DataTypes.INTEGER,
      },
      pname_caseId: {
        type: DataTypes.STRING,

      },
      pname_caseNumber: {
        type: DataTypes.INTEGER,
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

    await queryInterface.dropTable("case")
  }
};
