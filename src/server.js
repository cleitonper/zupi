const app = require('./app');
const db = require('./database');

const { PORT, DB_CONN } = process.env;

app.listen(PORT);
db.connect(DB_CONN);
