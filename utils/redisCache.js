const client = require('../config/redis-config');

const dbgr = require('debug')('app:redis-cache');

const DEFAULT_EXPIRY = process.env.REDIS_TTL || 3600; // in seconds
const Redis = process.env.REDIS_ENABLED;

class RedisCache{

    async get(key){
        try{
            dbgr('Redis ENABLED value in get:', Redis);
            if(Redis!=='true') return null;
            const value = await client.get(key);
            if(value){
                dbgr('Cache hit for key:', key);
                return JSON.parse(value);
            }
            dbgr('Cache miss for key:', key);
            return null;
        }catch(err){
            dbgr('Error getting cache for key:', key, err);
            return null;
        }
    }

    async set(key,value,ttl=DEFAULT_EXPIRY){
        try{
            dbgr('Redis ENABLED value in set:', Redis);
            if(Redis!=='true') return false;
            await client.set(key, JSON.stringify(value), ttl);
            dbgr('Cache set for key:', key, 'with TTL:', ttl);
            return true;
        }catch(err){
            dbgr('Error setting cache for key:', key, err);
        }
    }

    async del(key){
        try{
            dbgr('Redis ENABLED value in del:', Redis);
            if(Redis!=='true') return null;
            await client.del(key);
            dbgr('Cache deleted for key:', key);
        }catch(err){
            dbgr('Error deleting cache for key:', key, err);
        }
    }

    async delPattern(pattern){
        try{
            dbgr('Redis ENABLED value in delPattern:', Redis);
            if(Redis!=='true') return null;
            const keys = await client.keys(pattern);
            if(keys.length == 0){
                dbgr('No cache keys found for pattern:', pattern);
                return;
            }
            dbgr('Cache keys found for pattern:', pattern, 'Keys:', keys);
            await client.del(keys);
            dbgr('Cache deleted for pattern:', pattern, 'Keys:', keys);
        }catch(err){
            dbgr('Error deleting cache for pattern:', pattern, err);
        }
    }

    async flushAll(){
        try{
            dbgr('Redis ENABLED value in flushAll:', Redis);
            if(Redis!=='true') return null;
            await client.flushAll();
            dbgr('All cache flushed');
        }catch(err){
            dbgr('Error flushing all cache', err);
        }
    }

}

module.exports = new RedisCache();

