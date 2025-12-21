const DashboardService = require('../../services/dashboardService');

const dbgr = require('debug')('app:dashboardController');

const filterBy = async  (req,res,next)=>{
    try{
        const { filter } = req.body;
        dbgr('Filter by:', filter);
        const products = await DashboardService.getDashboardDataByFilter(filter);
        req.flash('success', `Filtered by ${filter} successfully`);
        const success = req.flash('success');
        const error = req.flash('error');
        dbgr(`products after filtering by ${filter}:`, products);
        res.render('dashboardPage', {products, success, error, filter});
    }catch(error){
        dbgr('Error in filterBy controller:', error);
        req.flash('error', error.message || 'Error filtering dashboard');
        res.redirect('/dashboard');
    }
}

const searchBy = async (req,res,next)=>{
    try{
        const { searchText } = req.body;
        const user = req.user;
        dbgr('Search by:', searchText);
        const products = await DashboardService.getDashboardDataBySearch(searchText);
        req.flash('success', `Searched for ${searchText} successfully`);
        const success = req.flash('success');
        const error = req.flash('error');
        dbgr(`products after searching for ${searchText}:`, products);
        res.render('dashboardPage', {products, user, success, error});
    }catch(error){
        dbgr('Error in searchBy controller:', error);
        req.flash('error', error.message || 'Error searching dashboard');
        res.redirect('/dashboard');
    }
}

const decreaseProductQuantityInCart = async (req,res,next)=>{
    try{
        const { productId } = req.params;
        const user = req.user;
        dbgr('Decrease product quantity in cart for productId:', productId);
        await DashboardService.decreaseProductQuantity(user, productId);
        req.flash('success', `Decreased product quantity in cart successfully`);
        res.redirect('/dashboard/cart');
    }catch(error){
        dbgr('Error in decreaseProductQuantityInCart controller:', error);
        req.flash('error', error.message || 'Error decreasing product quantity in cart');
        res.redirect('/dashboard/cart');
    }
}

const increaseProductQuantityInCart = async (req,res,next)=>{
    try{
        const { productId } = req.params;
        const user = req.user;
        dbgr('Increase product quantity in cart for productId:', productId);
        await DashboardService.increaseProductQuantity(user, productId);
        req.flash('success', `Increased product quantity in cart successfully`);
        res.redirect('/dashboard/cart');
    }catch(error){
        dbgr('Error in increaseProductQuantityInCart controller:', error);
        req.flash('error', error.message || 'Error increasing product quantity in cart');
        res.redirect('/dashboard/cart');
    }
}

const removeProductFromCart = async (req,res,next)=>{
    try{
        const { productId } = req.params;
        const user = req.user;
        dbgr('Remove product from cart for productId:', productId);
        await DashboardService.removeProductFromCart(user, productId);
        req.flash('success', `Removed product from cart successfully`);
        res.redirect('/dashboard/cart');
    }catch(error){
        dbgr('Error in removeProductFromCart controller:', error);
        req.flash('error', error.message || 'Error removing product from cart');
        res.redirect('/dashboard/cart');
    }
}

module.exports = {
    filterBy,
    searchBy,
    decreaseProductQuantityInCart,
    increaseProductQuantityInCart,
    removeProductFromCart
}