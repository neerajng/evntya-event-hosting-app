const User = require('../models/User');
const Event = require('../models/Event');

const getUsers = async (req, res) => {
    try {
      const users = await User.find(); 
      res.status(200).json(users); 
    } catch (error) {
      res.status(500).json({ error: error.message }); 
    }
};

const adminProfile = async (req, res) => {
  try {
    const userId = await req.user.userId ;
    const user = await User.findById(userId);
    const eventCount = await Event.countDocuments({ organizer: userId });
    
    res.status(200).send({ ...user.toObject(), eventCount });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const blockUser = async (req, res) => {
    try {
        
      const user = await User.findById(req.params.userId);
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
    adminProfile,
    blockUser
};