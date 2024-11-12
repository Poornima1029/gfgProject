    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('incomeExpenseForm');
        const typeSelect = document.getElementById('type');
        const categorySelect = document.getElementById('category');
        const saveButton = document.getElementById('saveButton');
        const modal = document.getElementById('historyModal');
        const closeButton = document.querySelector('.close-button');
        const historyList = document.getElementById('historyList');

        // Define categories
        const incomeCategories = ["Salary", "Bonus", "Freelance"];
        const expenseCategories = ["Groceries", "Rent", "Utilities"];

        // Update form fields based on the selected type
        function updateFormFields() {
            const selectedType = typeSelect.value;
            categorySelect.innerHTML = ''; // Clear current options

            const categories = selectedType === 'income' ? incomeCategories : expenseCategories;
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                categorySelect.appendChild(option);
            });

            // Update button text based on selection
            saveButton.textContent = selectedType === 'income' ? 'Save Income' : 'Save Expense';
        }

        // Open modal
        document.getElementById('viewHistoryButton').addEventListener('click', () => {
            modal.style.display = 'block';
            loadHistory(); // Load the history data when modal opens
        });

        // Close modal
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close modal if clicked outside of modal content
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        document.getElementById('viewHistoryButton').addEventListener('click', () => {
            modal.style.display = 'block';
            loadHistory(); // Load history when modal opens
        });
        

        // Load transaction history
        async function loadHistory() {
            try {
                const response = await fetch('http://localhost:5001/api/incomeexpense');
                if (!response.ok) throw new Error('Failed to load history');

                const historyData = await response.json();
                historyList.innerHTML = ''; // Clear current history data

                historyData.forEach(entry => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${new Date(entry.date).toLocaleDateString()}</td>
                        <td>${entry.type}</td>
                        <td>${entry.amount.toFixed(2)}</td>
                        <td>${entry.category}</td>
                        <td>
                            <span class="delete-button" onclick="deleteEntry('${entry._id}')">Delete</span>
                        </td>
                    `;
                    historyList.appendChild(row);
                });
            } catch (error) {
                console.error('Error fetching history:', error);
            }
        }

        // Save income/expense entry
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                type: typeSelect.value,
                amount: parseFloat(document.getElementById('amount').value),
                category: categorySelect.value,
                date: new Date(document.getElementById('date').value).toISOString(),
            };

            try {
                const response = await fetch('http://localhost:5001/api/incomeexpense', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) throw new Error('Failed to save entry');

                form.reset();
                updateFormFields(); // Reset categories based on type
                loadHistory(); // Refresh history after saving
            } catch (error) {
                console.error('Error saving entry:', error);
            }
        });

    // Attach deleteEntry to the window object to make it globally accessible
    window.deleteEntry = async function (id) {
        try {
            const response = await fetch(`http://localhost:5001/api/incomeexpense/${id}`, { method: 'DELETE' });
            
            if (response.status === 404) {
                console.warn('Entry not found');
                return;
            }
            
            if (!response.ok) throw new Error('Failed to delete entry');

            loadHistory(); // Refresh the history after deletion
        } catch (error) {
            console.error('Error deleting entry:', error);
        }
    };

        

        // Initial call to populate category on page load
        updateFormFields();

        // Make updateFormFields globally accessible
        window.updateFormFields = updateFormFields;
    });

    