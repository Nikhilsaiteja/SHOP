const ProductService = require('../../services/productService');

const dbgr = require('debug')('app:productController');

const createProduct = async(req,res,next)=>{
    try{
        dbgr("Request received in controller layer: ", req.body);
        const { name, ownerId, price, discount, category } = req.body;

        const newProduct = await ProductService.createProduct(name, ownerId, price, discount, category);
        dbgr("Response from service layer: ", newProduct);
        res.status(201).json({
            message: 'Product created successfully',
            success: true,
            product: newProduct,
            timestamp: new Date().toISOString()
        });
    }catch(err){
        dbgr("Error in controller layer while creating product: ", err);
        next(err);
    }
}

module.exports = {
    createProduct
}