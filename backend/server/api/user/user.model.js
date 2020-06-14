'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var authTypes = ['github', 'twitter', 'facebook', 'google'];
var config = require('../../config/environment');
var socketio = require('socket.io-client')(config.backendurl)

var UserSchema = new Schema({
  name: { type: String, maxlength: [40, 'name must be less than or equals to 40 characters'] },
  email: { type: String, lowercase: true, index: true, required: true },
  role: {
    type: String,
    default: 'user'
  },
  hashedPassword: String,
  provider: String,
  salt: String,
  facebook: {},
  twitter: {},
  google: {},
  github: {},
  linkedin: {},
  active: { type: Boolean, required: true, default: true },
}, { timestamps: true });

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function () {
    return {
      'name': this.name,
      'role': this.role
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function () {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function (email) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function (hashedPassword) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashedPassword.length;
  }, 'Password cannot be blank');

//Validate email is not taken
UserSchema
  .path('email')
  .validate(function (value) {
    var self = this;
    return new Promise(function (resolve, reject) {
      self.constructor.findOne({ email: value }, function (err, user) {
        if (err) throw err;
        if (user) {
          if (self.id === user.id) {
            resolve(true)
          } else {
            resolve(false)
          }
        }
        resolve(true)
      });
    })
  }, 'The specified email address is already in use.');

var validatePresenceOf = function (value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function (next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
      next(new Error('Invalid password'));
    else
      next();
  });
// Validate invalid  password
UserSchema
  .path('hashedPassword')
  .validate(function () {
    if (this._password) {
      if (/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ !"#$%&()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d !"#$%&()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,14}/.test(this._password)) {
        return true
      } else {
        return false
      }
    }
  }, ' Password Must be combination of atleast one uppercase,one lowercase,one digit and one special character with 8 to 14 characters Range');


UserSchema.post('save', function (doc) {
  var user={
    name:doc.name
  }
  socketio.emit('user:save', user); // socket emiting when user create
});
/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function () {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function (password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');

  }
};

module.exports = mongoose.model('User', UserSchema);
