let mongoose = require('mongoose');

// Article Schema
let articleSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  type:{
    type: String,
    required: true
  },
  by:{
    type: String,
    required: true
  },
  hours:{
    type: Number,
    required: true
  },
  numofstd:{
    type: Number,
    required: true
  },
  image:{
    filename:{
      type: String
    },
    data: Buffer,
    contentType: String
  },
  body:{
    type: String,
    required: true
  },
  status:{
    type: String
  }
});

let Article = module.exports = mongoose.model('Article', articleSchema);
