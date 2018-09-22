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
  permissions: {
    type: Object,
    default: { properties: ["read"] },
    validate: {
      validator: permissionValidator,
      message: (prop) => prop.reason.message
    }
  }
}, options);

schema.plugin(require('mongoose-bcrypt'));
schema.plugin(require('mongoose-beautiful-unique-validation'));

function permissionValidator(permissions) {
  if ((typeof permissions) !=='object' || Array.isArray(permissions)) {
    type = Array.isArray(permissions) ? 'array' : 'object';
    throw new Error(`permissions must be an object, but an ${type} was given.`);
  } else if (!Object.keys(permissions).length) {
    throw new Error('permissions not be empty');
  }

  const validPermissions = ["read", "write", "delete"];

  for (key in permissions) {
    if (!Array.isArray(permissions[key])) {
      throw new Error(`${key} permissions must be an array.`);
    }
    if (!permissions[key].length) {
      throw new Error(`${key} permissions not be empty.`);
    }
    for (permission of permissions[key]) {
      if (!validPermissions.includes(permission)) {
        throw new Error(`${permission} is not a valid permission.`);
      };
    }
  }

  return true;
}

module.exports = mongoose.model('User', schema);