const index = (request, response) => {
  return response.json({ name: 'Zupi', version: '1.0.0' });
};

module.exports = {
  index: index
};
