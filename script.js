// 👇 Paste your real Google Sheet CSV link between the quotes
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT_50tEvGNtXO-vo648GSwN_3Pb3QJUbAmjFBcqRcHUYnfpNUUuw8dK47GMWF37pk0-NlZprNBGWVmT/pub?gid=0&single=true&output=csv";

async function loadData() {
  const response = await fetch(sheetURL);
  const text = await response.text();
  const rows = text.trim().split("\n").map(r => r.split(","));
  const tableBody = document.querySelector("#expenseTable tbody");
  tableBody.innerHTML = "";

  let totals = { Junk: 0, Diet: 0, Personal: 0, Work: 0 };
  let totalExpense = 0;

  rows.slice(1).forEach(row => {
    const [date, junk, diet, personal, work] = row;
    const j = +junk || 0, d = +diet || 0, p = +personal || 0, w = +work || 0;
    const rowTotal = j + d + p + w;
    totals.Junk += j; totals.Diet += d; totals.Personal += p; totals.Work += w;
    totalExpense += rowTotal;

    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${date}</td><td>${j}</td><td>${d}</td><td>${p}</td><td>${w}</td><td><b>${rowTotal}</b></td>`;
    tableBody.appendChild(tr);
  });

  const startingBalance = 1000;
  const balance = startingBalance - totalExpense;
  document.getElementById("balance").textContent = `Remaining Balance: $${balance}`;

  new Chart(document.getElementById("chart"), {
    type: "pie",
    data: {
      labels: ["Junk", "Diet", "Personal", "Work"],
      datasets: [{ data: [totals.Junk, totals.Diet, totals.Personal, totals.Work],
                   backgroundColor: ["#ff7675", "#74b9ff", "#55efc4", "#ffeaa7"] }]
    }
  });
}
loadData();
