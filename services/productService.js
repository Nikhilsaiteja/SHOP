const productModel = require('../models/product-model');
const ownerModel = require('../models/owner-model');

const dbgr = require('debug')('app:services:productService');

const mongoose = require('mongoose');

class ProductService{

    async createProduct(name, ownerId, price, discount, category){
        const session = await mongoose.startSession();
        try{
            dbgr('Data received in service layer: ', {name, ownerId, price, discount, category});
            session.startTransaction();

            const owner = await ownerModel.findById(ownerId).session(session);
            if(!owner){
                dbgr("Owner not found with id: ", ownerId);
                throw new Error('Owner not found');
            }
            
            const newProduct = await productModel.create([{
                name,
                owner: ownerId,
                price,
                discount,
                category
            }], { session });

            owner.products.push(newProduct[0]._id);
            await owner.save({ session });

            await session.commitTransaction();
            dbgr("Product created successfully: ", newProduct[0]);
            return newProduct[0];
            
        }catch(err){
            dbgr("Error in creating product: ", err);
            await session.abortTransaction();
            throw err;
        }finally{
            session.endSession();
        }
    }

}

module.exports = new ProductService();