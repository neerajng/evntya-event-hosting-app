const User = require('../models/User');
const Event = require('../models/Event');


const profile = async (req, res) => {

    try {
      console.log(req.user)    
      const userId = await req.user.userId ;
      const user = await User.findById(userId);
      const eventCount = await Event.countDocuments({ organizer: userId });
      
      res.status(200).send({ ...user.toObject(), eventCount });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  };  
  
const updateProfile = async (req, res) => {
    try{
    const { firstName, lastName, email, password } = req.body;
  
    // Find the user in the database and update their information
    const user = await User.findById(req.user.userId); 
    
    // Verify the provided current password against the stored hashed password
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Please enter the correct password' });
    }
  
    // Check if email already exists in the database
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
  
    await user.save();
  
    res.status(200).json({message:"User profile updated successfully"});
  
    }catch (error) {
      return res.status(500).send({ error: error.message });
    }
}

module.exports = {
    profile,
    updateProfile
}