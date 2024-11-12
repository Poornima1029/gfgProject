const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true },
  date: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Budget', budgetSchema);
