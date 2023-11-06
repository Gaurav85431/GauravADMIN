const mongoose = require('mongoose');
//  schema creation :::

const LoginSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  type: {
    type: Number,
    required: true
  }

});



module.exports = mongoose.model('Login', LoginSchema);