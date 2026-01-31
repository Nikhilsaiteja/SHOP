const express = require('express');
const router = express.Router();

const { showDashboard, showCreateProductPage, showCartPage } = require('../../../controllers/api/viewController');
const { filterBy, searchBy, decreaseProductQuantityInCart, increaseProductQuantityInCart, removeProductFromCart } = require('../../../controllers/api/dashboardController');
const isLoggedIn = require('../../../middlewares/api/isLoggedIn');

router.use(isLoggedIn);

router.get('/test', async (req,res)=>{
    res.status(200).json({
        message: 'Dashboard route is working',
        success: true,
        timeStamp: new Date().toISOString()
    })
});

router.get('/', showDashboard);

router.post('/:filter', filterBy);

router.post('/search', searchBy);

router.get('/creation', showCreateProductPage);

router.get('/cart', showCartPage);

router.get('/cart/minus/:productId', decreaseProductQuantityInCart);

router.get('/cart/plus/:productId', increaseProductQuantityInCart);

router.get('/cart/delete/:productId', removeProductFromCart);

module.exports = router;