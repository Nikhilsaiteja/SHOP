const productModel = require('../models/product-model');
const ownerModel = require('../models/owner-model');

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

    async getAllProducts(){
        try{
            const cacheKey = 'products:all';
            const cacheProducts = await cache.get(cacheKey);
            if(cacheProducts){
                dbgr("Products fetched from cache: ", cacheProducts);
                return JSON.parse(cacheProducts);
            }

            const products = await productModel.find({});
            dbgr("Fetched products: ", products);

            await cache.set(cacheKey, JSON.stringify(products));
            return products;
        }catch(err){
            dbgr("Error in fetching products: ", err);
            throw err;
        }
    }

}

module.exports = new ProductService();