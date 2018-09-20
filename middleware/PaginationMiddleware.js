const sanitize = (request, response, next) => {
  const { page, items, orderby, order, filters, fields } = request.query;
  const orders = { asc: '', desc: '-' };
  const firstPage = 1;
  const defaultItemsLen = 15;
  const maxItemsLen = 100;
  const defaultOrderby = '_id';
  const defaultOrdernation = 'asc';

  if (!page) request.query.page = firstPage;
  if (!items) request.query.items = defaultItemsLen;
  if (!fields) request.query.fields = {};
  if (!filters) request.query.filters = {};
  if (!orderby) request.query.orderby = defaultOrderby;
  if (!order || !Object.keys(orders).includes(order)) request.query.order = defaultOrdernation;
  else if (request.query.items.length > 100) request.query.items = maxItemsLen;

  request.query.page = parseInt(request.query.page);
  request.query.items = parseInt(request.query.items);
  request.query.sort = `${orders[request.query.order]}${request.query.orderby}`;
  request.query.skip = ((request.query.page - 1) * request.query.items);

  next();
};

module.exports = {
  sanitize: sanitize,
};