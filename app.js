const express = require('express');
const app = express();

const dbgr = require('debug')('app:js');

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const errorHandler = require('./utils/errorHandler');

require('dotenv').config();
require('./config/mongoose-config')();

app.use(express.json({limit: '50kb'}));
app.use(express.urlencoded({extended: true, limit: '50kb'}));

// for web routes
app.use('/', require('./routes/index'));

// for api routes
app.use('/api', require('./routes/api/index'));

app.use(errorHandler);

app.listen(3000, ()=>{
    dbgr('Server is running on port 3000');
});