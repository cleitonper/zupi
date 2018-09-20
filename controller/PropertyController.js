const Property = require('../model/Property');

const handleModel = (response) => {
  return function(error, data) {
    if (error) response.status(500).json({ message: `Error: ${error.message}` });
    if (!data) response.status(404).json({ message: 'Could not retrive user.' });
    else response.json(data);
  };
};

const index = (request, response) => {
  let { skip, items, fields, filters, sort } = request.query;
  Property.find(
    filters,
    fields,
    { skip: skip, limit: items, sort: sort },
    handleModel(response)
  );
};

const store = (request, response) => {
  Property.create(
    request.body,
    handleModel(response)
  );
};

const show = (request, response) => {
  Property.findById(
    request.params.id,
    request.query.fields,
    handleModel(response)
  );
};

const update = (request, response) => {
  Property.findOneAndUpdate(
    { _id: request.params.id },
    { $set: request.body },
    { new: true },
    handleModel(response)
  );
};

const destroy = (request, response) => {
  Property.findOneAndDelete(
    { _id: request.params.id },
    handleModel(response)
  );
};


module.exports = {
  index: index,
  store: store,
  show: show,
  update: update,
  destroy: destroy,
};