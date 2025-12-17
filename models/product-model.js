const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'owner',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        enum: ['electronics','accessories', 'clothes', 'books', 'home', 'beauty', 'sports', 'other'],
        default: 'other'
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user' || 'owner'
        }
    ],
    images: [
        {
            type: String,
            required: true
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

productSchema.index({ name: 'text' });

productSchema.index({ category: 1 });

module.exports = mongoose.model('product', productSchema);