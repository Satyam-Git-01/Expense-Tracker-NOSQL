const path = require("path");
const { uploadTos3 } = require("../services/S3Services");

const expenseModel = require("../models/expenseModel");
const userModel = require("../models/userModel");
const fileDownloadedModel = require("../models/fileDownloadedModel");

const getHomePage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "homepage.html"));
};

const getAllExpenses = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const expenses = await expenseModel.find({ createdBy: userId });
    return res.status(200).json({ success: true, result: expenses });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Can not get All Expenses at this moment",
    });
  }
};

const getAllExpensesforPagination = async (req, res, next) => {
  try {
    const pageNo = req.params.page;
    const limit = Number(req.params.limit);
    //offset - number of records want to ignore
    const offset = (pageNo - 1) * limit;
    const totalExpenses = await expenseModel.countDocuments({
      createdBy: req.user._id,
    });
    const totalPages = Math.ceil(totalExpenses / limit);
    const expenses = await expenseModel
      .find({ createdBy: req.user._id })
      .skip(offset)
      .limit(limit);
    res.json({ expenses: expenses, totalPages: totalPages });
  } catch (err) {
    console.log(err);
  }
};

const downloadExpenseReport = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const expenses = await getExpenses(userId);
    const stringifiedData = JSON.stringify(expenses);
    const fileName = `Expense-${req.user.id}/${new Date()}.txt`;
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const date = `${formattedDay}-${formattedMonth}-${year}`;
    const fileURL = await uploadTos3(stringifiedData, fileName);
    const result = await fileDownloadedModel.create({
      url: fileURL,
      userId: userId,
      generatedOn: date,
    });
    return res.status(200).json({ success: true, fileURL: fileURL });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, fileURL: null });
  }
};

/**
 * @description get all expenses of a given userId
 * @param {*} userId
 * @returns
 */
const getExpenses = async (userId) => {
  try {
    const data = await expenseModel.find({ createdBy: userId });
    return data;
  } catch (err) {
    return null;
  }
};

const addExpense = async (req, res, next) => {
  try {
    let previousTotalExpenses = req.user.totalExpenses;
    const userId = req.user._id;
    const { date, amount, description, category } = req.body;
    await userModel.updateOne(
      { _id: userId },
      { totalExpenses: Number(previousTotalExpenses) + Number(amount) }
    );
    await expenseModel.create({
      date,
      amount,
      description,
      category,
      createdBy: userId,
    });
    return res
      .status(201)
      .json({ success: true, message: "expense added successfully" });
  } catch (err) {
    console.log(err);
    return res
      .json(400)
      .json({ success: false, message: "Error while adding Expense" });
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const expense = await expenseModel.findOne({ _id: req.params.id });
    console.log(expense);
    await expenseModel.deleteOne({ _id: req.params.id });
    await userModel.updateOne(
      { _id: req.user._id },
      {
        totalExpenses: Number(req.user.totalExpenses) - Number(expense.amount),
      }
    );
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Error While Deleting Expense" });
  }
};
const editExpense = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = req.body.category;
    const description = req.body.description;
    const amount = req.body.amount;
    const expense = await expenseModel.findOne({ _id: id });
    await userModel.updateOne(
      { _id: req.user._id },
      {
        totalExpenses:
          Number(req.user.totalExpenses) -
          Number(expense.amount) +
          Number(amount),
      }
    );
    await expenseModel.updateOne(
      { $and: [{ _id: id }, { createdBy: req.user._id }] },
      {
        category: category,
        description: description,
        amount: amount,
      }
    );

    res.redirect("/expense");
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  getAllExpenses,
  getHomePage,
  addExpense,
  getExpenses,
  deleteExpense,
  downloadExpenseReport,
  getAllExpensesforPagination,
  editExpense,
};
