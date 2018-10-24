const User = require('../model/User');

const index = async (request, response) => {
  const { skip, items, sort, filters, fields } = request.query;
  const options = { skip: skip, limit: items, sort: sort, lean: true };
  try {
    const users = await User.find(filters, fields, options);
    if (!users.length) return response.boom.notFound('No user found.');
    return response.json(users);
  }
  catch(error) {
    return response.boom.badImplementation();
  }
};

const store = async (request, response) => {
  try {
    const user = await User.create(request.body);
    return response.status(201).json(user);
  } catch(error) {
    if (error.name && error.name === 'ValidationError') {
      return response.boom.badData(error._message, { detail: error.errors });
    }
    return response.boom.badImplementation();
  }
};

const show = async (request, response) => {
  const { id } = request.params;
  const { fields } = request.query;
  const options = { lean: true };
  try {
    const user = await User.findById(id, fields, options);
    if (!user) return response.boom.notFound('User not found');
    return response.json(user);
  } catch(error) {
    return response.boom.badImplementation();
  }
};

const update = async (request, response) => {
  const conditions = { _id: request.params.id };
  const update = { $set: request.body };
  const options = { new: true, runValidators: true, lean: true };
  try {
    const user = await User.findOneAndUpdate(conditions, update, options);
    if (!user) return response.boom.notFound('User not found.');
    return response.json(user);
  } catch (error) {
    if (error.name && error.name === 'ValidationError') {
      return response.boom.badData(error._message, { detail: error.errors });
    }
    return response.boom.badImplementation();
  }

};

const destroy = async (request, response) => {
  const conditions = { _id: request.params.id };
  const options = { lean: true };
  try {
    const user = await User.findOneAndDelete(conditions, options);
    if (!user) return response.boom.notFound('User not found');
    return response.status(204).send();
  } catch(error) {
    return response.boom.badImplementation();
  }
};


module.exports = {
  index: index,
  store: store,
  show: show,
  update: update,
  destroy: destroy,
};
