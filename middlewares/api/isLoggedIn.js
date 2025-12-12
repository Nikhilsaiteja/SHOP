const jwt = require('jsonwebtoken');``

const dbgr = require('debug')('app:isLoggedIn');

const isLoggedIn = (req,res,next)=>{
    try{
        dbgr('Checking if user is logged in');
        let token = req.headers.authorization;
        dbgr('Authorization header: ', token);
        if(!token){
            dbgr('No token found, user is not logged in');
            return next(error('User not logged in'));
        }

        token = token.split(' ')[1];
        dbgr('Extracted token: ', token);

        jwt.verify(token, process.env.JWT_SECRET, (err, data)=>{
            if(err){
                dbgr('Token verification failed: ', err);
                return next(err('User not logged in'));
            }

            req.user = data;
            dbgr('User is logged in: ', req.user);
            next();
        });
    }catch(err){
        dbgr('isLoggedIn middleware error: ', err);
        next(err);
    }
}

module.exports = isLoggedIn;