const index = (request, response) => {
  response.sendFile('home.html', { root: __dirname + '/../public/views/' });
};

module.exports = {
  index: index
};