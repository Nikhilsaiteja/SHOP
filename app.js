const config = require('./config/environment');

const express = require('express');
const app = express();

const dbgr = require('debug')('app:js');

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const errorHandler = require('./utils/errorHandler');

const cors = require('cors');

app.use(cors({
    origin: config.security.cors[config.env],
    credentials: true
}))

require('dotenv').config();
require('./config/mongoose-config')();
const redisClient = require('./config/redis-config');

app.use(express.json({limit: '50kb'}));
app.use(express.urlencoded({extended: true, limit: '50kb'}));

// for web routes
app.use('/', require('./routes/index'));

// for api routes
app.use('/api', require('./routes/api/index'));

app.use(errorHandler);

app.listen(config.port, ()=>{
    dbgr(`
Environment: ${config.env},
App URL: ${config.appUrl}  
        `);
    dbgr(`Server is running on port ${config.port}`);
});