const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY, JWT_EXP_TIME } = require("../../utils/get-env");

const cartSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: true,
    },
    product: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'Products'
    }
});

const userMongoSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
    },
    phone: {
        type: String,
        required: false,
        minlength: 3,
        maxlength: 10,
    },
    email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 1024,
    },
    cart: {
        type: [cartSchema],
        unique: true,
    },
    orders: {
        type: [mongoose.Types.ObjectId],
        unique: true,
        ref: 'Orders'
    },
});

userMongoSchema.methods.genrateAuthToken = function () {
    return jwt.sign(
        { _id: this._id, name: this.name, email: this.email, phone: this.phone },
        JWT_PRIVATE_KEY,
        { expiresIn: JWT_EXP_TIME }
    );
};

const UserMongoModel = mongoose.model("Users", userMongoSchema);

module.exports = UserMongoModel;