const DashboardService = require('../../services/dashboardService');

const dbgr = require('debug')('app:dashboardController');

const filterBy = async  (req,res,next)=>{
    try{
        const filter = req.params.filter;
        dbgr('Filter by:', filter);
        const products = await DashboardService.getDashboardData(filter);
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

module.exports = {
    filterBy
}