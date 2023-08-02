const User = require('../models/User');
const Event = require('../models/Event');
const Address = require('../models/Address')

  
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
      console.log("passed")
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
    const { eventId, image, tickets } = req.body;

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
    await event.save();

    res.status(200).json({ message: 'Event updated successfully', event });
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
    const event = await Event.findById(req.params.eventId).populate('address');;
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    console.log(event)
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const allEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).send(error);
  }
};  

const profile = async (req, res) => {
  try {
    const userId = await req.session.userId ;
    const user = await User.findById(userId);
    const eventCount = await Event.countDocuments({ organizer: userId });
    console.log(req.session)
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
    console.log(req.session)
    res.status(200).send({ ...user.toObject(), eventCount });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

  module.exports = {
    createEvent,
    uploadImage,
    updateEvent,
    myEvents,
    profile,
    singleEvent,
    allEvents,
    adminProfile    
  };