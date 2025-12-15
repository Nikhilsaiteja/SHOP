const ProductService = require('../../services/productService');

const dbgr = require('debug')('app:productController');

const createProduct = async(req,res,next)=>{
    try{
        dbgr("Request received in controller layer: ", req.body);
        const { name, price, discount, category } = req.body;
        const ownerId = req.user._id;

        dbgr("Files received: ", req.files);
        const images = req.files;

        const newProduct = await ProductService.createProduct(name, ownerId, price, discount, category, images);
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

const likeProduct = async(req,res,next)=>{
    try{
        const productId = req.params.productId;
        const userId = req.user._id;
        dbgr("Liking product in controller layer: ", {productId, userId});

        const updatedProduct = await ProductService.likeProduct(productId, userId);
        dbgr("Response from service layer: ", updatedProduct);
        res.status(200).json({
            message: 'Product liked successfully',
            success: true,
            product: updatedProduct,
            timestamp: new Date().toISOString()
        });
    }catch(err){
        dbgr("Error in controller layer while liking product: ", err);
        next(err);
    }
}

module.exports = {
    createProduct,
    likeProduct
};