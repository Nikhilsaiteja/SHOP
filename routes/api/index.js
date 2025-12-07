const express = require('express');
const router = express.Router();

const userRoute = require('./v1/userRoute');
const productRoute = require('./v1/productRoute');
const ownerRoute = require('./v1/ownerRoute');

router.use('/v1/user', userRoute);
router.use('/v1/product', productRoute);
router.use('/v1/owner', ownerRoute);

module.exports = router;