const DashboardService = require('../../services/dashboardService');

const dbgr = require('debug')('app:dashboardController');

const filterBy = async  (req,res,next)=>{
    try{
        const filter = req.params.filter;
        dbgr('Filter by:', filter);
        const products = await DashboardService.getDashboardDataByFilter(filter);
        req.flash('success', `Filtered by ${filter} successfully`);
        res.redirect('/dashboard');
    }catch(error){
        dbgr('Error in filterBy controller:', error);
        req.flash('error', error.message || 'Error filtering dashboard');
        res.redirect('/dashboard');
    }
}

module.exports = {
    filterBy
}