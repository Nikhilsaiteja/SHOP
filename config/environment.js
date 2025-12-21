const path = require('path');

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
require('dotenv').config({path: path.resolve(process.cwd(), envFile)});

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

    isLocal: process.env.NODE_ENV === 'local',
    isDevelopment: process.env.NODE_ENV === 'development',
    isQA: process.env.NODE_ENV === 'qa',
    isUAT: process.env.NODE_ENV === 'uat',
    isProduction: process.env.NODE_ENV === 'production',

    security: {
        cors: {
            local: ['http://localhost:3000'],
            development: ['http://localhost:3000'],
            qa: ['http://shop_qa.com'],
            uat: ['http://shop_uat.com'],
            production: ['http://shop_prod.com']
        }
    }

};

module.exports = config;