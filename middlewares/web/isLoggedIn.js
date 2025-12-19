const jwt = require('jsonwebtoken');``

const dbgr = require('debug')('app:isLoggedIn');

const cache = require('../../utils/redisCache');
const userModel = require('../../models/user-model');

const isLoggedIn = async (req,res,next)=>{
    try{
        dbgr('Checking if user is logged in');
        let token = req.cookies.token;
        dbgr('Token from cookies: ', token);
        if(!token){
            dbgr('No token found, user is not logged in');
            req.flash('error', 'You must be logged in to access this page');
            return res.redirect('/user/login');
        }

        const data = jwt.verify(token, process.env.JWT_SECRET);
        if(!data || !data.id){
            dbgr('Invalid token data: ', data);
            req.flash('error', 'You must be logged in to access this page');
            return res.redirect('/user/login');
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
                req.flash('error', 'User no longer exists, please log in again');
                return res.redirect('/user/login');
            }
            await cache.set(cacheKey, JSON.stringify(user));
            req.user = user;
            dbgr('User fetched from DB and set in req.user: ', req.user);
            return next();
        }
    }catch(err){
        dbgr('isLoggedIn middleware error: ', err);
        req.flash('error', 'An error occurred, please log in again');
        return res.redirect('/user/login');
    }
}

module.exports = isLoggedIn;