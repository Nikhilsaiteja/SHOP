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
        dbgr('Search by:', searchText);
        const products = await DashboardService.getDashboardDataBySearch(searchText);
        req.flash('success', `Searched for ${searchText} successfully`);
        const success = req.flash('success');
        const error = req.flash('error');
        dbgr(`products after searching for ${searchText}:`, products);
        res.render('dashboardPage', {products, success, error});
    }catch(error){
        dbgr('Error in searchBy controller:', error);
        req.flash('error', error.message || 'Error searching dashboard');
        res.redirect('/dashboard');
    }
}

module.exports = {
    filterBy,
    searchBy
}