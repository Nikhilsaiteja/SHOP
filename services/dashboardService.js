const productModel = require('../models/product-model');
const userModel = require('../models/user-model');
const ownerModel = require('../models/owner-model');

const dbgr = require('debug')('app:dashboardService');

const cache = require('../utils/redisCache');

class DashboardService {

    async getDashboardDataByFilter(filter,page=1){
        try{
            let limit = parseInt(process.env.ITEMS_PER_PAGE) || 10;
            page = parseInt(page);
            let skip = (page-1)*limit;

            dbgr('Fetching dashboard data with filter:', filter);

            const cacheKey = `products:filter:${filter}`;
            const cachedData = await cache.get(cacheKey);
            if(cachedData){
                dbgr('Returning cached data for filter:', filter);
                return JSON.parse(cachedData);
            }   

            let products;
            let query={};
            let sortOption={ createdAt: -1 };
            
            if(filter == 'new' || filter == 'select'){
                query = {};
                dbgr('Fetching products with query:', query);
            }
            else if(filter == 'old'){
                query = {};
                sortOption = { createdAt: 1 };
                dbgr('Fetching products with query:', query, 'and sort option:', sortOption);
            }
            else if(filter == 'discounted'){
                query = { discount: { $gt: 0 }};
                sortOption = { discount: -1 };
                dbgr('Fetching products with query:', query, 'and sort option:', sortOption);
            }
            else if(filter == 'popular'){
                products = await productModel.aggregate([
                    { $addFields: { likesCount: { $size: "$likes" }}},
                    { $sort: { likesCount: -1 }},
                    { $skip: skip },
                    { $limit: limit }
                ])

                await cache.set(cacheKey, JSON.stringify(products));

                const totalProducts = await productModel.countDocuments();
                const totalPages = Math.ceil(totalProducts / limit);
                const hasNextPage = page < totalPages;
                const hasPrevPage = page > 1;
                const nextPage = hasNextPage ? page + 1 : null;
                const prevPage = hasPrevPage ? page - 1 : null;
                return {
                    products,
                    pagination: {
                        currentPage: page,
                        totalPages,
                        hasNextPage,
                        hasPrevPage,
                        nextPage,
                        prevPage
                    }
                }
            }
            else{
                query = {category: filter};
                dbgr('Fetching products with query:', query);
            }

            products = await productModel.find(query).sort(sortOption).skip(skip).limit(limit);
            dbgr('Fetched products:', products);
            
            await cache.set(cacheKey, JSON.stringify(products));

            const totalProducts = await productModel.countDocuments(query);
            const totalPages = Math.ceil(totalProducts / limit);
            const hasNextPage = page < totalPages;
            const hasPrevPage = page > 1;
            const nextPage = hasNextPage ? page + 1 : null;
            const prevPage = hasPrevPage ? page - 1 : null;
            return {
                products,
                pagination: {
                    currentPage: page,
                    totalPages,
                    hasNextPage,
                    hasPrevPage,
                    nextPage,
                    prevPage
                }
            }
        }catch(error){
            dbgr('Error in getDashboardData:', error);
            throw new Error('Error fetching dashboard data: ' + error.message);
        }
    }

    async getDashboardDataBySearch(searchText,page=1){
        try{
            dbgr('Fetching dashboard data with search text:', searchText);

            const cacheKey = `products:search:${searchText}`;
            const cachedData = await cache.get(cacheKey);

            let limit = parseInt(process.env.ITEMS_PER_PAGE) || 10;
            page = parseInt(page);
            let skip = (page-1)*limit;

            if(cachedData){
                dbgr('Returning cached data for search text:', searchText);
                return JSON.parse(cachedData);
            }

            let searchTextFormatted = searchText.includes(' ') ? `"${searchText}"` : searchText;

            const products = await productModel.find({ $text: { $search: searchTextFormatted } }).skip(skip).limit(limit);
            dbgr('Fetched products (search):', products);
            await cache.set(cacheKey, JSON.stringify(products));

            const totalProducts = await productModel.countDocuments({ $text: { $search: searchTextFormatted } });
            const totalPages = Math.ceil(totalProducts / limit);
            const hasNextPage = page < totalPages;
            const hasPrevPage = page > 1;
            const nextPage = hasNextPage ? page + 1 : null;
            const prevPage = hasPrevPage ? page - 1 : null;
            return {
                products,
                pagination: {
                    currentPage: page,
                    totalPages,
                    hasNextPage,
                    hasPrevPage,
                    nextPage,
                    prevPage
                }
            }
        }catch(error){
            dbgr('Error in getDashboardDataBySearch:', error);
            throw new Error('Error fetching dashboard data by search: ' + error.message);
        }
    }

