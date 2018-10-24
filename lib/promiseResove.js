/**
  * Used for dont repeat promises
  * resolution inside controllers methods.
  * The response for the current request
  * will be resoved inside the resolver callback
  * as well as error handler.
  * ----------------------------------------------------------------
  *                     Usage Example
  * ----------------------------------------------------------------
 * const controllerMethod = async (request, response) => {
 *  return await promiseResove(somePromise(), resove(response));
 * };
  * ----------------------------------------------------------------
  *                         Created By
  *                   https://bit.ly/2zD9wCi
  * ----------------------------------------------------------------
**/
const isEmpty = require('./isEmpty');

const sendJSON = (response) => (status, result) => response.status(status).json(result);
const sendError = (response) => (status, error) => response.status(status).json(error);

const resove = (response) => ({
  success: sendJSON(response),
  error: sendError(response)
});

const promiseResove = async (promise, resove, status = 200) => {
  try {
    const data = await promise;
    if (isEmpty(data)) resove.error(404, { message: 'resource not found.' });
    else resove.success(status, data);
  } catch(error) {
    resove.error(500, { message: error.message });
  }
};

module.exports = {
  promiseResove,
  resove,
};
