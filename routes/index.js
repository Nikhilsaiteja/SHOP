const express = require('express');
const router = express.Router();

const userRoute = require('./web/userRoute');
const productRoute = require('./web/productRoute');
const ownerRoute = require('./web/ownerRoute');

router.use('/user', userRoute);
router.use('/product', productRoute);
router.use('/owner', ownerRoute);

module.exports = router;