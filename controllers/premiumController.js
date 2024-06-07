const userModel = require("../models/userModel");
const Expense = require("../models/expenseModel");
const FilesDownloadedModel = require("../models/fileDownloadedModel");
const path = require("path");
const { Op } = require("sequelize");
const AWS = require("aws-sdk");
const getLeaderBoardData = async (req, res, next) => {
  try {
    const result = await userModel.findAll({
      order: [["totalExpenses", "DESC"]],
    });
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send("Error");
  }
};

const getLeaderBoardPage = async (req, res, next) => {
  res.sendFile(
    path.join(__dirname, "../", "public", "views", "leaderboard.html")
  );
};

const getReportsPage = async (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "reports.html"));
};

const getDownloadedReportsData = async (req, res, next) => {
  try {
    const id = req.user.id;
    const result = await FilesDownloadedModel.findAll({
      where: {
        userId: id,
      },
    });
    return res.status(200).json({ success: true, result: result });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getLeaderBoardData,
  getLeaderBoardPage,
  getReportsPage,
  getDownloadedReportsData,
};
