const sanitize = (request, response, next) => {
  const { page, items, orderby, order, filters, fields } = request.query;
  const ORDER = { asc: '', desc: '-' };
  const FIRST_PAGE = 1;
  const DEFAULT_ITEMS_LENGTH = 15;
  const MAX_ITEMS_LENGTH = 100;
  const DEFAULT_ORDERBY = '_id';
  const DEFAULT_ORDENATION = 'asc';
  const DEFAULT_FIELDS = {};
  const DEFAULT_FILTERS = {};

  if (!page) request.query.page = FIRST_PAGE;
  if (!items) request.query.items = DEFAULT_ITEMS_LENGTH;
  if (!fields) request.query.fields = DEFAULT_FIELDS;
  if (!filters) request.query.filters = DEFAULT_FILTERS;
  if (!orderby) request.query.orderby = DEFAULT_ORDERBY;
  if (!order || !Object.keys(ORDER).includes(order)) request.query.order = DEFAULT_ORDENATION;
  if (request.query.items > 100) request.query.items = MAX_ITEMS_LENGTH;

  request.query.page = parseInt(request.query.page);
  request.query.items = parseInt(request.query.items);
  request.query.sort = `${ORDER[request.query.order]}${request.query.orderby}`;
  request.query.skip = ((request.query.page - 1) * request.query.items);

  next();
};

module.exports = {
  sanitize: sanitize,
};
