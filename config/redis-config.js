const redis = require('redis');

const dbgr = require('debug')('app:redis-config');

const client = redis.createClient({
    socket:{
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    },
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD
});

client.on('error', (err)=>{
    dbgr('Redis Client Error', err);
});

const connectRedis = async()=>{
    try{
        await client.connect();
        dbgr('Connected to Redis successfully');
    }catch(err){
        dbgr('Error connecting to Redis: ', err);
    }
};

connectRedis();

module.exports = client;