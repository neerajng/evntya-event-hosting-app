const User = require('../models/User');
const Event = require('../models/Event');
const Address = require('../models/Address')
const bcrypt = require('bcrypt');

  
const createEvent = async (req, res) => {
    try {
      const { name, startTime, endTime, category, description, location, city, state, country, meetLink } = req.body;
        const organizer = await req.session.userId
        // Create Address document
        const address = new Address({ location, city, state, country });
        await address.save();

        // Create Event document with reference to Address document
        const event = new Event({ name, startTime, endTime, category, description, address: address._id,organizer : organizer, meetLink });
        await event.save();

      res.status(200).send({ message: 'Please add further details', event });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
};
  

const uploadImage = async (req, res) => {
  try {
      
      const imageUrl = req.file.path
      console.log(imageUrl);
      res.json({ imageUrl: imageUrl });
  }
  catch (error){
    return res.status(500).send({ error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { eventId, image, tickets, publishTime } = req.body;

    // Validate the data
    if (!eventId) {
      return res.status(400).json({ error: 'Missing event ID' });
    }

    // Find the event document
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Update the event document with the image and ticket information
    event.image = image;
    event.tickets = tickets;
    event.publishTime = publishTime;
    await event.save();

    res.status(200).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
  

const myEvents = async (req, res) => {
  try {
    const userId = await req.session.userId ;
    const events = await Event.find({ organizer: userId });
    res.status(200).send(events);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const singleEvent = async (req, res) => {
  try {
    console.log(req.params)
    const event = await Event.findById(req.params.eventId).populate('address').populate('organizer');

    console.log(event)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const allEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ _id: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).send(error);
  }
};  

const cancelEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    // Update the event in the database
    const event =await Event.findOne({ _id: eventId });
    event.canceled = true
    await event.save();
    console.log(event);  
    return res.json({ message: 'Event canceled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

//edit event

const editEvent = async (req, res) => {
  try {
    const eventId = await req.params.id;
    const { name, startTime, endTime, category, description, location, city, state, country, meetLink } = req.body;

    // Validate the data
    if (!eventId) {
      return res.status(400).json({ error: 'Missing event ID' });
    }

    // Find the event document
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Update the event document with the new data
    event.name = name;
    event.startTime = startTime;
    event.endTime = endTime;
    event.category = category;
    event.description = description;
    event.meetLink = meetLink;

    // Update the address document with the new data
    const address = await Address.findById(event.address);
    address.location = location;
    address.city = city;
    address.state = state;
    address.country = country;
    await address.save();

    await event.save();

    res.status(200).json({ message: 'Event edited successfully', event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const editEventTwo = async (req, res) => {
  try {
    const { eventId, image, tickets, publishTime } = req.body;

    // Find the event document
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Update the event document with the new data
    event.image = image;
    event.tickets = tickets;
    event.publishTime = publishTime;
    await event.save();

    res.status(200).json({ message: 'Event updated successfully', event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};  

const searchEvents = async (req, res) => {  
  try {
    const cityAliases = {
      "Trivandrum": "Thiruvananthapuram",
      "Bangalore": "Bengaluru",
    };
    let { location, category } = req.query;
    location = cityAliases[location] || location; // Normalize city name
    console.log(location)
    let categories = [];
    console.log(location);
    switch(category) {
      case 'Online':
        categories = ['Online'];
        break;
      case 'Hybrid':
        categories = ['Hybrid'];
        break;
      case 'Offline':
        categories = ['Venue'];
        break;
      case 'All Events':
        categories = ['Online', 'Hybrid', 'Venue'];
        break;
      default:
        return res.status(400).json('Invalid category');
    }
    console.log(categories)
    
    let matchStage = { category: { $in: categories } };
    if (location !== "World Wide") {
      matchStage['address.city'] = location;
    }
    

    const events = await Event.aggregate([
      {
        $lookup: {
          from: 'addresses', // Use the actual name of the Address collection here
          localField: 'address',
          foreignField: '_id',
          as: 'address'
        }
      },
      { $unwind: '$address' },
      { $match: matchStage }
    ]);
    console.log(matchStage)
    res.status(200).json(events);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
};



const profile = async (req, res) => {
  try {
    
    const userId = await req.session.userId ;
    const user = await User.findById(userId);
    const eventCount = await Event.countDocuments({ organizer: userId });
    
    res.status(200).send({ ...user.toObject(), eventCount });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const adminProfile = async (req, res) => {
  try {
    const userId = await req.session.userId ;
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
  const user = await User.findById(req.session.userId); 
  
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
    createEvent,
    uploadImage,
    updateEvent,
    myEvents,
    profile,
    singleEvent,
    allEvents,
    cancelEvent,
    editEvent,
    editEventTwo,

    searchEvents,

    adminProfile,
    updateProfile    
  };