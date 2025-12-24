const productService = require('../../services/productService');
const dashboardService = require('../../services/dashboardService');

const dbgr = require('debug')('app:viewController');

const showRegisterPage = async (req,res,next)=>{
    try{
        dbgr("Rendering register page");
        res.status(200).json({
            message: "Register page data",
            data: {},
            success: true,
            timestamp: new Date().toISOString()
        });
    }catch(err){
        dbgr("Error in showRegisterPage: ", err);
        next(err);
    }
}

const showLoginPage = async (req,res)=>{
    try{
        dbgr("Rendering login page");
        res.status(200).json({
            message: "Login page data",
            data: {},
            success: true,
            timestamp: new Date().toISOString()
        });
    }catch(err){
        dbgr("Error in showLoginPage: ", err);
        return next(err);
    }
}

const showDashboard = async (req,res,next)=>{
    try{
        dbgr("Rendering dashboard page");
        const products = await productService.getAllProducts();
        res.status(200).json({
            message: "Dashboard data fetched successfully",
            data: {
                products,
                user: req.user
            },
            success: true,
            timestamp: new Date().toISOString()
        })
    }catch(err){
        dbgr("Error in showDashboard: ", err);
        next(err);
    }
}

const showCreateProductPage = async (req,res)=>{
    try{
        dbgr("Rendering create product page");
        res.status(200).json({
            message: "Create product page data",
            data: {},
            success: true,
            timestamp: new Date().toISOString()
        });
    }catch(err){
        dbgr("Error in showCreateProductPage: ", err);
        return next(err);
    }
}

const showCartPage = async (req,res)=>{
    try{
        dbgr("Rendering cart page");
        const user = req.user;
        const cartProducts = await dashboardService.getCartProducts(user);
        res.status(200).json({
            message: "Cart page data fetched successfully",
            data: {
                cartProducts,
                user
            },
            success: true,
            timestamp: new Date().toISOString()
        });
    }catch(err){
        dbgr("Error in showCartPage: ", err);
        return next(err);
    }
}

module.exports = {
    showRegisterPage,
    showLoginPage,
    showDashboard,
    showCreateProductPage,
    showCartPage
}