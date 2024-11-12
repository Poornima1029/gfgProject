// Fetch budget data and generate the bar chart
async function fetchBudgetData() {
    try {
      const response = await fetch('http://localhost:5001/api/budget/get');
      if (response.ok) {
        const entries = await response.json();
        const totals = calculateTotals(entries);
  
        // Update summary cards with totals
        document.getElementById('totalIncome').textContent = `${totals.income}`;
        document.getElementById('totalExpense').textContent = `${totals.expenses}`;
        document.getElementById('remainingBudget').textContent = `${totals.income - totals.expenses}`;
        document.getElementById('budgetGoal').textContent = `1000.00`;  // Change dynamically based on user data
  
        // Create the bar chart
        createBarChart(totals);
      }
    } catch (error) {
      console.error('Error fetching budget data:', error);
    }
  }
  
  // Calculate totals for income, expenses, savings, and remaining balance
  function calculateTotals(entries) {
    let income = 0, expenses = 0, savings = 0;
  
    entries.forEach(entry => {
      switch (entry.type) {
        case 'income':
          income += entry.amount;
          break;
        case 'expenses':
          expenses += entry.amount;
          break;
        case 'savings':
          savings += entry.amount;
          break;
      }
    });
  
    return { income, expenses, savings };
  }
  
  // Create the bar chart
  function createBarChart(totals) {
    const ctx = document.getElementById('budgetBarChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Income', 'Expenses', 'Remaining Budget'],
        datasets: [{
          label: 'Amount (INR)',
          data: [totals.income, totals.expenses, totals.income - totals.expenses],
          backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(153, 102, 255, 0.2)'],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(153, 102, 255, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  // Initialize dashboard data on page load
  document.addEventListener('DOMContentLoaded', () => {
    fetchBudgetData();
  });
  

  