const express = require('express');
const router = express.Router();

const { createProduct } = require('../../../controllers/api/productController');
const isLoggedIn = require('../../../middlewares/api/isLoggedIn');

router.use(isLoggedIn);

// test route
router.get('/test', (req,res)=>{
    res.status(200).json({
        message: 'Product route is working',
        success: true,
        timeStamp: new Date().toISOString()
    })
});

router.post('/create/:ownerId', createProduct);

module.exports = router;