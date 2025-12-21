const express = require('express');
const router = express.Router();

const { createProduct, likeProduct, addToCart } = require('../../controllers/web/productController');
const isLoggedIn = require('../../middlewares/web/isLoggedIn');
const { validateProductCreation } = require('../../middlewares/web/validator');

const upload = require('../../config/multer-config');

router.use(isLoggedIn);

// test route
router.get('/test', (req,res)=>{
    res.send('Product route is working');
});

router.post('/create', upload.array('images', 5), validateProductCreation, createProduct);

router.get('/like/:productId', likeProduct);

router.get('/cart/:productId', addToCart);

module.exports = router;