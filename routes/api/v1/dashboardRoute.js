const express = require('express');
const router = express.Router();

const { showDashboard } = require('../../../controllers/api/viewController');
const { filterBy } = require('../../../controllers/api/dashboardController');
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

module.exports = router;