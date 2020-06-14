'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');

var validationError = function(res, err) {
  return res.status(422).json(err);
}

/**
 * @api {get} /  Get list of user restriction: 'admin'
 * @apiHeader (Authorization) {String} authorization Bearer Authorization value will sent through headers. 
 * @apiName index
 * @apiGroup user
 * @apiSuccess {array}  Get list of users  
 * @apiError 500-InternalServerError SERVER error.
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.status(500).send(err);
    res.status(200).json(users);
  });
};




/**
 * @api {post} /  Create  New user
 * @apiName create
 * @apiGroup user
 * @apiSuccess {json}   token
 * @apiError 500-InternalServerError SERVER error.
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresIn: '10h'});
    res.json({ token: token });
  });
};

/**
 * @api {get} /:id  Get selected user
 * @apiHeader (Authorization) {String} authorization Bearer Authorization value will sent through headers. 
 * @apiName show
 * @apiGroup user
 * @apiSuccess {json}  Get selected usee  
 * @apiError 401 - Unauthorized
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user);
  });
};

/**
 * @api {delete} /:id     Delete selected restriction: 'admin'
 * @apiHeader (Authorization) {String} authorization Bearer Authorization value will sent through headers. 
 * @apiName destroy
 * @apiGroup user
 * @apiSuccess {string} no content
 * @apiError 500-InternalServerError SERVER error.
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.status(500).send(err);
    return res.status(204).send('No Content');
  });
};


/**
 * @api {post} /:id/password  Change user password
 * @apiHeader (Authorization) {String} authorization Bearer Authorization value will sent through headers. 
 * @apiName changePassword
 * @apiGroup user
 * @apiSuccess {String}   Change Successfully
 * @apiError 500-InternalServerError SERVER error, 403 Forbidden
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.status(200).send('Change Sucessfully');
      });
    } else {
      res.status(403).send('Forbidden');
    }
  });
};





/**
 * @api {get} /me  Get User Profile
 * @apiHeader (Authorization) {String} authorization Bearer Authorization value will sent through headers. 
 * @apiName me
 * @apiGroup user
 * @apiSuccess {String}   
 * @apiError 401- Unauthorized.
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, 'name email', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user);
  });
};


/**
 * @api {post} /sendmail     send sample mail
 * @apiName sampleMail
 * @apiGroup user
 * @apiSuccess {String}  success  
 * @apiError 500- error occured when sending mail".
 */
exports.sampleMail=function(req,res,next){
  config.email
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 25, // use SSL
    auth: {
      user: config.email,
      pass: config.password
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  var HelperOptions = {
    from: '"Backend" ' + config.email,
    to: req.body.email,
    subject: "Heartly Greetings",

  };
  HelperOptions.html ='<div>Hi,'+req.body.email+'</div>'+
                       '<div> Hope You Doing Good </div>'   // Email template 

   transporter.sendMail(HelperOptions, function (err, info) {
    if (err) { 
      res.status(500).send('error occured when sending mail"');
    } else { 
      res.status(200).send('success')
  }
 });
}
/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
