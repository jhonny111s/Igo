/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var validator = require('validator');
var Passwords = require('machinepack-passwords');

//EV: error validatation
function validateRequest(req, res) {
  console.log(req.allParams());
  mesagge = {};

  if (_.isUndefined(req.param('username'))) {
    mesagge.EV04 = 'A username is required!';
  } else {
    //otra validación
  }

  if (_.isUndefined(req.param('email'))) {
    mesagge.EV01 = 'An email is required!';
  } else {
    if (!validator.isEmail(req.param('email'))) {
      mesagge.EV04 = 'Invalid email!';
    }
  }

  if (_.isUndefined(req.param('password'))) {
    mesagge.EV02 = 'A password is required!';
  } else {
    if (req.param('password').length < 6) {
      mesagge.EV03 = 'Password must be at least 6 characters!';
    }
  }

  return mesagge;
}

module.exports = {

  //registro
  signup: function(req, res) {
    msg = validateRequest(req, res);

    if (!_.isEmpty(msg)) {
      return res.badRequest(msg);
    }

    var splitUsername = req.param('username').split(' ').join('-');

    User.findOne({
        or: [{
          username: splitUsername
        }, {
          email: req.param('email')
        }]
      })
      .then(function(user) {
        if (_.isEmpty(user)) {
          Passwords.encryptPassword({
              password: req.param('password'),
            })
            .exec({
              error: function(err) {
                return res.serverError(err);
              },
              success: function(pwd) {
                var options = {};
                options.email = req.param('email');
                options.username = splitUsername;
                options.encryptedPassword = pwd;
                options.deleted = false;
                options.admin = false;
                options.banned = false;

                User.create(options)
                  .then(function(createdUser) {
                    return res.json(createdUser);
                  })
                  .catch(function(err) {
                    console.log('create error');
                    return res.badRequest(err);
                  });
              },
            });
        } else {
          console.log('Correo o usuario existente');
          return res.badRequest('email or username exist');
        }
      })
      .catch(function(err) {
        console.log('find error');
        return res.badRequest(err);
      });
  },

  login: function(req, res) {
    User.findOne({
        or: [{
          username: req.param('username')
        }, {
          email: req.param('email')
        }]
      })
      .then(function(user) {
        if (!_.isEmpty(user)) {
          Passwords.checkPassword({
            passwordAttempt: req.param('password'),
            encryptedPassword: user.encryptedPassword,
          }).exec({
            error: function(err) {
              return res.negotiate(err);
            },
            incorrect: function() {
              return res.badRequest('password or user incorrect');
            },
            success: function() {
              return res.ok();
            },

          });
        } else {
          return res.badRequest('password or user incorrect');
        }
      })
      .catch(function(err) {
        console.log('find error');
        return res.badRequest(err);
      });
  },

};
