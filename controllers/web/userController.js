const UserService = require('../../services/userService');

const dbgr = require('debug')('app:userController');

const registerUser = async (req,res,next)=>{
    try{
        dbgr('Request body received in controller:', req.body);
        const {name,email,password,role='buyer', ...additionalData} = req.body;

        const {user, token} = await UserService.registerUser(name, email, password, role, additionalData);
        dbgr('User registered successfully:', user);
        dbgr('Generated token:', token);

        res.cookie('token', token);

        req.flash('success', 'User registered successfully');
        res.redirect('/dashboard');
    }catch(error){
        dbgr('Error in registerUser controller:', error);
        req.flash('error', error.message || 'Error registering user');
        res.redirect('/user/registration');
    }
}

const loginUser = async (req,res)=>{
    try{
        dbgr('Request body received in controller:', req.body);
        const {email, password} = req.body;

        const {user, token} = await UserService.loginUser(email, password);
        dbgr('User logged in successfully:', user);
        dbgr('Generated token:', token);

        res.cookie('token', token);

        req.flash('success', 'User logged in successfully');
        res.redirect('/dashboard');
    }catch(error){
        dbgr('Error in loginUser controller:', error);
        req.flash('error', error.message || 'Error logging in user');
        res.redirect('/user/login');
    }
}

const logoutUser = async (req,res)=>{
    try{
        const userId = req.params.id;
        dbgr('Logging out user with ID:', userId);

        res.clearCookie('token');

        req.flash('success', 'User logged out successfully');
        res.redirect('/login');
    }catch(error){
        dbgr('Error in logoutUser controller:', error);
        req.flash('error', error.message || 'Error logging out user');
        res.redirect('/dashboard');
    }
}

const deleteUser = async (req,res)=>{
    try{
        const userId = req.params.id;
        dbgr('Deleting user with ID:', userId);

        await UserService.deleteUser(userId);

        req.flash('success', 'User deleted successfully');
        res.redirect('/user/registration');
    }catch(error){
        dbgr('Error in deleteUser controller:', error);
        req.flash('error', error.message || 'Error deleting user');
        res.redirect('/dashboard');
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    deleteUser
}