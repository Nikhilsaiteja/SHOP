const userModel = require('../../models/user-model');
const ownerModel = require('../../models/owner-model');
const productModel = require('../../models/product-model');

const productService = require('../../services/productService');

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

const showDashboard = async (req,res,next)=>{
    try{
        dbgr("Rendering dashboard page");
        const products = await productService.getAllProducts();
        res.status(200).json({
            message: "Dashboard data fetched successfully",
            data: {
                products
            },
            success: true,
            timestamp: new Date().toISOString()
        })
    }catch(err){
        dbgr("Error in showDashboard: ", err);
        next(err);
    }
}

module.exports = {
    showRegisterPage,
    showDashboard
}