const express = require("express");
const authenticatemiddleware = require("../middlewares/auth");
const {
  updateTransactionStatus,
  purchasePremium,
} = require("../controllers/purchaseMembershipController");

const purchaseRoute = express.Router();
purchaseRoute.get("/premiumMembership", authenticatemiddleware, purchasePremium);
purchaseRoute.post(
  "/updateTransactionStatus",
  authenticatemiddleware,
  updateTransactionStatus
);

module.exports = purchaseRoute;
