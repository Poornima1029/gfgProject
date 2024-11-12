// Fetch and display data for the charts
async function fetchChartData() {
    try {
        const response = await fetch('http://localhost:5001/api/incomeexpense');
        const data = await response.json();

        // Separate income and expense data
        const incomeData = data.filter(entry => entry.type === 'income');
        const expenseData = data.filter(entry => entry.type === 'expense');

        // Summarize data for Income vs Expense chart
        const totalIncome = incomeData.reduce((sum, entry) => sum + entry.amount, 0);
        const totalExpense = expenseData.reduce((sum, entry) => sum + entry.amount, 0);

        // Prepare data for Category Breakdown chart
        const categories = {};
        data.forEach(entry => {
            if (!categories[entry.category]) {
                categories[entry.category] = 0;
            }
            categories[entry.category] += entry.amount;
        });

        // Generate the charts
        renderIncomeExpenseChart(totalIncome, totalExpense);
        renderCategoryChart(categories);

    } catch (error) {
        console.error('Error fetching chart data:', error);
    }
}

// Render Income vs Expense Chart
function renderIncomeExpenseChart(income, expense) {
    new Chart(document.getElementById('incomeExpenseChart'), {
        type: 'bar',
        data: {
            labels: ['Income', 'Expense'],
            datasets: [{
                label: 'Amount',
                data: [income, expense],
                backgroundColor: ['#D0E8C5', '#FF8A8A']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true },
                title: { display: true, text: 'Income vs Expense' }
            }
        }
    });
}

// Render Category Breakdown Chart
function renderCategoryChart(categories) {
    new Chart(document.getElementById('categoryChart'), {
        type: 'pie',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: ['#D0E8C5', '#FF8A8A', '#E5D9F2', 'FEF9D9']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true },
                title: { display: true, text: 'Category Breakdown' }
            }
        }
    });
}
function displayWarning(showWarning) {
    warningSection.style.display = showWarning ? 'block' : 'none';
}
// Call function to fetch and display data
fetchChartData();
