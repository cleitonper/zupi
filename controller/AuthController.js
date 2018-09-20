var jwt = require('jsonwebtoken');

const User = require('../model/User');

const signin = (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.boom.unauthorized('Invalid email or password.');
  }

  User.findOne(
    { email: email },
    function(error, user) {
      if (error) {
        return response.boom.badImplementation();
      }

      if (!user) {
        return response.boom.unauthorized('Invalid email or password.');
      }

      user.verifyPassword(
        password,
        function(passwordError, valid) {
          if (passwordError) {
            return response.boom.unauthorized('Invalid email or password.');
          } else if (valid) {
            const token = jwt.sign(
              { id: user.id },
              process.env.JWT_SECRET,
              { expiresIn: process.env.JWT_TTL }
            );
            return response.json({ token: token });
          } else {
            return response.boom.unauthorized('Invalid email or password.');
          }
        }
      );
    }
  );
};

// TODO: blacklist tokens when logout
const signout = (request, response) => {
  return response.json({ token: null });
};

module.exports = {
  signin: signin,
  signout: signout,
};