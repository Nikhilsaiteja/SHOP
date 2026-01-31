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

const helmet = require('helmet');
// app.use(helmet());

const rateLimit = require('express-rate-limit');

const registerLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMITER_WINDOW_MS_MIN), // 15 minutes
    max: parseInt(process.env.RATE_LIMITER_MIN_REQUESTS),
    message: 'Too many accounts created, please try again after 15 minutes'
});

const loginLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMITER_WINDOW_MS_MIN), // 15 minutes
    max: parseInt(process.env.RATE_LIMITER_MIN_REQUESTS),
    message: 'Too many login attempts, please try again after 15 minutes',
    skipSuccessfulRequests: true
});

const appLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMITER_WINDOW_MS_MAX), // 1 hour
    max: parseInt(process.env.RATE_LIMITER_MAX_REQUESTS),
    message: 'Too many requests from this IP, please try again after a minute'
});

app.use('/user/registration', registerLimiter);
app.use('/user/login', loginLimiter);
app.use(appLimiter);

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
    secret: process.env.SESSION_SECRET || 'defaultsecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: parseInt(process.env.SESSION_COOKIE_MAX_AGE)
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