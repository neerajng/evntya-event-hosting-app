const User = require('../models/User');	
const jwt = require("jsonwebtoken");

const checkBlocked = async (req, res, next) => {
    try {
      // Get the user ID from the session or authentication token
      console.log(req.headers.authorization.split(' ')[1])

      // const decoded = jwt.decode(token);
      const userId = req.session.userId || req.user.userId;
       console.log(userId) 
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Check if the user is blocked
      if (user.isBlocked) {
        // Clear the session or authentication token
        req.session.destroy();
        req.user = null;
  
        // Return an error response
        return res.status(403).json({ error: 'You have been blocked' });
      }
  
      // Continue processing the request
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  module.exports ={
    checkBlocked
  }
  