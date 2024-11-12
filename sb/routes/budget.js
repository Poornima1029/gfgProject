const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

router.post('/add', async (req, res) => {
  console.log('Received POST request at /add with body:', req.body); // Log request data
  try {
    const newEntry = new Budget(req.body);
    const savedEntry = await newEntry.save();
    console.log('Entry saved successfully:', savedEntry); // Confirm save
    res.status(201).json({ message: 'Entry added successfully', entry: savedEntry });
  } catch (err) {
    console.error('Error occurred while saving entry:', err); // Detailed logging
    
  }
});


// Route to get all budget entries
router.get('/get', async (req, res) => {
  try {
    const entries = await Budget.find().sort({ date: -1 }); // Retrieve entries sorted by date (latest first)
    res.status(200).json(entries);
  } catch (err) {
    res.status(500).json({details: err.message });
  }
});



module.exports = router;
