const mongoose = require('mongoose');

const IncomeExpenseSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, required: false },
});

const IncomeExpense = mongoose.model('IncomeExpense', IncomeExpenseSchema);

module.exports = IncomeExpense;
