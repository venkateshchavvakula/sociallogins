'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb+srv://venk519:Suneetha147!@cluster0-3p0id.mongodb.net/social_login?retryWrites=true&w=majority'
  },
  
  

email:'test@test.com', // email configure for node-mailer
password:'Test@123',    // password configure for node-mailer
backendurl:'http://localhost:9000',
  seedDB: false  // set false if you don't want to create seed data when server starts
};
