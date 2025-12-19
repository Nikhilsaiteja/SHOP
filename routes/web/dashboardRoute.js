const express = require('express');
const router = express.Router();

const { showDashboard } = require('../../controllers/web/viewController');
const { filterBy } = require('../../controllers/web/dashboardController');
const isLoggedIn = require('../../middlewares/web/isLoggedIn');

router.use(isLoggedIn);

router.get('/test', async (req,res)=>{
    res.send('Dashboard route is working');
});

router.get('/', showDashboard);

router.post('/:filter', filterBy);

module.exports = router;