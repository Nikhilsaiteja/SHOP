const express = require('express');
const router = express.Router();

const { createProduct } = require('../../../controllers/api/productController');
const isLoggedIn = require('../../../middlewares/api/isLoggedIn');
const { validateProductCreation } = require('../../../middlewares/api/validator');

router.use(isLoggedIn);

// test route
router.get('/test', (req,res)=>{
    res.status(200).json({
        message: 'Product route is working',
        success: true,
        timeStamp: new Date().toISOString()
    })
});

router.post('/create/:ownerId', validateProductCreation, createProduct);

module.exports = router;