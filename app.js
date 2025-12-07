const express = require('express');
const app = express();

const dbgr = require('debug')('app:js');

require('dotenv').config();
require('./config/mongoose-config')();

// for web routes
app.use('/', require('./routes/index'));

// for api routes
app.use('/api', require('./routes/api/index'));

app.listen(3000, ()=>{
    dbgr('Server is running on port 3000');
});