const mongoose = require('mongoose');
const Ticket = require('../models/Ticket'); // Import your Ticket model

const cleanupTickets = async () => {
  try {
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000); 

    // Find and remove "pending" tickets created more than 30 seconds ago
    const result = await Ticket.deleteMany({
      status: 'pending',
      createdAt: { $lt: thirtyMinsAgo },
    });

    if (result.deletedCount > 0) {
      console.log(`Cleanup removed ${result.deletedCount} pending tickets.`);
    } else {
      console.log('No pending tickets to cleanup.');
    }
  } catch (error) {
    console.log('Cleanup failed:', error);
  }
};

module.exports = cleanupTickets;
