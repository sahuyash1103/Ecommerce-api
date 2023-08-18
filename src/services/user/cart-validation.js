const joi = require("joi");

async function validateAddToCartData(data) {
    const schema = joi.object({
        quantity: joi.number().required(),
        productId: joi.string().required(),
    });

    try {
        await schema.validateAsync(data);
    } catch (err) {
        return err;
    }
}

module.exports = { validateAddToCartData };
