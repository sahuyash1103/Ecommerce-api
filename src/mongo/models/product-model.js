const mongoose = require('mongoose');

const productModelSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    productImages: {
        type: [String],
        required: true,
    },
    productCategory: {
        type: [mongoose.SchemaType.Types.ObjectId],
        required: true,
        ref: 'Categories'

    },
    productDiscription: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 200,
    },
    productAvailability: {
        type: Boolean,
        required: true,
    },
    productPrice: {
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