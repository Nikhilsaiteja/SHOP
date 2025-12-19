const express = require('express');
const router = express.Router();

const userRoute = require('./web/userRoute');
const productRoute = require('./web/productRoute');
const dashboardRoute = require('./web/dashboardRoute');

router.use('/user', userRoute);
router.use('/product', productRoute);
router.use('/dashboard', dashboardRoute);

module.exports = router;