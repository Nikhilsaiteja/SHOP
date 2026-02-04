const productService = require('../../services/productService');
const dashboardService = require('../../services/dashboardService');

const dbgr = require('debug')('app:viewController');

const showRegisterPage = async (req,res)=>{
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

const showLoginPage = async (req,res)=>{
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

const showDashboard = async (req,res)=>{
    try{
        dbgr("Rendering dashboard page");
        dbgr("Query params: ", req.query);
        const page = parseInt(req.query.page) || 1;
        const user = req.user;
        const result = await productService.getAllProducts(page);
        const products = result.products;
        const pagination = result.pagination;
        dbgr("Pagination info: ", pagination);
        const success = req.flash('success');
        const error = req.flash('error');
        const filter = 'select';
        res.render('dashboardPage', {products, user, success, error, filter, pagination});
    }catch(err){
        dbgr("Error in showDashboard: ", err);
        req.flash('error', err.message || 'Error loading dashboard');
        res.redirect('/dashboard/data');
    }
}

const showCreateProductPage = async (req,res)=>{
    try{
        dbgr("Rendering create product page");
        const success = req.flash('success');
        const error = req.flash('error');
        res.render('createProductPage', {success, error});
    }catch(err){
        dbgr("Error in showCreateProductPage: ", err);
        req.flash('error', err.message || 'Error loading create product page');
        res.redirect('/dashboard/data');
    }
}

const showCartPage = async (req,res)=>{
    try{
        dbgr("Rendering cart page");
        const user = req.user;
        const cartProducts = await dashboardService.getCartProducts(user);
        const success = req.flash('success');
        const error = req.flash('error');
        res.render('cartPage', {cartProducts, user, success, error});
    }catch(err){
        dbgr("Error in showCartPage: ", err);
        req.flash('error', err.message || 'Error loading cart page');
        res.redirect('/dashboard/data');
    }
}

module.exports = {
    showRegisterPage,
    showLoginPage,
    showDashboard,
    showCreateProductPage,
    showCartPage
}