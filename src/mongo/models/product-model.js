const mongoose = require('mongoose');

const productModelSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
    },
    images: {
        type: [String],
        // required: true,
    },
    category: {
        type: [mongoose.Types.ObjectId],
        required: true,
        ref: 'Categories'

    },
    discription: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 200,
    },
    availability: {
        type: Boolean,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    totalNumberOfProduct: {
        type: Number,
        required: true,
    },
    numberOfProductSold: {
        type: Number,
        required: true,
    },
});

const ProductMongoModel = mongoose.model("Products", productModelSchema);

module.exports = ProductMongoModel;