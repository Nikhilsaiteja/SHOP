const express = require('express');
const router = express.Router();

const { createProduct, likeProduct } = require('../../../controllers/api/productController');
const isLoggedIn = require('../../../middlewares/api/isLoggedIn');
const { validateProductCreation } = require('../../../middlewares/api/validator');

const upload = require('../../../config/multer-config');

router.use(isLoggedIn);

// test route
router.get('/test', (req,res)=>{
    res.status(200).json({
        message: 'Product route is working',
        success: true,
        timeStamp: new Date().toISOString()
    })
});

router.post('/create', upload.array('images', 5), validateProductCreation, createProduct);

router.post('/like/:productId', likeProduct);

module.exports = router;