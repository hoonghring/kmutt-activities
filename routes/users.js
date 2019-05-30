const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let User = require('../models/user');

// Register Form
router.get('/register', function(req, res){
  res.render('signup');
});

// Register Proccess
router.post('/register', function(req, res){
  const name = req.body.name;
  const gender = req.body.gender
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;
  const status = 'user';

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('gender', 'Gender is required').notEmpty();
  req.checkBody('username', 'StudentID is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    res.render('signup', {
      errors:errors
    });
  } else {
    let newUser = new User({
      name:name,
      username:username,
      password:password,
      gender:gender,
      status:status
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if(err){
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          } else {
            req.flash('success','You are now registered and can log in');
            res.redirect('/users/login');
          }
        });
      });
    });
  }
});

// Login Form
router.get('/login', function(req, res){
  res.render('signin');
});

// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});

// logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
