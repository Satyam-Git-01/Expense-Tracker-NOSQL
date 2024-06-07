const buyPremiumButton = document.getElementById("buyPremiumButton");
const reportsLink = document.getElementById("reportsLink");
const leaderboardLink = document.getElementById("leaderboardLink");
const logoutBtn = document.getElementById("logoutBtn");

async function buyPremium(e) {
  const token = localStorage.getItem("token");
  const res = await axios.get(
    "http://localhost:5800/purchase/premiumMembership",
    { headers: { Authorization: token } }
  );
  var options = {
    key: res.data.key_id, // Enter the Key ID generated from the Dashboard
    order_id: res.data.order.id, // For one time payment
    // This handler function will handle the success payment
    handler: async function (response) {
      const res = await axios.post(
        "http://localhost:5800/purchase/updateTransactionStatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );
      alert(
        "Welcome to our Premium Membership, You have now access to Reports and LeaderBoard"
      );
      window.location.reload();
      localStorage.setItem("token", res.data.token);
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();
}
async function addExpense(event) {
  event.preventDefault();
  const amount = event.target.amount.value;
  const description = event.target.description.value;
  const category = event.target.category.value;
  const token = localStorage.getItem("token");

  //Storing Date
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;
  const date = `${formattedDay}-${formattedMonth}-${year}`;

  const expenseData = {
    date,
    amount,
    description,
    category,
    token,
  };
  try {
    const result = await axios.post(
      "http://localhost:5800/expense/addExpense",
      expenseData,
      { headers: { Authorization: token } }
    );
    console.log(result);
    window.location.reload();
  } catch (err) {
    console.log(err);
  }
}

async function getAllExpenses() {
  try {
    const token = localStorage.getItem("token");
    const limit = localStorage.getItem("limit");
    const data = await axios.get(
      `http://localhost:5800/expense/getAllExpenses/${limit}/1`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log(data);
    showItems(data.data.expenses, data.data.totalPages);
  } catch (err) {
    console.log(err);
  }
}

function logout() {
  try {
    localStorage.clear();
    window.location.href = "/";
  } catch (error) {
    console.log(error);
  }
}

const premiumMessage = () => {
  alert("You are already a Premium Member");
};

const nonPremiumMessage = () => {
  alert("Buy Premium to access this feature!");
};

async function isPremiumUser() {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5800/user/isPremiumUser", {
      headers: { Authorization: token },
    });
    if (res.data.isPremiumUser) {
      buyPremiumButton.innerHTML = "Premium Member &#9889";
      reportsLink.innerHTML = "Report &#9889";
      leaderboardLink.innerHTML = "Leaderboard &#9889";
      reportsLink.removeEventListener("click", nonPremiumMessage);
      reportsLink.setAttribute("href", "/premium/getReportsPage");
      leaderboardLink.removeEventListener("click", nonPremiumMessage);
      buyPremiumButton.removeEventListener("click", buyPremium);
      buyPremiumButton.style.backgroundColor = "#7fff00";
      leaderboardLink.setAttribute("href", "/premium/getLeaderBoardPage");
      buyPremiumButton.addEventListener("click", premiumMessage);
    }
  } catch (err) {
    console.log(err);
  }
}

const selectLimit = (event) => {
  const value = document.getElementById("pageLimit").value;
  localStorage.setItem("limit", value);
  window.location.reload('/')
};

const tableBody = document.getElementById("list-items");
function showItems(data, totalPages) {
  data.forEach((item, index) => {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.innerHTML = `${index + 1}`;
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");
    td1.innerHTML = `<span class="badge bg-primary rounded-pill">${item.amount} &#8377</span>`;
    td2.innerHTML = `${item.description}`;
    td3.innerHTML = `${item.category}`;
    td4.innerHTML = `<div> <button class='btn btn-danger' onclick=deleteItem(${item.id})>Delete</button>  <button class='btn btn-dark' onclick=editExpense(event,${item.id})>Edit</button></div>`;
    tr.appendChild(th);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tableBody.appendChild(tr);
  });
  const paginationUL = document.getElementById("paginationUL");
  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    li.setAttribute("class", "page-item");
    a.setAttribute("class", "page-link");
    a.setAttribute("href", "#");
    a.appendChild(document.createTextNode(i));
    li.appendChild(a);
    paginationUL.appendChild(li);
    a.addEventListener("click", paginationBtn);
  }
}
async function editExpense(event, id) {
  try {
    const token = localStorage.getItem("token");
    const amount = document.getElementById("amount");
    const description = document.getElementById("description");
    const category = document.getElementById("category");
    const addExpenseBtn = document.getElementById("addbtn");
    const addForm = document.getElementById("addForm");
    const allExpenses = await axios.get(
      "http://localhost:5800/expense/getAllExpenses",
      {
        headers: {
          Authorization: token,
        },
      }
    );
    const expensetoEdit = allExpenses.data.result.filter(
      (item) => item.id === id
    )[0];
    amount.value = expensetoEdit.amount;
    description.value = expensetoEdit.description;
    addExpenseBtn.textContent = "Update";
    addForm.removeAttribute("onsubmit");
    addExpenseBtn.addEventListener("click", async function update(e) {
      e.preventDefault();
      const res = await axios.post(
        `http://localhost:5800/expense/editExpense/${id}`,
        {
          amount: amount.value,
          description: description.value,
          category: category.value,
        },
        { headers: { Authorization: token } }
      );
      window.location.reload();
    });
  } catch (err) {
    console.log("Reached");
  }
}
async function paginationBtn(e) {
  try {
    const pageNo = e.target.textContent;
    const token = localStorage.getItem("token");
    const limit = localStorage.getItem("limit");
    const result = await axios.get(
      `http://localhost:5800/expense/getAllExpenses/${limit}/${pageNo}`,
      {
        headers: { Authorization: token },
      }
    );
    tableBody.innerHTML = "";
    showItems(result.data.expenses);
  } catch (err) {
    console.log(err);
  }
}

async function deleteItem(id) {
  try {
    const token = localStorage.getItem("token");
    const result = await axios.delete(
      `http://localhost:5800/expense/delete/${id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    window.location.reload();
  } catch (err) {
    console.log(err);
  }
}

async function getLeaderBoardData() {
  try {
    const result = axios.get(
      "http://localhost:5800/premium/getLeaderBoardData"
    );
    const data = await result;
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

document.addEventListener("DOMContentLoaded", isPremiumUser);
document.addEventListener("DOMContentLoaded", getAllExpenses);
logoutBtn.addEventListener("click", logout);
buyPremiumButton.addEventListener("click", buyPremium);
reportsLink.addEventListener("click", nonPremiumMessage);
leaderboardLink.addEventListener("click", nonPremiumMessage);
