const mongoose = require('mongoose');
//const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

const busSchema = new mongoose.Schema(
  {
   // slug: String,
    name: {
      type: String,
      required: [true, 'A bus must have a name']
    },
    photo: String,
    type: {
      type: String,
      enum: ['AC','Non AC'],
      default: 'Non AC',
      required: [true,'A bus must have a type']
    },
    no_of_seats: {
      type: Number,
      default: 30
    },
    available_seats: {
      type: Number,
      default: 30
    },
    amenity: [{
       name: String
    }],
    price: {
      type: Number,
      required: [true,'A bus must have a booking price']
    },
    departureTime: {
      type: Date,
      required: [true,'A bus must have a departure time']
    },
    from:{
        type: String,
        required: [true,"A bus must have a depature city"]
    },
    to:{
      type: String,
      required: [true,"A bus must have a destination city"]
  }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

busSchema.pre('save', function(next) {
  switch (this.type) {
    case "AC":
      this.amenity = [{name: 'AC'},{name: 'WIFI'}]
      break;
  
    default:
      this.amenity = []
      break;
  }
  next();
});






const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus;
