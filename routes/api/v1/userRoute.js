const express = require('express');
const router = express.Router();

const { registerUser, loginUser } = require('../../../controllers/api/userController');

// test route
router.get('/test', (req,res)=>{
    res.status(200).json({
        message: 'User route is working',
        success: true,
        timeStamp: new Date().toISOString()
    })
});

router.post('/register', registerUser);

router.post('/login', loginUser);

module.exports = router;