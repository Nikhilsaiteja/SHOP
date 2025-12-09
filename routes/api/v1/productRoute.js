const express = require('express');
const router = express.Router();

const { createProduct } = require('../../../controllers/api/productController');

// test route
router.get('/test', (req,res)=>{
    res.status(200).json({
        message: 'Product route is working',
        success: true,
        timeStamp: new Date().toISOString()
    })
});

router.post('/create', createProduct);

module.exports = router;