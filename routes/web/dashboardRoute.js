const express = require('express');
const router = express.Router();

const { showDashboard, showCreateProductPage, showCartPage } = require('../../controllers/web/viewController');
const { filterBy, searchBy, decreaseProductQuantityInCart, increaseProductQuantityInCart, removeProductFromCart } = require('../../controllers/web/dashboardController');
const isLoggedIn = require('../../middlewares/web/isLoggedIn');

router.use(isLoggedIn);

router.get('/test', async (req,res)=>{
    res.send('Dashboard route is working');
});

router.get('/', showDashboard);

router.post('/filter', filterBy);

router.post('/search', searchBy);

router.get('/creation', showCreateProductPage);

router.get('/cart', showCartPage);

router.get('/cart/minus/:productId', decreaseProductQuantityInCart);

router.get('/cart/plus/:productId', increaseProductQuantityInCart);

router.get('/cart/delete/:productId', removeProductFromCart);

module.exports = router;