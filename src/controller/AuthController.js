const jwt = require('jsonwebtoken');
const blacklist = require('express-jwt-blacklist');

const Mailer = require('../mailer');
const User = require('../model/User');

const { debugLogger } = require('../logger');

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
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: process.env.JWT_TTL };
    const token = jwt.sign(payload, secret, options);

    return response.json({token: token});
  } catch (error) {
    return response.boom.badImplementation();
  }
};

const signout = (request, response) => {
  blacklist.revoke(request.user);
  return response.json({ token: null });
};

const forgotPassword = async (request, response) => {
  const { email } = request.body;

  if (!email) {
    return response.boom.forbidden('You need to specify an email to reset your password');
  }

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return response.boom.forbidden('Invalid email');
    }

    const { name, id, updatedAt } = user;
    const { protocol, hostname } = request;
    const port = process.env.PORT;
    const resetPassTTL = '1h';

    const payload = { id };
    const secret  = `${id}-${updatedAt}`;
    const options = { expiresIn: resetPassTTL };
    const token   = jwt.sign(payload, secret, options);

    const resetPassLink = `${protocol}://${hostname}:${port}/reset-password?token=${token}`;

    const mailer = Mailer.create();

    mailer.send({
      template: 'password/forgot',
      message: {
        to: `${name} <${email}>`,
      },
      locals: { name, resetPassLink, resetPassTTL },
    });

    response.json({ message: 'Check your email to continue.' });
  } catch(error) {
    return response.boom.badImplementation();
  }
};

const resetPassword = async (request, response) => {
  const view = 'emails/password/reset/html';
  const layout = 'emails/layout/default';
  const { token } = request.query;
  const { userName, passwordResetError }  = request.session;
  request.session.destroy();

  if (passwordResetError || (!userName && !token) ) {
    response.render(view, { layout, error: 'This link is invalid. If you need, request a new one to reset your password.' });
  }

  if (userName) {
    response.render(view, { layout,  userName });
  }

  if (token) {
    const { id } = jwt.decode(token);

    const filters = { _id: id };
    const fields = { _id: 0, updatedAt: 1 };
    const options = { lean: true };

    const { updatedAt } = await User.findOne(filters, fields, options);

    const secret  = `${id}-${updatedAt}`;

    jwt.verify(token, secret, (tokenValidationError) => {
      if (!tokenValidationError) {
        const { protocol, hostname } = request;
        const port = process.env.PORT;
        const resetPassLink = `${protocol}://${hostname}:${port}/reset-password`;

        response.render(view, { layout, token, resetPassLink });
      }
      response.render(view, { layout, error: 'This link is invalid. If you need, request a new one to reset your password.' });
    });
  }
};

const changePassword = async (request, response) => {
  const { token } = request.body;
  const { id } = jwt.decode(token);

  try {
    let filters = { _id: id };
    let fields = { _id: 0, updatedAt: 1 };
    let options = { lean: true };

    const { updatedAt } = await User.findOne(filters, fields, options);

    const secret  = `${id}-${updatedAt}`;

    jwt.verify(token, secret, async (tokenValidationError) => {
      if(tokenValidationError) {
        request.session.passwordResetError = true;
      }
      options = { ...options, new: true };
      const update = { $set: { password: request.body.password } };

      const { name } = await User.findOneAndUpdate(filters, update, options);
      request.session.userName = name;
      response.redirect('/reset-password');
    });
  } catch(error) {
    debugLogger.error('Error: ' + error);
  }
};

module.exports = {
  signin: signin,
  signout: signout,
  forgotPassword: forgotPassword,
  resetPassword: resetPassword,
  changePassword: changePassword,
};
