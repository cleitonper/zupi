const User = require('../model/User');

const index = (request, response) => {
  const { skip, items, sort, filters, fields } = request.query;
  User.find(
    filters,
    fields,
    { skip: skip, limit: items, sort: sort },
    function(error, users) {
      if (error || !users.length) {
        return response.boom.notFound('No user could be found.');
      }
      return response.json(users);
    }
  );
};

const store = (request, response) => {
  User.create(
    request.body,
    function(error, user) {
      if (error) {
        return response.boom.badData(error._message, { detail: error.errors });
      }
      return response.json(user);
    }
  );
};

const show = (request, response) => {
  User.findById(
    request.params.id,
    request.query.filters,
    function(error, user) {
      if (error) {
        return response.boom.badImplementation('Could not retrive user data.');
      }
      if (!user) {
        return response.boom.notFound('User not found.');
      }
      return response.json(user);
    }
  );
};

const update = (request, response) => {
  User.findOneAndUpdate(
    { _id: request.params.id },
    { $set: request.body },
    { new: true, runValidators: true },
    function(error, user) {
      if (error) {
        if (error.errors.kind === 'unique') {
          return response.boom.conflict(error.errors.email.message, { detail: error.errors });
        } else {
          return response.boom.badData(error.errors._message, { detail: error.errors });
        }
      }
      if (!user) {
        return response.boom.notFound('User not found.');
      }
      return response.json(user);
    }
  );
};

const destroy = (request, response) => {
  User.findOneAndDelete(
    { _id: request.params.id },
    function(error, user) {
      if (error) {
        return response.boom.badImplementation('Could not delete the user.');
      }
      if (!user) {
        return response.boom.notFound('User not found.');
      }
      return response.json(user);
    }
  );
};


module.exports = {
  index: index,
  store: store,
  show: show,
  update: update,
  destroy: destroy,
};