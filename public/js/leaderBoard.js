async function getLeaderBoardData() {
  try {
    const result = axios.get(
      "http://localhost:5800/premium/getLeaderBoardData"
    );
    const data = await result;
    console.log(data);
    showItems(data.data)
  } catch (err) {
    console.log(err);
  }
}

function showItems(data) {
    const tableBody = document.getElementById("list-items");
    data.forEach((item,index) => {
      const tr = document.createElement("tr");
      const th= document.createElement('th')
      th.setAttribute('scope','row');
      th.innerHTML=`${index+1}`
      const td1= document.createElement('td')
      const td2= document.createElement('td')
      td1.innerHTML=`<span class="badge bg-primary rounded-pill">${item.totalExpenses} &#8377</span>`
      td2.innerHTML=`${item.name}`
      
      tr.appendChild(th);
      tr.appendChild(td1)
      tr.appendChild(td2)
      tableBody.appendChild(tr);
    });
  }

  getLeaderBoardData();