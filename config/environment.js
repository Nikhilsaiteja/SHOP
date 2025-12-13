const path = require('path');

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
require('dotenv').config({path: path.resolve(process.cwd(), envFile)});

require('dotenv').config();

const config={

    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
    appUrl: process.env.APP_URL || 'http://localhost:3000',

    database: {
        uri: process.env.MONGO_URI
    },

    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    },

    logging: {
        level: process.env.LOG_LEVEL,
        debug: process.env.DEBUG
    },

    isDevelopment: process.env.NODE_ENV === 'development',
    isQA: process.env.NODE_ENV === 'qa',
    isUAT: process.env.NODE_ENV === 'uat',
    isProduction: process.env.NODE_ENV === 'production',

    security: {
        cors: {
            development: ['http://localhost:3000'],
            qa: ['http://shop_qa.com'],
            uat: ['http://shop_uat.com'],
            production: ['http://shop_prod.com']
        }
    }

};

module.exports = config;