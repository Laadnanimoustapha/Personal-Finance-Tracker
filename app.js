const form = document.getElementById("transaction-form");
const table = document.querySelector("#transaction-table tbody");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;
  const amount = document.getElementById("amount").value;
  const date = document.getElementById("date").value;
  const note = document.getElementById("note").value;

  const transaction = { type, category, amount, date, note };
  console.log("sending:", transaction);

  try {
    const res = await fetch("http://localhost/finance-tracker/backend/api/add_transaction.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction)
    });

    const result = await res.json();

    if (result.success) {
      alert("Transaction added!");
      form.reset();
      loadTransactions(); 
    } else {
      alert("Error: " + result.error);
    }
  } catch (error) {
    console.error("Error sending transaction:", error);
    alert("Failed to connect to backend.");
  }
});

async function loadTransactions() {
  try {
    const res = await fetch("http://localhost/finance-tracker/backend/api/get_transactions.php");
    const data = await res.json();

    table.innerHTML = ""; 

    data.forEach(t => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${t.type}</td>
        <td>${t.category}</td>
        <td>$${parseFloat(t.amount).toFixed(2)}</td>
        <td>${t.date}</td>
        <td>${t.note}</td>
      `;
      table.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading transactions:", error);
    table.innerHTML = `<tr><td colspan="5">Error loading data</td></tr>`;
  }
}

loadTransactions();
