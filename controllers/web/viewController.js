const userModel = require('../../models/user-model');
const ownerModel = require('../../models/owner-model');
const productModel = require('../../models/product-model');

const productService = require('../../services/productService');

const dbgr = require('debug')('app:viewController');

const showRegisterPage = async (req,res,next)=>{
    try{
        dbgr("Rendering register page");
        res.render('register');
    }catch(err){
        dbgr("Error in showRegisterPage: ", err);
        req.flash('error', 'Error loading register page');
        res.redirect('/registration');
    }
}

const showDashboard = async (req,res,next)=>{
    try{
        dbgr("Rendering dashboard page");
        const products = await productService.getAllProducts();
        res.render('dashboard', {products});
    }catch(err){
        dbgr("Error in showDashboard: ", err);
        req.flash('error', 'Error loading dashboard');
        res.redirect('/dashboard');
    }
}

module.exports = {
    showRegisterPage,
    showDashboard
}