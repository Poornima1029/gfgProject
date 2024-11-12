// routes/report.js (new route for reports)
const express = require('express');
const IncomeExpense = require('../models/IncomeExpense'); // Assuming the model is the same

const router = express.Router();

// routes/report.js
router.get('/analytics', async (req, res) => {
    try {
        const entries = await IncomeExpense.find();

        let totalIncome = 0;
        let totalExpenses = 0;
        const monthlyData = {
            income: Array(12).fill(0),
            expenses: Array(12).fill(0)
        };

        entries.forEach(entry => {
            const month = new Date(entry.date).getMonth(); // Get the month (0-11)
            if (entry.type === 'income') {
                totalIncome += entry.amount;
                monthlyData.income[month] += entry.amount;
            } else if (entry.type === 'expense') {
                totalExpenses += entry.amount;
                monthlyData.expenses[month] += entry.amount;
            }
        });

        const remainingBalance = totalIncome - totalExpenses;

        // Return the analytics data and monthly data for the chart
        res.json({
            totalIncome,
            totalExpenses,
            remainingBalance,
            monthlyData,
            entries
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
