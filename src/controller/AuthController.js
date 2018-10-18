var jwt = require('jsonwebtoken');

const User = require('../model/User');

const signin = async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.boom.unauthorized('Email and password must be fulfilled');
  }

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return response.boom.unauthorized('Invalid email or password');
    }

    const isValidPassword = await user.verifyPassword(password)
    .then((valid) => valid)
    .catch(() => response.boom.badImplementation());

    if (!isValidPassword) {
      return response.boom.unauthorized('Invalid email or password');
    }

    const payload = { id: user.id, permissions: user.permissions };
    const privateKey = process.env.JWT_SECRET;
    const options = { expiresIn: process.env.JWT_TTL };
    const token = jwt.sign(payload, privateKey, options);

    return response.json({token: token});
  } catch (error) {
    return response.boom.badImplementation();
  }
};

// TODO: blacklist tokens when logout
const signout = (request, response) => {
  return response.json({ token: null });
};

module.exports = {
  signin: signin,
  signout: signout,
};
