const express = require("express");
const authentication = require("../middlewares/auth");
const {
  getAllExpenses,
  getHomePage,
  addExpense,
  deleteExpense,
  downloadExpenseReport,
  getAllExpensesforPagination,
  editExpense
} = require("../controllers/expenseController");
const expenseRoute = express.Router();

expenseRoute.get("/", getHomePage);
expenseRoute.get("/getAllExpenses", authentication, getAllExpenses);
expenseRoute.get('/getAllExpenses/:limit/:page',authentication,getAllExpensesforPagination)
expenseRoute.post("/addExpense", authentication, addExpense);
expenseRoute.delete("/delete/:id",authentication, deleteExpense);
expenseRoute.get("/downloadExpenses", authentication, downloadExpenseReport);
expenseRoute.post("/editExpense/:id",authentication,editExpense);
module.exports = expenseRoute;
