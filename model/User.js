const mongoose = require('mongoose');

const options = {
  collection: 'users',
  versionKey: false,
  timestamps: true,
};

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The {PATH} field is required.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'The {PATH} field is required.'],
    lowercase: true,
    trim: true,
    index: true,
    unique: 'The email {VALUE} is already in use.',
    match: [/^[a-z0-9]+[\.\w]*@{1}[a-z0-9]+(\.[a-z]{2,4})+/i, 'Invalid email address.'],
  },
  password: {
    type: String,
    required: [true, 'The {PATH} field is required.'],
    bcrypt: true,
  },
}, options);

schema.plugin(require('mongoose-bcrypt'));
schema.plugin(require('mongoose-beautiful-unique-validation'));

module.exports = mongoose.model('User', schema);