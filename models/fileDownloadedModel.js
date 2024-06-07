const Sequelize = require("sequelize");
const sequelize = require("../services/dbConn");

const FileDownloadedModel = sequelize.define("filesdownloaded", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  url: Sequelize.STRING,
  generatedOn: {
    type: Sequelize.STRING,
  },
});

module.exports = FileDownloadedModel;
