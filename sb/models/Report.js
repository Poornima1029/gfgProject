// backend/models/Report.js

const mongoose = require('mongoose');

// Define the schema for reports (income, expenses, savings, goals)
const ReportSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true, // income, expenses, savings, goals
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Report model
const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;
