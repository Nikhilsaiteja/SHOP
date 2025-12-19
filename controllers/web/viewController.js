const userModel = require('../../models/user-model');
const ownerModel = require('../../models/owner-model');
const productModel = require('../../models/product-model');

const productService = require('../../services/productService');

const dbgr = require('debug')('app:viewController');

const showRegisterPage = async (req,res,next)=>{
    try{
        dbgr("Rendering register page");
        const success = req.flash('success');
        const error = req.flash('error');
        res.render('registrationPage', {success, error});
    }catch(err){
        dbgr("Error in showRegisterPage: ", err);
        req.flash('error', 'Error loading register page');
        res.redirect('/user/registrationPage');
    }
}

const showLoginPage = async (req,res,next)=>{
    try{
        dbgr("Rendering login page");
        const success = req.flash('success');
        const error = req.flash('error');
        res.render('loginPage', {success, error});
    }catch(err){
        dbgr("Error in showLoginPage: ", err);
        req.flash('error', err.message || 'Error loading login page');
        res.redirect('/user/login');
    }
}

const showDashboard = async (req,res,next)=>{
    try{
        dbgr("Rendering dashboard page");
        const products = await productService.getAllProducts();
        const success = req.flash('success');
        const error = req.flash('error');
        res.render('dashboardPage', {products, success, error});
    }catch(err){
        dbgr("Error in showDashboard: ", err);
        req.flash('error', err.message || 'Error loading dashboard');
        res.redirect('/dashboard');
    }
}

module.exports = {
    showRegisterPage,
    showLoginPage,
    showDashboard
}