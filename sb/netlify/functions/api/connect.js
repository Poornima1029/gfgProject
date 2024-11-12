const mongoose = require('mongoose');
require('dotenv').config();

module.exports.handler = async (event, context) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Connected to MongoDB' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error connecting to MongoDB', error }),
    };
  }
};