    async getCartProducts(user){
        try{
            dbgr('Fetching cart products for user:', user._id);

            const cacheKey = `cart:products:${user._id}`;
            const cachedData = await cache.get(cacheKey);

            if(cachedData){
                dbgr('Returning cached cart products for user:', user._id);
                return JSON.parse(cachedData);
            }

            const cart = user.cart;
            dbgr('User cart items:', cart);
            const cartProducts = await Promise.all(cart.map(item=> productModel.findById(item.productId)));

            const cartProductsWithQuantity = cartProducts.map(product => {
                const quantity = cart.find(item => item.productId.toString() === product._id.toString()).quantity;
                const totalPrice = (product.price-product.discount) * quantity;
                return {...product.toObject(), quantity, totalPrice};
            });

            dbgr('Fetched cart products with quantity:', cartProductsWithQuantity);

            const totalCheckoutPrice = cartProductsWithQuantity.reduce((total, product) => total + product.totalPrice, 0);
            dbgr('Total checkout price:', totalCheckoutPrice);


            await cache.set(cacheKey, JSON.stringify({ cartProducts: cartProductsWithQuantity, totalCheckoutPrice }));

            return { cartProducts: cartProductsWithQuantity, totalCheckoutPrice };
        }catch(error){
            dbgr('Error in getCartProducts:', error);
            throw new Error('Error fetching cart products: ' + error.message);
        }
    }

    async decreaseProductQuantity(user, productId){
        try{
            dbgr('Decreasing product quantity for productId:', productId, 'and user:', user._id);

            user = await userModel.findById(user._id) || await ownerModel.findById(user._id);

            const cartItem = user.cart.find(item => item.productId.toString() === productId.toString());
            if(!cartItem){
                throw new Error('Product not found in cart');
            }
            if(cartItem.quantity > 1){
                cartItem.quantity -= 1;
                await user.save();
                dbgr('Decreased quantity of product in cart:', cartItem);
            }

            await cache.delPattern('cart:*');
            await cache.delPattern('user:*');

            return;
        }catch(error){
            dbgr('Error in decreaseProductQuantity:', error);
            throw new Error('Error decreasing product quantity: ' + error.message);
        }
    }

    async increaseProductQuantity(user, productId){
        try{
            dbgr('Increasing product quantity for productId:', productId, 'and user:', user._id);

            user = await userModel.findById(user._id) || await ownerModel.findById(user._id);

            const cartItem = user.cart.find(item => item.productId.toString() === productId.toString());
            if(!cartItem){
                throw new Error('Product not found in cart');
            }
            if(cartItem.quantity < 5){
                cartItem.quantity += 1;
                await user.save();
                dbgr('Increased quantity of product in cart:', cartItem);
            }

            await cache.delPattern('cart:*');
            await cache.delPattern('user:*');

            return;
        }catch(error){
            dbgr('Error in increaseProductQuantity:', error);
            throw new Error('Error increasing product quantity: ' + error.message);
        }
    }

    async removeProductFromCart(user, productId){
        try{
            dbgr('Removing product from cart for productId:', productId, 'and user:', user._id);

            user = await userModel.findById(user._id) || await ownerModel.findById(user._id);

            const cartItem = user.cart.find(item => item.productId.toString() === productId.toString());
            if(!cartItem){
                throw new Error('Product not found in cart');
            }
            user.cart = user.cart.filter(item => item.productId.toString() !== productId.toString());
            await user.save();
            dbgr('Removed product from cart:', productId);

            await cache.delPattern('cart:*');
            await cache.delPattern('user:*');
            
            return;
        }catch(error){
            dbgr('Error in removeProductFromCart:', error);
            throw new Error('Error removing product from cart: ' + error.message);
        }
    }

    async checkoutFromCart(user){
        try{
            dbgr('Checking out from cart for user:', user._id);

            user = await userModel.findById(user._id) || await ownerModel.findById(user._id);

            user.cart = [];
            await user.save();
            dbgr('Cleared user cart after checkout');
            await cache.delPattern('cart:*');
        }catch(error){
            dbgr('Error in checkoutFromCart:', error);
            throw new Error('Error during checkout: ' + error.message);
        }
    }

}

module.exports = new DashboardService();