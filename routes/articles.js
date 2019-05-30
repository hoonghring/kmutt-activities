const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs-extra');

// Article Model
let Article = require('../models/article');
// User Model
let User = require('../models/user');
// Img Model 
let Img = require('../models/imgs');

// Add Route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('create');
});

// Add Submit POST Route
router.post('/add', Img.upload.single('image'),function(req, res){
  req.checkBody('title','Title is required').notEmpty();
  //req.checkBody('author','Author is required').notEmpty();
  req.checkBody('by','By is required').notEmpty();
  req.checkBody('hours','hours is required').notEmpty();
  req.checkBody('numofstd','numofstd is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();

  // Get Errors
  let errors = req.validationErrors();
  var imgfile = Img.upIMG(req, res);

  if(errors){
    res.render('create', {
      title:'Add Article',
      errors:errors
    });
  } else {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.user._id;
    article.by = req.body.by;
    article.hours = req.body.hours;
    article.numofstd = req.body.numofstd;
    article.body = req.body.body;
    article.type = req.body.type;
    article.status = 'offline';
    article.image = imgfile;

    article.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        // req.flash('success','Article Added');
        res.redirect('/');
      }
    });
  }
});

// Comfirm Articles
router.get('/confirm', ensureAuthenticated, function(req, res){
  Article.find({status:'offline'}, function(err, articles){
    if (err){
      console.log(err);
    } else {
      res.render('confirm',{
        articles:articles
      });
    }
  });
});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Article.findById(req.params.id, function(err, article){
    if(req.user.status != 'admin'){
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    res.render('edit_article', {
      title:'Edit Article',
      article:article
    });
  });
});

// Update Submit POST Route
router.post('/edit/:id', Img.upload.single('image'),function(req, res){
  var editfile = Img.upIMG(req, res);
  let article = {};
  article.title = req.body.title;
  // article.author = req.user._id;
  article.by = req.body.by;
  article.hours = req.body.hours;
  article.numofstd = req.body.numofstd;
  article.body = req.body.body;
  article.type = req.body.type;
  if(editfile != false){
    article.image = editfile;
  }

  let query = {_id:req.params.id}

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Article Updated');
      res.redirect('/articles/confirm');
    }
  });
});

// Update Confirm Article
router.post('/upstatus/:id', function(req, res){
  let article = {};
  article.status = req.body.status;

  let query = {_id:req.params.id}

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      // req.flash('success', 'Article Updated');
      res.redirect('/');
    }
  });
});

// Delete Article
router.post('/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Article.findById(req.params.id, function(err, article){
    if(req.user.status != 'admin'){
      res.status(500).send();
    } else {
      Article.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.redirect('/articles/confirm');
        // res.send('Success');
      });
    }
  });
});

// Get Single Article
router.get('/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    User.findById(article.author, function(err, user){
      res.render('detail', {
        article:article,
        author: user
      });
    });
  });
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
