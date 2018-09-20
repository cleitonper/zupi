const mongoose = require('mongoose');

const options = {
  collection: 'properties',
  versionKey: false,
  timestamps: true
}

const schema = new mongoose.Schema({
  type: String,
  title: String,
  description: String,
  address: {
    location: String,
    name: String,
    number: String,
    complement: String,
    state: String,
    city: String,
    neighborhood: String
  },
  condominium: Number,
  iptu: Number,
  price: Number,
}, options);

module.exports = mongoose.model('Property', schema);