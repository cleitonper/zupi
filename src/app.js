if (process.env.NODE_ENV !== 'ci') require('dotenv-safe').config();

const rootPath =   require('app-root-path');
const express =    require('express');
const boom =       require('express-boom');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'hbs');
app.set('views', `${rootPath}/src/public/views/`);
app.engine('hbs', require('express-handlebars')( {
  extname: 'hbs',
  defaultView: 'index',
  layoutsDir: `${rootPath}/src/public/views`,
  partialsDir: `${rootPath}/src/public/views/partials`
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(boom());
app.use('/', express.static(`${rootPath}/src/public/static`));
app.use('/', require('./routes'));

module.exports = app;
