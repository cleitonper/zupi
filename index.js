require('dotenv-safe').config();

const express =    require('express');
const boom =       require('express-boom');
const bodyParser = require('body-parser');
const mongoose =   require('mongoose');

const { PORT, HOSTNAME, DB_CONN } = process.env;
const db =  mongoose.connection;
const app = express();

mongoose.connect(DB_CONN, { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
db.on('error', function(error) {
  console.log('👿 There is a error with MongoDB');
  console.log(error);
});
db.once('open', function() {
  console.log('🚀 MongoDB is running');
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(boom());
app.use('/', require('./routes'));
app.listen(PORT, () => {
  console.log(`🚀 Server is running at port ${PORT}`);
});