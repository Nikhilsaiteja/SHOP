const productModel = require('../models/product-model');

const dbgr = require('debug')('app:dashboardService');

const cache = require('../utils/redisCache');

class DashboardService {

    async getDashboardDataByFilter(filter){
        try{
            dbgr('Fetching dashboard data with filter:', filter);

            const cacheKey = `products:filter:${filter}`;
            const cachedData = await cache.get(cacheKey);
            if(cachedData){
                dbgr('Returning cached data for filter:', filter);
                return JSON.parse(cachedData);
            }   

            let products;
            
            if(filter == 'new'){
                products = await (await productModel.find({}));
                dbgr('Fetched products (new):', products);

                await cache.set(cacheKey, JSON.stringify(products));
            }
            else if(filter == 'old'){
                products = (await productModel.find({})).reverse();
                dbgr('Fetched products (old):', products);

                await cache.set(cacheKey, JSON.stringify(products));
            }
            else if(filter == 'discounted'){
                products = await productModel.find({ discount: { $gt: 0 }});
                dbgr('Fetched products (discounted):', products);

                await cache.set(cacheKey, JSON.stringify(products));
            }
            else if(filter == 'popular'){
                products = (await productModel.find({})).sort((a,b)=> a.likes.length - b.likes.length);
                dbgr('Fetched products (popular):', products);

                await cache.set(cacheKey, JSON.stringify(products));
            }
            else{
                products = await productModel.find({ category: filter });
                dbgr('Fetched products (filter):', products);

                await cache.set(cacheKey, JSON.stringify(products));
            }
            return products;
        }catch(error){
            dbgr('Error in getDashboardData:', error);
            throw new Error('Error fetching dashboard data: ' + error.message);
        }
    }

    async getDashboardDataBySearch(searchText){
        try{
            dbgr('Fetching dashboard data with search text:', searchText);

            const cacheKey = `products:search:${searchText}`;
            const cachedData = await cache.get(cacheKey);

            if(cachedData){
                dbgr('Returning cached data for search text:', searchText);
                return JSON.parse(cachedData);
            }

            const products = await productModel.find({ $text: { $search: searchText } });
            dbgr('Fetched products (search):', products);
            await cache.set(cacheKey, JSON.stringify(products));
            return products;
        }catch(error){
            dbgr('Error in getDashboardDataBySearch:', error);
            throw new Error('Error fetching dashboard data by search: ' + error.message);
        }
    }

}

module.exports = new DashboardService();