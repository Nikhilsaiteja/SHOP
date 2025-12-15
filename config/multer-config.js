const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const dbgr = require('debug')('app:multerConfig');

const storage = multer.diskStorage({
    destination: function(req,res,cb){
        cb(null, path.join(__dirname, '../public/images/products'));
    },
    filename: function(req,res,cb){
        const cryptoBytes = crypto.randomBytes(16).toString('hex');
        const ext = path.extname(req.file.originalname);
        dbgr("Generated filename: ", cryptoBytes + ext);
        cb(null, cryptoBytes + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // Default to 10MB
    },
    fileFilter: function(req, file, cb){
        const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(',');
        if(allowedTypes.includes(file.mimetype)){
            cb(null, true);
        }else{
            dbgr("File type not allowed: ", file.mimetype);
            cb(new Error('Invalid file type. Only images are allowed.'));
        }
    }
});

module.exports = upload;