const Order = require('../../mongo/models/order-model');
const { setExKey, getKey } = require('../../redis/redis-services');
const { getProductDetails } = require('../product/product-services');

async function getOrderDetails(orderId) {
    let order;
    let isCached = false;
    let error = '';
    try {
        const cacheResults = await getKey(orderId);

        if (cacheResults) {
            isCached = true;
            order = new Order(cacheResults);

            if (!order) {
                deleteKey(orderId);
                isCached = false;
                order = await Order.findById(orderId).populate('products');
                if (order) {
                    setExKey(orderId, order);
                }
            }
        } else {
            order = await Order.findById(orderId).populate('products');
            if (order) {
                setExKey(orderId, order);
            }
        }

    } catch (e) {
        error = e;
        console.log(e);
    }
    return { data: order, isCached: isCached, error: error };
}

const verifyProductsAndGetTotalPrice = async (cart) => {
    let total = 0;
    let errors = [];
    let validProducts = [];
    try {
        for (let i = 0; i < cart.length; i++) {
            const cartProduct = cart[i];
            let result = await getProductDetails(cartProduct.product)
            if (result.error) {
                errors.push({ error: result.error, productId: cartProduct.product });
                continue;
            }
            let product = result.data;
            if (!product) {
                errors.push({ error: 'product not found', productId: cartProduct.product });
                continue;
            }

            if (!product.availability) {
                errors.push({ error: 'product is sold out', productId: cartProduct.product });
                continue;
            }
            total += product.price * cartProduct?.quantity;
            validProducts.push(String(product._id));
        }
    } catch (e) {
        console.log(e);
        errors.push({ error: e });
    }
    return { total: total, errors: errors, validProducts: validProducts };
}

async function PlaceOrder(cart) {
    const createdOn = new Date();
    const result = await verifyProductsAndGetTotalPrice(cart);

    let newOrder = new Order({
        products: result?.validProducts,
        totalPrice: result?.total,
        createdOn: createdOn.toDateString(),
        completedOn: '',
        isCompleted: false,
    });

    newOrder.save();
    setExKey(newOrder._id, newOrder);

    return { newOrder: newOrder, logs: result };
}

module.exports = { getOrderDetails, PlaceOrder }