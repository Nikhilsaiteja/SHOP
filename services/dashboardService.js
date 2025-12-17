const productModel = require('../models/product-model');

const dbgr = require('debug')('app:dashboardService');

class DashboardService {

    async getDashboardDataByFilter(filter){
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
            else if(filter == 'discounted'){
                products = await productModel.find({ discount: { $gt: 0 }});
                dbgr('Fetched products (discounted):', products);
            }
            else if(filter == 'popular'){
                products = await productModel.find({}).sort({ likes: -1 });
                dbgr('Fetched products (popular):', products);
            }
            else{
                products = await productModel.find({ category: filter });
                dbgr('Fetched products (filter):', products);
            }
            return products;
        }catch(error){
            dbgr('Error in getDashboardData:', error);
            throw new Error('Error fetching dashboard data: ' + error.message);
        }
    }

}

module.exports = new DashboardService();