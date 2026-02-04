const productModel = require('../models/product-model');
const ownerModel = require('../models/owner-model');
const userModel = require('../models/user-model');

const dbgr = require('debug')('app:services:productService');

const cache = require('../utils/redisCache');

const mongoose = require('mongoose');

class ProductService{

    async createProduct(name, ownerId, price, discount, category, images){

        if(process.env.NODE_ENV === 'QA' || process.env.NODE_ENV === 'UAT' || process.env.NODE_ENV === 'PROD'){
            const session = await mongoose.startSession();
            try{
                dbgr('Data received in service layer: ', {name, ownerId, price, discount, category, images});
                session.startTransaction();

                const owner = await ownerModel.findById(ownerId).session(session);
                if(!owner){
                    dbgr("Owner not found with id: ", ownerId);
                    throw new Error('Owner not found');
                }

                const filepaths = images.map(file => file.path);
                const imagePaths = filepaths.map(fp => fp.replace(/\\/g, '/').split('public')[1]); 
                dbgr('Processed image paths:', imagePaths);
                
                const newProduct = await productModel.create([{
                    name,
                    owner: ownerId,
                    price,
                    discount,
                    category,
                    images: imagePaths
                }], { session });

                owner.products.push(newProduct[0]._id);
                await owner.save({ session });

                await session.commitTransaction();
                dbgr("Product created successfully: ", newProduct[0]);

                await cache.delPattern('products:*');

                return newProduct[0];
                
            }catch(err){
                dbgr("Error in creating product: ", err);
                await session.abortTransaction();
                throw err;
            }finally{
                session.endSession();
            }
        }else{
            try{
                dbgr('Data received in service layer: ', {name, ownerId, price, discount, category, images});

                const owner = await ownerModel.findById(ownerId);
                if(!owner){
                    dbgr("Owner not found with id: ", ownerId);
                    throw new Error('Owner not found');
                }

                const filepaths = images.map(file => file.path);
                const imagePaths = filepaths.map(fp => fp.replace(/\\/g, '/').split('public')[1]); 
                dbgr('Processed image paths:', imagePaths);
                
                const newProduct = await productModel.create({
                    name,
                    owner: ownerId,
                    price,
                    discount,
                    category,
                    images: imagePaths
                });

                owner.products.push(newProduct._id);
                await owner.save();

                dbgr("Product created successfully: ", newProduct);
                await cache.delPattern('products:*');

                return newProduct;
            }catch(err){
                dbgr("Error in creating product: ", err);
                throw err;
            }
        }

        
    }

    async likeProduct(productId, userId){
        try{
            dbgr("Liking product in service layer: ", {productId, userId});
            const product = await productModel.findById(productId);
            if(!product){
                dbgr("Product not found with id: ", productId);
                throw new Error('Product not found');
            }

            if(product.likes.includes(userId)){
                dbgr("User has already liked the product: ", userId);
                product.likes.pull(userId);
                dbgr("Product unliked: ", product);
            }else{
                product.likes.push(userId);
                dbgr("Product liked: ", product);
            }
            
            await product.save();
            await cache.delPattern('products:*');
            return product;
        }catch(err){
            dbgr("Error in liking product: ", err);
            throw err;
        }
    }

    async getAllProducts(page=1){
        try{
            dbgr("Fetching all products in service layer by pagination");
            let limit = parseInt(process.env.ITEMS_PER_PAGE) || 10;
            let skip = (page-1)*limit;

            const cacheKey = `products:page:${page}`;
            let cacheData = await cache.get(cacheKey);
            if(cacheData){
                dbgr("Products fetched from cache: ", cacheData);
                return JSON.parse(cacheData);
            }
            const products = await productModel.find().skip(skip).limit(limit).sort({ createdAt: -1 }).lean();
            dbgr("Products fetched from DB: ", products);
            const totalProducts = await productModel.countDocuments();
            const totalPages = Math.ceil(totalProducts / limit);

            const hasNextPage = page < totalPages;
            const hasPrevPage = page > 1;
            const result = {
                products,
                pagination: {
                    currentPage: page,
                    totalPages,
                    hasNextPage,
                    hasPrevPage,
                    nextPage: hasNextPage?page+1:null,
                    prevPage: hasPrevPage?page-1:null
                }
            };
            await cache.set(cacheKey, JSON.stringify(result));
            return result;
        }catch(err){
            dbgr("Error in fetching products: ", err);
            throw err;
        }
    }

    async addToCart(productId, user){
        try{
            dbgr("Adding to cart in service layer: ", {user, productId});
            const product = await productModel.findById(productId);
            dbgr("Fetched product: ", product);
            if(!product){
                dbgr("Product not found with id: ", productId);
                throw new Error('Product not found');
            }
            user = await userModel.findById(user._id) || await ownerModel.findById(user._id);
            const userProducts = user.cart.map(item => item.productId.toString());
            dbgr("User's current cart products: ", userProducts);
            if(userProducts.includes(productId)){
                dbgr("Product already in cart: ", productId);
                return user;
            }
            user.cart.push({ productId, quantity: 1 });
            await user.save();
            dbgr("Product added to cart: ", user);

            await cache.delPattern(`cart:*`);
            await cache.delPattern('user:*');

            return user;
        }catch(err){
            dbgr("Error in adding to cart: ", err);
            throw err;
        }
    }

}

module.exports = new ProductService();