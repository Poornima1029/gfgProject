document.addEventListener('DOMContentLoaded', async () => {
    // Load existing entries when the page loads
    await fetchAndDisplayEntries();
  });
  
  document.getElementById('budgetEntryForm').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    // Capture form data
    const type = document.getElementById('entryType').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const month = document.getElementById('month').value;
  
    // Basic validation
    if (!type || isNaN(amount) || !month) {
      alert('Please fill in all fields.');
      return;
    }
  
    // Data object to send to the backend
    const data = { type, amount, month };
  
    try {
      const response = await fetch('http://localhost:5001/api/budget/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const result = await response.json();
        displayMessage(result.message, 'success');
        addEntryToTable(result.entry);
      } 
    } catch (error) {
      console.error(error);
      displayMessage('Error saving entry.', 'error');
    }
  
    // Clear form
    document.getElementById('budgetEntryForm').reset();
  });
  
  async function fetchAndDisplayEntries() {
    try {
      const response = await fetch('http://localhost:5001/api/budget/get');
      console.log('Fetch response status:', response.status); // Log response status
      if (response.ok) {
        const entries = await response.json();
        entries.forEach(entry => addEntryToTable(entry));
      }
    } catch (error) {
      console.error(error); // Log network errors
      
    }
  }
  
  // Function to add a new entry to the table
  function addEntryToTable(entry) {
    const tableBody = document.getElementById('budgetEntries');
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${entry.type}</td>
      <td>${entry.month}</td>
      <td>${entry.amount}</td>
      <td>
        <button onclick="deleteEntry('${entry._id}')">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  }
  
  // Function to display messages to the user
  function displayMessage(message, type) {
    const messageContainer = document.createElement('div');
    messageContainer.className = `message ${type}`;
    messageContainer.textContent = message;
  
    document.body.prepend(messageContainer);
  
    setTimeout(() => {
      messageContainer.remove();
    }, 3000); // Message disappears after 3 seconds
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    // Reference to overlay and button
    const summaryButton = document.getElementById('summaryButton');
    const summaryOverlay = document.getElementById('summaryOverlay');
    const closeOverlayBtn = document.getElementById('closeOverlayBtn');
    const summaryContent = document.getElementById('summaryContent');
  
    // Event listeners for opening and closing the overlay
    summaryButton.addEventListener('click', showSummary);
    closeOverlayBtn.addEventListener('click', () => {
      summaryOverlay.style.display = 'none';
    });
  
    async function showSummary() {
      // Fetching the entries from the backend
      try {
        const response = await fetch('http://localhost:5001/api/budget/get');
        if (response.ok) {
          const entries = await response.json();
          const totals = calculateTotals(entries);
    
          // Insert totals at the top of the summary content
          summaryContent.innerHTML = `
            <p>Total Income: ${totals.income}</p>
            <p>Total Expenses: ${totals.expenses}</p>
            <p>Total Savings: ${totals.savings}</p>
            <p>Total Goals: ${totals.goals}</p>
          `;
    
          // Build and display the table
          let tableHTML = `
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Month</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
          `;
    
          entries.forEach(entry => {
            tableHTML += `
              <tr>
                <td>${entry.type}</td>
                <td>${entry.month}</td>
                <td>${entry.amount}</td>
              </tr>
            `;
          });
    
          tableHTML += '</tbody></table>';
          summaryContent.innerHTML += tableHTML;
    
          // Show overlay
          summaryOverlay.style.display = 'flex';
        } else {
          summaryContent.innerHTML = '<p>Error fetching entries.</p>';
          summaryOverlay.style.display = 'flex';
        }
      } catch (error) {
        console.error('Error fetching entries:', error);
        summaryContent.innerHTML = '<p>Error fetching entries.</p>';
        summaryOverlay.style.display = 'flex';
      }
    }
    
  });
  
  // Sorting function for the table
  function sortTableByColumn(columnIndex) {
    const rows = Array.from(document.querySelectorAll("table tbody tr"));
    const sortedRows = rows.sort((a, b) => {
      const cellA = a.cells[columnIndex].textContent.trim();
      const cellB = b.cells[columnIndex].textContent.trim();
  
      if (!isNaN(cellA) && !isNaN(cellB)) {
        return parseFloat(cellA) - parseFloat(cellB);
      }
      return cellA.localeCompare(cellB);
    });
  
    const tbody = document.querySelector("table tbody");
    tbody.innerHTML = '';
    sortedRows.forEach(row => tbody.appendChild(row));
  }
  
  // Event listeners for sorting when a user clicks the table header
  document.querySelectorAll("table th").forEach((th, index) => {
    th.addEventListener("click", () => sortTableByColumn(index));
  });
  
  // Filtering functionality
  document.getElementById("typeFilter").addEventListener("change", filterEntries);
  document.getElementById("monthFilter").addEventListener("change", filterEntries);
  
  function filterEntries() {
    const typeFilter = document.getElementById("typeFilter").value.toLowerCase();
    const monthFilter = document.getElementById("monthFilter").value.toLowerCase();
    
    const rows = document.querySelectorAll("table tbody tr");
    rows.forEach(row => {
      const type = row.cells[0].textContent.toLowerCase();
      const month = row.cells[1].textContent.toLowerCase();
      
      const typeMatches = !typeFilter || type.includes(typeFilter);
      const monthMatches = !monthFilter || month.includes(monthFilter);
      
      if (typeMatches && monthMatches) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  }
  
  // Search functionality
  document.getElementById('searchInput').addEventListener('input', function () {
    const searchQuery = this.value.toLowerCase();
    const rows = document.querySelectorAll('table tbody tr');
    
    rows.forEach(row => {
      const cells = Array.from(row.cells);
      const matches = cells.some(cell => cell.textContent.toLowerCase().includes(searchQuery));
      row.style.display = matches ? '' : 'none';
    });
  });
  
  // Function to calculate totals (Income, Expenses, Savings, Goals)
  function calculateTotals(entries) {
    let income = 0, expenses = 0, savings = 0, goals = 0;
  
    entries.forEach(entry => {
      switch (entry.type) {
        case "income":
          income += entry.amount;
          break;
        case "expenses":
          expenses += entry.amount;
          break;
        case "savings":
          savings += entry.amount;
          break;
        case "goals":
          goals += entry.amount;
          break;
      }
    });

    
  
    return { income, expenses, savings, goals };
  }
  
  // CSV export functionality
  function downloadCSV(entries) {
    const header = ['Type', 'Month', 'Amount'];
    const rows = entries.map(entry => [entry.type, entry.month, entry.amount]);
  
    const csvContent = [
      header.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'budget_entries.csv';
    link.click();
  }
  
  // CSV export button event listener
  document.getElementById('exportCSVButton').addEventListener('click', async () => {
    const response = await fetch('http://localhost:5001/api/budget/get');
    const entries = await response.json();
    downloadCSV(entries);
  });
  
  // Trigger summary display
  showSummary();
  

  // Store form data (in-memory or can be extended to use localStorage or database)
let entries = [];

// Handle form submission
document.getElementById('budgetEntryForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const entryType = document.getElementById('entryType').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const month = document.getElementById('month').value;

  // Validate inputs
  if (!entryType || !amount || !month) {
    alert("Please fill out all fields.");
    return;
  }

  // Store the entry
  entries.push({ type: entryType, amount, month });

  // Clear the form
  document.getElementById('budgetEntryForm').reset();

  // Optionally, you can add a message saying the entry was added successfully
  alert('Entry added!');
});

