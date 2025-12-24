const DashboardService = require('../../services/dashboardService');

const dbgr = require('debug')('app:dashboardController');

const filterBy = async  (req,res,next)=>{
    try{
        const filter = req.params.filter;
        dbgr('Filter by:', filter);
        const products = await DashboardService.getDashboardDataByFilter(filter);
        res.status(200).json({
            message: `Filtering by ${filter} - functionality not yet implemented`,
            products,
            success: true,
            timestamp: new Date().toISOString()
        });
    }catch(error){
        dbgr('Error in filterBy controller:', error);
        return next(error);
    }
}

const searchBy = async (req,res)=>{
    try{
        const { searchText } = req.body;
        const user = req.user;
        dbgr('Search by:', searchText);
        const products = await DashboardService.getDashboardDataBySearch(searchText);
        res.status(200).json({
            message: `Searching for ${searchText} - functionality not yet implemented`,
            products,
            success: true,
            timestamp: new Date().toISOString()
        });
    }catch(error){
        dbgr('Error in searchBy controller:', error);
        return next(error);
    }
}

const decreaseProductQuantityInCart = async (req,res)=>{
    try{
        const { productId } = req.params;
        const user = req.user;
        dbgr('Decrease product quantity in cart for productId:', productId);
        await DashboardService.decreaseProductQuantity(user, productId);
        res.status(200).json({
            message: `Decreased product quantity in cart successfully`,
            success: true,
            timestamp: new Date().toISOString()
        });
    }catch(error){
        dbgr('Error in decreaseProductQuantityInCart controller:', error);
        return next(error);
    }
}

const increaseProductQuantityInCart = async (req,res)=>{
    try{
        const { productId } = req.params;
        const user = req.user;
        dbgr('Increase product quantity in cart for productId:', productId);
        await DashboardService.increaseProductQuantity(user, productId);
        res.status(200).json({
            message: `Increased product quantity in cart successfully`,
            success: true,
            timestamp: new Date().toISOString()
        });
    }catch(error){
        dbgr('Error in increaseProductQuantityInCart controller:', error);
        return next(error);
    }
}

const removeProductFromCart = async (req,res)=>{
    try{
        const { productId } = req.params;
        const user = req.user;
        dbgr('Remove product from cart for productId:', productId);
        await DashboardService.removeProductFromCart(user, productId);
        res.status(200).json({
            message: `Removed product from cart successfully`,
            success: true,
            timestamp: new Date().toISOString()
        });
    }catch(error){
        dbgr('Error in removeProductFromCart controller:', error);
        return next(error);
    }
}

module.exports = {
    filterBy,
    searchBy,
    decreaseProductQuantityInCart,
    increaseProductQuantityInCart,
    removeProductFromCart
}