const User = require('../../mongo/models/user-model');

async function getUserOrders(email) {
    let data;
    let error = null;
    try {
        data = await User.findOne({ email: email }).select(['orders', '-_id']).populate('orders');
    } catch (e) {
        error = e;
        console.log(e);
    }
    return { data: data?.orders, error: error };
}

module.exports = { getUserOrders }