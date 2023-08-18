const User = require('../../mongo/models/user-model');

async function getUserCart(email) {
    let cart;
    let error = null;
    try {
        cart = await User.findOne({ email: email }).select('cart').populate('cart');
    } catch (e) {
        error = e;
        console.log(e);
    }
    return { data: cart, error: error };
}


module.exports = { getUserCart }