const express = require('express');
const router = express.Router();

const { showDashboard } = require('../../../controllers/api/viewController');

router.get('/test', async (req,res)=>{
    res.status(200).json({
        message: 'Dashboard route is working',
        success: true,
        timeStamp: new Date().toISOString()
    })
});

router.get('/', showDashboard);

module.exports = router;