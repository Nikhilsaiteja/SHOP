const jwt = require('jsonwebtoken');``

const dbgr = require('debug')('app:isLoggedIn');

const cache = require('../../utils/redisCache');
const userModel = require('../../models/user-model');

const isLoggedIn = async (req,res,next)=>{
    try{
        dbgr('Checking if user is logged in');
        let token = req.headers.authorization;
        dbgr('Authorization header: ', token);
        if(!token){
            dbgr('No token found, user is not logged in');
            return next(new Error('User not logged in'));
        }

        token = token.split(' ')[1];
        dbgr('Extracted token: ', token);

        const data = jwt.verify(token, process.env.JWT_SECRET);
        if(!data || !data.id){
            dbgr('Invalid token data: ', data);
            return next(new Error('User not logged in'));
        }

        const cacheKey = `user:${data.id}`;
        dbgr('user id from token: ', data.id, ' cacheKey: ', cacheKey);
        cachedUser = await cache.get(cacheKey);

        if(cachedUser){
            dbgr('User found in cache: ', cachedUser);
            req.user = JSON.parse(cachedUser);
            return next();
        }else{
            dbgr('User not found in cache, fetching from DB');
            const user = await userModel.findById(data.id);
            if(!user){
                dbgr('User not found in DB with id: ', data.id);
                return next(new Error('User not logged in'));
            }
            await cache.set(cacheKey, JSON.stringify(user));
            req.user = user;
            dbgr('User fetched from DB and set in req.user: ', req.user);
            return next();
        }
    }catch(err){
        dbgr('isLoggedIn middleware error: ', err);
        next(err);
    }
}

module.exports = isLoggedIn;