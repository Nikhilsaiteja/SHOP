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

    async decreaseProductQuantity(user, productId){
        try{
            dbgr('Decreasing product quantity for productId:', productId, 'and user:', user._id);

            const cartItem = user.cart.find(item => item.productId.toString() === productId.toString());
            if(!cartItem){
                throw new Error('Product not found in cart');
            }
            if(cartItem.quantity > 1){
                cartItem.quantity -= 1;
                await user.save();
                dbgr('Decreased quantity of product in cart:', cartItem);
            }
            return;
        }catch(error){
            dbgr('Error in decreaseProductQuantity:', error);
            throw new Error('Error decreasing product quantity: ' + error.message);
        }
    }

    async increaseProductQuantity(user, productId){
        try{
            dbgr('Increasing product quantity for productId:', productId, 'and user:', user._id);

            const cartItem = user.cart.find(item => item.productId.toString() === productId.toString());
            if(!cartItem){
                throw new Error('Product not found in cart');
            }
            if(cartItem.quantity < 5){
                cartItem.quantity += 1;
                await user.save();
                dbgr('Increased quantity of product in cart:', cartItem);
            }
            return;
        }catch(error){
            dbgr('Error in increaseProductQuantity:', error);
            throw new Error('Error increasing product quantity: ' + error.message);
        }
    }

    async removeProductFromCart(user, productId){
        try{
            dbgr('Removing product from cart for productId:', productId, 'and user:', user._id);

            const cartItem = user.cart.find(item => item.productId.toString() === productId.toString());
            if(!cartItem){
                throw new Error('Product not found in cart');
            }
            user.cart = user.cart.filter(item => item.productId.toString() !== productId.toString());
            await user.save();
            dbgr('Removed product from cart:', productId);
            return;
        }catch(error){
            dbgr('Error in removeProductFromCart:', error);
            throw new Error('Error removing product from cart: ' + error.message);
        }
    }

}

module.exports = new DashboardService();