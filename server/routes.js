/**
 * Main application routes
 */

'use strict';

var path = require('path');
var express =require('express')
module.exports = function(app) {

  // Insert routes below
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));
  
  app.use(express.static(path.join(__dirname, './static'))); // server side files rendering 
  app.use(express.static('./static/'));
  app.get('/', getIndexFile); // get index file
  app.get('/*', getAllFiles); // get all files

  function getIndexFile(request, response) {
    response.sendFile(path.resolve('./static/index.html'));
    response.end();
  }
  
  function getAllFiles(request, response) {
    response.sendFile(path.resolve('./static/index.html'));
    response.end();
  }
  
};
