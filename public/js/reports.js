const downloadReportBtn = document.getElementById("downloadReportBtn");
async function getDowloadedReportsData() {
  try {
    const token = localStorage.getItem("token");
    const result = axios.get(
      "http://localhost:5800/premium/getDownloadedReportsData",
      {
        headers: {
          Authorization: token,
        },
      }
    );
    const data = await result;
    console.log(data.data.result);
    showItems(data.data.result);
  } catch (err) {
    console.log(err);
  }
}

function showItems(data) {
  const tableBody = document.getElementById("list-items");
  data.forEach((item, index) => {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.innerHTML = `${index + 1}`;
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    td1.innerHTML = `<a href='${item.url}'>${item.url}</a>`;
    td2.innerHTML = `${item.generatedOn}`;

    tr.appendChild(th);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tableBody.appendChild(tr);
  });
}

async function getExpenses() {
  try {
    const token = localStorage.getItem("token");
    const result = await axios.get(
      "http://localhost:5800/expense/downloadExpenses",
      {
        headers: { Authorization: token },
      }
    );
    location.reload();
    let linkOfDownload = document.createElement("a");
    linkOfDownload.href = `${result.data.fileURL}`;
    linkOfDownload.download = "expense.txt";
    linkOfDownload.click();
  } catch (err) {
    console.log(err);
  }
}

document.addEventListener("DOMContentLoaded", getDowloadedReportsData);
downloadReportBtn.addEventListener("click", getExpenses);
