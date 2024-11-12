// middleware/authMiddleware.js
function authMiddleware(req, res, next) {
    const apiKey = process.env.VULTR_API_KEY;
    if (!apiKey) {
      return res.status(401).json({ error: 'Vultr API key is missing' });
    }
    next();
  }
  
  module.exports = { authMiddleware };
  