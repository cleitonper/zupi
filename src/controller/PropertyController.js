const Property = require('../model/Property');
const { promiseResove, resove } = require('../../lib/promiseResove');

const index = async (request, response) => {
  const { skip, items, fields, filters, sort } = request.query;
  const options = { skip: skip, limit: items, sort: sort, lean: true };
  return await promiseResove(Property.find(filters, fields, options), resove(response));
};

const store = async (request, response) => {
  const property = request.body;
  return promiseResove(Property.create(property), resove(response), 201);
};

const show = async (request, response) => {
  const { id } = request.params;
  const { fields } = request.query;
  const options = { lean: true };
  return await promiseResove(Property.findById(id, fields, options), resove(response));
};

const update = async (request, response) => {
  const conditions = { _id: request.params.id };
  const update = { $set: request.body };
  const options = { new: true, lean: true };
  return await promiseResove(Property.findOneAndUpdate(conditions, update, options), resove(response));
};

const destroy = async (request, response) => {
  const conditions = { _id: request.params.id };
  const options = { lean: true };
  promiseResove(Property.findOneAndDelete(conditions, options), resove(response));
};


module.exports = {
  index: index,
  store: store,
  show: show,
  update: update,
  destroy: destroy,
};
