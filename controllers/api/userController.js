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

        res.status(201).json({
            message: 'User registered successfully',
            user,
            token,
            timestamp: new Date().toISOString()
        })
    }catch(error){
        dbgr('Error in registerUser controller:', error);
        next(error);
    }
}

const loginUser = async (req,res,next)=>{
    try{
        dbgr('Request body received in controller:', req.body);
        const {email, password} = req.body;

        const {user, token} = await UserService.loginUser(email, password);
        dbgr('User logged in successfully:', user);
        dbgr('Generated token:', token);

        res.cookie('token', token);

        res.status(200).json({
            message: 'User logged in successfully',
            user,
            token,
            timestamp: new Date().toISOString()
        })
    }catch(error){
        dbgr('Error in loginUser controller:', error);
        next(error);
    }
}

const logoutUser = async (req,res,next)=>{
    try{
        const userId = req.params.id;
        dbgr('Logging out user with ID:', userId);

        res.clearCookie('token');

        res.status(200).json({
            message: 'User logged out successfully',
            success: true,
            timestamp: new Date().toISOString()
        })
    }catch(error){
        dbgr('Error in logoutUser controller:', error);
        next(error);
    }
}

const deleteUser = async (req,res,next)=>{
    try{
        const userId = req.params.id;
        dbgr('Deleting user with ID:', userId);

        await UserService.deleteUser(userId);

        res.status(200).json({
            message: 'User deleted successfully',
            success: true,
            timestamp: new Date().toISOString()
        })
    }catch(error){
        dbgr('Error in deleteUser controller:', error);
        next(error);
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    deleteUser
}