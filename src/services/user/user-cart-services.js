const User = require('../../mongo/models/user-model');

async function getUserCart(email) {
    let data;
    let error = null;
    try {
        data = await User.findOne({ email: email }).select(['cart', '-_id']).populate('cart.product');
    } catch (e) {
        error = e;
        console.log(e);
    }
    return { data: data?.cart, error: error };
}


module.exports = { getUserCart }