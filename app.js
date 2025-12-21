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

require('./config/mongoose-config')();
const redisClient = require('./config/redis-config');

app.set('view engine', 'ejs');
const path = require('path');

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}));

app.use(express.static(path.join(__dirname, 'public')));

const session = require('express-session');
const flash = require('connect-flash');
app.use(session({
    secret: process.env.SESSSION_SECRET || 'defaultsecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: process.env.SESSION_COOKIE_MAX_AGE
    }
}));
app.use(flash());

// for web routes
app.use('/', require('./routes/index'));

// for api routes
app.use('/api', require('./routes/api/index'));

app.use(errorHandler);

app.listen(config.port, ()=>{
    dbgr(`
Environment: ${config.env},
App URL: ${config.appUrl},
MongoDB URI: ${config.database.uri}  
        `);
    dbgr(`Server is running on port ${config.port}`);
});