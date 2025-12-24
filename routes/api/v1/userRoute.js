const express = require('express');
const router = express.Router();

const { validateUserRegisteration, validateUserLogin } = require('../../../middlewares/api/validator');
const { registerUser, loginUser, logoutUser, deleteUser } = require('../../../controllers/api/userController');
const {  showRegisterPage, showLoginPage } = require('../../../controllers/api/viewController');

// test route
router.get('/test', (req,res)=>{
    res.status(200).json({
        message: 'User route is working',
        success: true,
        timeStamp: new Date().toISOString()
    })
});

router.post('/register',validateUserRegisteration, registerUser);

router.post('/login', validateUserLogin, loginUser);

router.get('/logout/:id', logoutUser);

router.get('/delete/:id', deleteUser);

router.get('/registration', showRegisterPage);

router.get('/login', showLoginPage);

module.exports = router;