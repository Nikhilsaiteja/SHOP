const dbgr = require('debug')('app:errorHandler');

const errorHandler = (err,req,res,next)=>{

    dbgr('Error Handler Invoked');

    const error = {...err};
    error.message = err.message;

    //joi validation error
    if(err.details && Array.isArray(err.details)){
        const messages = err.details.map(detail => detail.message);
        dbgr('Joi Validation Error:', messages);
        return res.status(400).json({
            success: false,
            error: messages,
            timestamp: new Date().toISOString()
        });
    }

    //cast error
    if(err.name === 'CastError'){
        const message = `Resource not found. Invalid: ${err.path}`;
        dbgr('CastError:', message);
        return res.status(400).json({
            success: false,
            error: message,
            timestamp: new Date().toISOString()
        });
    }

    //duplicate key error
    if(err.code === 11000){
        const message = 'Duplicate field value entered';
        dbgr('Duplicate Key Error:', message);
        return res.status(400).json({
            success: false,
            error: message,
            timestamp: new Date().toISOString()
        });
    }

    //validation error
    if(err.name === 'ValidationError'){
        const messages = Object.values(err.errors).map(val => val.message);
        dbgr('Validation Error:', messages);
        return res.status(400).json({
            success: false,
            error: messages,
            timestamp: new Date().toISOString()
        });
    }

    //jwt error
    if(err.name === 'JsonWebTokenError'){
        const message = 'Invalid token. Please log in again.';
        dbgr('JWT Error:', message);
        return res.status(401).json({
            success: false,
            error: message,
            timestamp: new Date().toISOString()
        });
    }

    //default to 500 server error
    dbgr('Server Error:', err.message);
    return res.status(500).json({
        success: false,
        error: err.message || 'Server Error',
        timestamp: new Date().toISOString()
    });
}

module.exports = errorHandler;