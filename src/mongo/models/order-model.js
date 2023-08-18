const mongoose = require('mongoose');

const orderMongoSchema = new mongoose.Schema({
    createdOn: {
        type: String,
        required: true,
    },
    completedOn: {
        type: String,
        required: true,
    },
    products: {
        type: [mongoose.SchemaType.Types.ObjectId],
        required: true,
        ref: 'Products'
    },
    totalPrice: {
        type: String,
        required: true,
    },

});

const OrderMongoModel = mongoose.model("Orders", orderMongoSchema);

module.exports = OrderMongoModel;