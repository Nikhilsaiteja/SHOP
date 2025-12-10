const express = require('express');
const router = express.Router();

const userRoute = require('./v1/userRoute');
const productRoute = require('./v1/productRoute');
const dashboardRoute = require('./v1/dashboardRoute');

router.use('/v1/user', userRoute);
router.use('/v1/product', productRoute);
router.use('/v1/dashboard', dashboardRoute);

module.exports = router;