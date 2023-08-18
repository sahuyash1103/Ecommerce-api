const mongoose = require('mongoose');

const categoryMongoSchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 15,
        unique: true,
    },
    availability: {
        type: Boolean,
        required: true,
    },
});

const CategoryMongoModel = mongoose.model("Categories", categoryMongoSchema);

module.exports = CategoryMongoModel;