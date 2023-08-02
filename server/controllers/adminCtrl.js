const User = require('../models/User');
const Event = require('../models/Event');
const Address = require('../models/Address')

const getUsers = async (req, res) => {
    try {
      const users = await User.find(); 
      console.log("hello");
      res.status(200).json(users); 
    } catch (error) {
      res.status(500).json({ error: error.message }); 
    }
};

const blockUser = async (req, res) => {
    try {
        
      const user = await User.findById(req.params.userId);
      console.log(user);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the isBlocked field and save the changes
      user.isBlocked = !user.isBlocked;
      await user.save();
  
      res.json({ message: 'User blocked status updated' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

module.exports = {
    getUsers,
    blockUser
};