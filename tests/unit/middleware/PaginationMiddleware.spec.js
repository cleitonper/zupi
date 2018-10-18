const PaginationMiddleWare = require('../../../src/middleware/PaginationMiddleware');

let request;
let response;
let next;

beforeEach(() => {
  request = { query: {} };
  response = {};
  next = jest.fn();
});

describe('Middleware: Pagination', () => {
  test('sanitize: should set default values when query is empty', () => {
    PaginationMiddleWare.sanitize(request, response, next);
    const { page, items, fields, filters, orderby, order, sort, skip } = request.query;
    expect(page).toBe(1);
    expect(items).toBe(15);
    expect(fields).toEqual({});
    expect(filters).toEqual({});
    expect(orderby).toBe('_id');
    expect(order).toBe('asc');
    expect(sort).toBe('_id');
    expect(skip).toBe(0);
    expect(next).toBeCalledTimes(1);
  });

  test('sanitize: should set items to 100, when this value is greeter than 100', () => {
    request.query.items = 150;
    PaginationMiddleWare.sanitize(request, response, next);
    expect(request.query.items).toBe(100);
    expect(next).toBeCalledTimes(1);
  });

  test('sanitize: set ordenation to asc, when a invalid value is sent', () => {
    request.query.order = 'ascendent';
    PaginationMiddleWare.sanitize(request, response, next);
    expect(request.query.order).toBe('asc');
    expect(next).toBeCalledTimes(1);
  });

  test('sanitize: skip should be 20', () => {
    request.query.page = 3;
    request.query.items = 10;
    PaginationMiddleWare.sanitize(request, response, next);
    expect(request.query.skip).toBe(20);
    expect(next).toBeCalledTimes(1);
  });
});
