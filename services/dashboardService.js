const productModel = require('../models/product-model');

const dbgr = require('debug')('app:dashboardService');

class DashboardService {

    async getDashboardData(filter){
        try{
            dbgr('Fetching dashboard data with filter:', filter);
            let products;
            if(filter == 'new'){
                products = await (await productModel.find({})).reverse();
                dbgr('Fetched products (new):', products);
            }
            else if(filter == 'old'){
                products = await productModel.find({});
                dbgr('Fetched products (old):', products);
            }
            return products;
        }catch(error){
            dbgr('Error in getDashboardData:', error);
            throw new Error('Error fetching dashboard data: ' + error.message);
        }
    }

}

module.exports = new DashboardService();