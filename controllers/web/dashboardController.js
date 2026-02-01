const DashboardService = require('../../services/dashboardService');

const dbgr = require('debug')('app:dashboardController');

const filterBy = async  (req,res)=>{
    try{
        dbgr('Query params:', req.query);
        const { filter, page } = req.query;
        dbgr('Filter by:', filter, 'Page:', page);
        const user = req.user;
        const result = await DashboardService.getDashboardDataByFilter(filter, page);
        req.flash('success', `Filtered by ${filter} successfully`);
        const products = result.products;
        const pagination = result.pagination;
        const success = req.flash('success');
        const error = req.flash('error');
        dbgr(`products after filtering by ${filter}:`, result.products);
        res.render('dashboardPage', {products, user, success, error, filter, pagination});
    }catch(error){
        dbgr('Error in filterBy controller:', error);
        req.flash('error', error.message || 'Error filtering dashboard');
        res.redirect('/dashboard');
    }
}

const searchBy = async (req,res)=>{
    try{
        dbgr('Body params:', req.body);
        const { searchText } = req.body;
        dbgr('Query params:', req.query);
        const page = req.query.page || 1;
        dbgr('Search by:', searchText, 'Page:', page);
        const user = req.user;
        dbgr('Search by:', searchText);
        const result = await DashboardService.getDashboardDataBySearch(searchText, page);
        req.flash('success', `Searched for ${searchText} successfully`);
        const products = result.products;
        const pagination = result.pagination;
        const success = req.flash('success');
        const error = req.flash('error');
        const filter = 'select';
        dbgr(`products after searching for ${searchText}:`, products);
        res.render('dashboardPage', {products, user, success, error, filter, pagination});
    }catch(error){
        dbgr('Error in searchBy controller:', error);
        req.flash('error', error.message || 'Error searching dashboard');
        res.redirect('/dashboard/data');
    }
}

const decreaseProductQuantityInCart = async (req,res)=>{
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

const increaseProductQuantityInCart = async (req,res)=>{
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

const removeProductFromCart = async (req,res)=>{
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