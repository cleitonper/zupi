if (process.env.NODE_ENV !== 'ci') require('dotenv-safe').config();

const app =        require('express')();
const boom =       require('express-boom');
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(boom());
app.use('/', require('./routes'));

module.exports = app;
