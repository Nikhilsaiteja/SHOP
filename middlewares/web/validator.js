const joi = require('joi');
const Sanitizer = require('../../utils/sanitizer');

const dbgr = require('debug')('app:validator');

const validateUserRegisteration=(req,res,next)=>{

    dbgr('Validating user registration data', req.body);

    if(!req.body){
        req.flash('error', 'Request body is missing');
        return res.redirect('/registration');
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
        req.flash('error', 'Validation error');
        return res.redirect('/registration');
    }

    dbgr('Validated data:', value);

    req.body = value;
    next();

}

const validateUserLogin=(req,res,next)=>{

    dbgr('Validating user login data', req.body);

    if(!req.body){
        req.flash('error', 'Request body is missing');
        return res.redirect('/login');
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
        req.flash('error', 'Validation error');
        return res.redirect('/login');
    }

    dbgr('Validated data:', value);

    req.body = value;
    next();

}

const validateProductCreation=(req,res,next)=>{
    try{
        dbgr('Validating product creation data', req.body);

        if(!req.body){
            req.flash('error', 'Request body is missing');
            return res.redirect('/create-product');
        }

        req.body = Sanitizer.sanitizeObject(req.body);

        const schema = joi.object({
            name: joi
                .string()
                .min(3)
                .max(100)
                .required()
                .trim(),
            price: joi
                .number()
                .min(0)
                .required(),
            discount: joi
                .number()
                .min(0)
                .default(0),
            category: joi
                .string()
                .valid('electronics','accessories', 'clothes', 'books', 'home', 'beauty', 'sports', 'other')
                .default('other'),    
        });

        const {error, value}=schema.validate(req.body, {abortEarly:false, convert:true});

        if(error){
            dbgr('Validation errors:', error.details);
            req.flash('error', 'Validation error');
            return res.redirect('/create-product');
        }

        dbgr('Validated data:', value);
        req.body = value;

        dbgr('Images received:', req.files);
        if(!req.files || req.files.length===0){
            req.flash('error', 'At least one product image is required');
            return res.redirect('/create-product');
        }

        req.files = req.files.map(file=> {
            return {
                ...file,
                originalname: Sanitizer.sanitizeFileName(file.originalname)
            }
        })

        const filesSchema = joi.object({
            images: joi.array()
                .items(joi.object({
                    fieldname: joi.string().valid('images').required(),
                    originalname: joi.string().required(),
                    encoding: joi.string().required(),
                    mimetype: joi.string().valid('image/jpeg', 'image/png', 'image/gif', 'image/webp').required(),
                    path: joi.string().required(),
                    size: joi.number().max(5 * 1024 * 1024).required() // Max 5MB
                }).unknown(true))
                .min(1)
                .required()
        });

        const {error: filesError }=filesSchema.validate({images: req.files}, {abortEarly:false, convert:true});

        if(filesError){
            dbgr('File validation errors:', filesError.details);
            req.flash('error', 'File validation errors');
            return res.redirect('/create-product');
        }

        dbgr('Validated files:', req.files);
        next();
    }catch(err){
        dbgr('Error in product creation validation:', err);
        req.flash('error', 'Internal server error during validation');
        return res.redirect('/create-product');
    }
}

module.exports = {
    validateUserRegisteration,
    validateUserLogin,
    validateProductCreation
}