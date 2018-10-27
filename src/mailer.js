const rootPath = require('app-root-path');
const Email =    require('email-templates');
const { createTransport } = require('nodemailer');

const { EMAIL_HOST, EMAIL_PORT, EMAIL_NAME, EMAIL_USER, EMAIL_PASS } = process.env;
const DEFAULT_SENDER = { name: EMAIL_NAME, email: EMAIL_USER };

const generateTranport = ({
  host = EMAIL_HOST,
  port = EMAIL_PORT,
  user = EMAIL_USER,
  pass = EMAIL_PASS
} = {}) => {
  return createTransport({ host, port, auth: { user, pass } });
};

const create = ({
  sender = DEFAULT_SENDER,
  transport = generateTranport()
} = {}) => {
  return new Email({
    send: true,
    preview: false,
    juice: true,
    juiceResources: {
      preserveImportant: true,
      webResources: {
        relativeTo: `${rootPath}/src/public/static`
      }
    },
    transport: transport,
    message: {
      from: `${sender.name} <${sender.email}>`,
    },
    views: {
      root: `${rootPath}/src/public/views/emails`,
      options: {
        extension: 'hbs'
      }
    },
  });
};

module.exports = {
  generateTranport,
  create
};
