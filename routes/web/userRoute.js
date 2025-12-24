const express = require('express');
const router = express.Router();

const { validateUserRegisteration, validateUserLogin } = require('../../middlewares/web/validator');
const { registerUser, loginUser, logoutUser, deleteUser } = require('../../controllers/web/userController');
const {  showRegisterPage, showLoginPage } = require('../../controllers/web/viewController');

// test route
router.get('/test', (req,res)=>{
    res.send('User route is working');
});

router.post('/register',validateUserRegisteration, registerUser);

router.post('/login', validateUserLogin, loginUser);

router.get('/logout/:id', logoutUser);

router.get('/delete/:id', deleteUser);

router.get('/registration', showRegisterPage);

router.get('/login', showLoginPage);

module.exports = router;