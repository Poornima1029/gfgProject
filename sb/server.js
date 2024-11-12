const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const incomeExpenseRoutes = require('./routes/incomeExpense');
const auth = require('./routes/auth'); // Ensure it's using CommonJS syntax
const budgetRoutes = require('./routes/budget');
const reportRoutes = require('./routes/reportRoutes'); 

    



const app = express();

app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5001;


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // This tells Express to serve files from the 'public' directory



// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define the root route
app.get('/', (_req, res) => {
    res.sendFile(__dirname + '/public/index.html'); // Serve the index.html file
});


// Use the auth routes
app.use('/api', auth); // Ensure your auth routes are correctly set up
app.use(express.json()); // Parse JSON bodies
app.use('/api/incomeexpense', incomeExpenseRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/reportRoutes', reportRoutes);


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
