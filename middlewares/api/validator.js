const joi = require('joi');
const Sanitizer = require('../../utils/sanitizer');

const dbgr = require('debug')('app:validator');

const validateUserRegisteration=(req,res,next)=>{

    dbgr('Validating user registration data', req.body);

    if(!req.body){
        return res.status(400).json({
            message:'Request body is missing',
            success:false,
            timestamp: new Date().toISOString()
        })
    }

    req.body = Sanitizer.sanitizeObject(req.body);

    const schema = joi.object({
        name: joi
            .string()
            .min(3)
            .max(30)
            .required()
            .trim(),
        email: joi
            .string()
            .email()
            .min(5)
            .max(254)
            .required()
            .trim(),
        password: joi
            .string()
            .min(8)
            .max(128)
            .required()
            .pattern(new RegExp("^[a-zA-Z0-9@#$%^&+=]*$")),
        role: joi
            .string()
            .valid('buyer', 'owner')
            .default('buyer')
    });

    const {error, value}=schema.validate(req.body, {abortEarly:false, convert:true});

    if(error){
        dbgr('Validation errors:', error.details);
        return res.status(400).json({
            message:'Validation errors',
            details: error.details.map(detail=>detail.message),
            success:false,
            timestamp: new Date().toISOString()
        });
    }

    dbgr('Validated data:', value);

    req.body = value;
    next();

}

const validateUserLogin=(req,res,next)=>{

    dbgr('Validating user login data', req.body);

    if(!req.body){
        return res.status(400).json({
            message:'Request body is missing',
            success:false,
            timestamp: new Date().toISOString()
        })
    }

    req.body = Sanitizer.sanitizeObject(req.body);

    const schema = joi.object({
        email: joi
            .string()
            .email()
            .required()
            .trim(),
        password: joi
            .string()
            .required()
            .trim()
    });

    const {error, value}=schema.validate(req.body, {abortEarly:false, convert:true});

    if(error){
        dbgr('Validation errors:', error.details);
        return res.status(400).json({
            message:'Validation errors',
            details: error.details.map(detail=>detail.message),
            success:false,
            timestamp: new Date().toISOString()
        });
    }

    dbgr('Validated data:', value);

    req.body = value;
    next();

}

module.exports = {
    validateUserRegisteration,
    validateUserLogin
}