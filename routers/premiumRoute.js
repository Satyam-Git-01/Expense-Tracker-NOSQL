const express = require("express");
const authentication = require("../middlewares/auth");
const {
  getLeaderBoardData,
  getLeaderBoardPage,
  getReportsPage,
  getDownloadedReportsData,
} = require("../controllers/premiumController");
const premiumRoute = express.Router();

premiumRoute.get("/getLeaderBoardData", getLeaderBoardData);
premiumRoute.get("/getLeaderBoardPage", getLeaderBoardPage);
premiumRoute.get("/getReportsPage", getReportsPage);
premiumRoute.get(
  "/getDownloadedReportsData",
  authentication,
  getDownloadedReportsData
);

module.exports = premiumRoute;
