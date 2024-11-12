const express = require('express');
const router = express.Router();
const IncomeExpense = require('../models/IncomeExpense');

// Add income/expense
router.post('/incomeexpense', async (req, res) => {
    const { type, amount, category, date } = req.body;
    const entry = new IncomeExpense({ type, amount, category, date });

    try {
        await entry.save();
        res.status(201).json(entry);
    } catch (err) {
        res.status(400).json({ error: 'Error saving entry' });
    }
});

// Fetch all transactions for reports
router.get('/incomeexpense', async (req, res) => {
    try {
        const entries = await IncomeExpense.find();
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
