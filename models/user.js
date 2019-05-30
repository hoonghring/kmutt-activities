let mongoose = require("mongoose");

let UserSchema = new mongoose.Schema({
    username: {
    type: String,
    required: true
  },
    password: {
    type: String,
    required: true
  },
    name: {
    type: String,
    required: true
  },
  //   Lname: {
  //   type: String,
  //   required: true
  // },
    gender: {
    type: String,
    required: true
  },
    status: {
      type:String
    }
});

module.exports = mongoose.model("User", UserSchema);
