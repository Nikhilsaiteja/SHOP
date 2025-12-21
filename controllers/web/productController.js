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
        req.flash('success', 'Product created successfully');
        res.redirect('/dashboard');
    }catch(err){
        dbgr("Error in controller layer while creating product: ", err);
        req.flash('error', err.message || 'Error creating product');
        res.redirect('/create-product');
    }
}

const likeProduct = async(req,res,next)=>{
    try{
        const productId = req.params.productId;
        const userId = req.user._id;
        dbgr("Liking product in controller layer: ", {productId, userId});

        const updatedProduct = await ProductService.likeProduct(productId, userId);
        dbgr("Response from service layer: ", updatedProduct);
        res.redirect('/dashboard');
    }catch(err){
        dbgr("Error in controller layer while liking product: ", err);
        req.flash('error', err.message || 'Error liking product');
        res.redirect('/dashboard');
    }
}

const addToCart = async(req,res,next)=>{
    try{
        const productId = req.params.productId;
        const user = req.user;
        dbgr("Adding to cart in controller layer: ", {productId, user});
        const updatedUser = await ProductService.addToCart(user, productId);
        dbgr("Response from service layer: ", updatedUser);
        req.flash('success', 'Product added to cart successfully');
        res.redirect('/dashboard');
    }catch(err){
        dbgr("Error in controller layer while adding to cart: ", err);
        req.flash('error', err.message || 'Error adding to cart');
        res.redirect('/dashboard');
    }
}

module.exports = {
    createProduct,
    likeProduct,
    addToCart
};