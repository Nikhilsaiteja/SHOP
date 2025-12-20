const express = require('express');
const router = express.Router();

const { showDashboard, showCreateProductPage } = require('../../controllers/web/viewController');
const { filterBy } = require('../../controllers/web/dashboardController');
const isLoggedIn = require('../../middlewares/web/isLoggedIn');
const { validateProductCreation } = require('../../middlewares/web/validator');

router.use(isLoggedIn);

router.get('/test', async (req,res)=>{
    res.send('Dashboard route is working');
});

router.get('/', showDashboard);

router.post('/:filter', filterBy);

router.get('/creation', showCreateProductPage);

module.exports = router;