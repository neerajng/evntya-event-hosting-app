const User = require('../models/User');	

const checkBlocked = async (req, res, next) => {
    try {   
      
      console.log("checkblocked") 
      const userId = req.user.userId;
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Check if the user is blocked
      if (user.isBlocked) {
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

  module.exports = checkBlocked
  