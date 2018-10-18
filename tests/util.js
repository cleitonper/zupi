const orderBy = (field) => {
  return (a, b) => a[field].localeCompare(b[field]);
};

const generateUsers = ({ single = false,  fieldToSort = 'email'} = {}) => {
  const access = ['read', 'write', 'delete'];
  const permissions = { users: access, properties: access };
  const users = [
    { name: 'user1', password: 'secret', email: 'user1@email.com', permissions },
    { name: 'user2', password: 'secret', email: 'user2@email.com', permissions },
  ];

  if (single) return users[0];

  return users.sort(orderBy(fieldToSort));
};

const generateProperties = ({ single = false,  fieldToSort = 'title'} = {}) => {
  const properties = [
    { title: 'Casa' },
    { title: 'Apartamento' },
  ];

  if (single) return properties[0];

  return properties.sort(orderBy(fieldToSort));
};

module.exports = {
  generateUsers,
  generateProperties
};
