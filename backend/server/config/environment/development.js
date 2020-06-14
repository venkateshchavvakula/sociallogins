'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb+srv://<username>:<password>@cluster0-q5fcm.mongodb.net/test?retryWrites=true&w=majority'
  },


email:'test@test.com', // email configure for node-mailer
password:'Test@123',    // password configure for node-mailer
backendurl:'http://localhost:9000',
  seedDB: true  // set false if you don't want to create seed data when server starts
};
