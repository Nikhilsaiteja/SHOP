const express = require('express');
const router = express.Router();

const userRoute = require('./v1/userRoute');
const productRoute = require('./v1/productRoute');

router.use('/v1/user', userRoute);
router.use('/v1/product', productRoute);

module.exports = router;