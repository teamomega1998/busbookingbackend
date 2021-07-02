const mongoose = require('mongoose');
const validator = require('validator');


const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
      },
      email: {
        type: String,
        required: [true, 'Please provide your email'],
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
      },
      message: {
          type: String,
          required: [true,'Contact must have message'],
          minlength: [100,'Minimum length 100 characters']
      }

});


const Contact = mongoose.model('Contact',contactSchema);

module.exports = Contact;