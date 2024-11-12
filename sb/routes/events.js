const express = require('express');
const router = express.Router();
const IncomeExpense = require('../models/IncomeExpense');

// Get all income/expense entries
router.get('/incomeexpense', async (req, res) => {
    try {
        const entries = await IncomeExpense.find();
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Save income/expense entry
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


module.exports = router;
